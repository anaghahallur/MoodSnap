require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const isSupabaseConfigured = supabaseUrl && supabaseUrl.startsWith('http') && supabaseKey && supabaseKey !== 'YOUR_SUPABASE_SERVICE_ROLE_KEY';
const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : null;

if (!supabase) console.log('⚠️ Supabase not configured or using placeholders. Data will not be persisted.');

// Initialize Gemini
const geminiApiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;
const isGeminiPlaceholder = geminiApiKey === 'YOUR_GEMINI_API_KEY' || !geminiApiKey;
const genAI = !isGeminiPlaceholder ? new GoogleGenerativeAI(geminiApiKey) : null;

if (!genAI) {
    console.log('⚠️ Gemini API key not configured or using placeholders.');
} else {
    console.log('✅ Gemini API is configured and ready.');
}

// Initialize OpenAI
const openaiApiKey = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.trim() : null;
const isOpenaiPlaceholder = openaiApiKey === 'YOUR_OPENAI_API_KEY' || !openaiApiKey;
const openai = !isOpenaiPlaceholder ? new OpenAI({ apiKey: openaiApiKey }) : null;

if (!openai) {
    console.log('⚠️ OpenAI API key not configured or using placeholders.');
} else {
    console.log('✅ OpenAI API is configured and ready.');
}

// Initialize Groq (Free & Fast)
const groqApiKey = process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.trim() : null;
const isGroqPlaceholder = groqApiKey === 'YOUR_GROQ_API_KEY' || !groqApiKey;
const groq = !isGroqPlaceholder ? new Groq({ apiKey: groqApiKey }) : null;

if (!groq) {
    console.log('⚠️ Groq API key not configured or using placeholders.');
} else {
    console.log('✅ Groq API is configured and ready.');
}

// Authentication Middleware
const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    try {
        if (!supabase) throw new Error('Supabase not configured');

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};

// Endpoint to analyze mood
app.post('/api/mood', authenticateUser, async (req, res) => {
    const { text } = req.body;
    const userId = req.user.id;
    console.log(`--- NEW MOOD SUBMISSION [User: ${userId}]: "${text}" ---`);

    if (!text || text.trim().length === 0) {
        return res.status(400).json({ message: 'How are you feeling? Please enter some text.' });
    }

    try {
        // Fetch today's intention if it exists
        let todayIntention = null;
        if (supabase) {
            const today = new Date().toISOString().split('T')[0];
            const { data: intentionData } = await supabase
                .from('intentions')
                .select('intention')
                .eq('user_id', userId)
                .gte('created_at', `${today}T00:00:00.000Z`)
                .order('created_at', { ascending: false })
                .limit(1);

            if (intentionData && intentionData.length > 0) {
                todayIntention = intentionData[0].intention;
            }
        }

        const intentionInstruction = todayIntention
            ? `Special context: This morning, the user set an intention to feel "${todayIntention}". In your "message" field, briefly acknowledge how this mood aligns or doesn't with that intention.`
            : "";

        // Fetch last 5 tips for THIS user to ensure uniqueness
        let pastTips = [];
        if (supabase) {
            const { data: recentEntries } = await supabase
                .from('mood_entries')
                .select('tip')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(5);

            if (recentEntries) {
                pastTips = recentEntries.map(e => e.tip).filter(t => t);
            }
        }

        const uniquenessInstruction = pastTips.length > 0
            ? `IMPORTANT: Avoid repeating these recently given tips: [${pastTips.join(', ')}]. Provide a DIFFERENT actionable suggestion.`
            : "";

        let result;

        // AI logic remains same...
        if (groq) {
            try {
                const response = await groq.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: `You are a mental wellness assistant. Analyze the user's emotion and provide a structured JSON response with exactly: emotion (label), emoji (single), message (empathetic one-liner), and tip (small actionable step). ${intentionInstruction} ${uniquenessInstruction}`
                        },
                        { role: "user", content: text }
                    ],
                    model: "llama-3.3-70b-versatile",
                    response_format: { type: "json_object" }
                });
                result = JSON.parse(response.choices[0].message.content);
            } catch (err) { console.error('Groq Error'); }
        }

        if (!result && openai) {
            try {
                const response = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: `You are a mental wellness assistant. Analyze the user's emotion and provide a structured JSON response with exactly: emotion (label), emoji (single), message (empathetic one-liner), and tip (small actionable step). ${intentionInstruction} ${uniquenessInstruction}`
                        },
                        { role: "user", content: text }
                    ],
                    response_format: { type: "json_object" }
                });
                result = JSON.parse(response.choices[0].message.content);
            } catch (err) { console.error('OpenAI Error'); }
        }

        if (!result && genAI) {
            try {
                const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
                const prompt = `Analyze: "${text}". JSON: emotion, emoji, message, tip. ${intentionInstruction} ${uniquenessInstruction}`;
                const aiResponse = await model.generateContent(prompt);
                const jsonStr = aiResponse.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                result = JSON.parse(jsonStr);
            } catch (err) { console.error('Gemini Error'); }
        }

        if (!result) {
            result = { emotion: 'neutral', emoji: '☁️', message: 'I am here to listen.', tip: 'Take a deep breath.' };
        }

        // Save to Supabase with user_id
        if (supabase) {
            const { error } = await supabase
                .from('mood_entries')
                .insert([{
                    user_id: userId,
                    user_input: text,
                    emotion: result.emotion,
                    emoji: result.emoji,
                    message: result.message,
                    tip: result.tip,
                    created_at: new Date().toISOString()
                }]);

            if (error) console.error('Supabase Save Error:', error);
        }

        res.json(result);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ message: 'Failed to analyze mood.' });
    }
});

app.post('/api/intentions', authenticateUser, async (req, res) => {
    const { intention } = req.body;
    const userId = req.user.id;
    if (!intention) return res.status(400).json({ message: 'What is your intention?' });

    try {
        if (!supabase) return res.json({ success: true, message: 'Supabase not configured.' });

        const { error } = await supabase
            .from('intentions')
            .insert([{ user_id: userId, intention, created_at: new Date().toISOString() }]);

        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        console.error('Intention Save Error:', error);
        res.status(500).json({ message: 'Failed to set intention.' });
    }
});

app.get('/api/intentions/today', authenticateUser, async (req, res) => {
    const userId = req.user.id;
    try {
        if (!supabase) return res.json({ intention: null });

        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('intentions')
            .select('*')
            .eq('user_id', userId)
            .gte('created_at', `${today}T00:00:00.000Z`)
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) throw error;
        res.json({ intention: data && data.length > 0 ? data[0].intention : null });
    } catch (error) {
        console.error('Intention Fetch Error:', error);
        res.status(500).json({ message: 'Failed to fetch today\'s intention.' });
    }
});

app.get('/api/history', authenticateUser, async (req, res) => {
    const userId = req.user.id;
    try {
        if (!supabase) return res.json([]);

        const { data, error } = await supabase
            .from('mood_entries')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('History Error:', error);
        res.status(500).json({ message: 'Failed to fetch history.' });
    }
});

app.get('/api/summary', authenticateUser, async (req, res) => {
    const userId = req.user.id;
    try {
        if (!supabase) return res.json({ summary: "Connect Supabase!" });

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: entries, error } = await supabase
            .from('mood_entries')
            .select('emotion, created_at, user_input')
            .eq('user_id', userId)
            .gte('created_at', sevenDaysAgo.toISOString())
            .order('created_at', { ascending: true });

        if (error) throw error;
        if (!entries || entries.length === 0) {
            return res.json({ summary: "No entries yet this week. Keep tracking to see your summary!" });
        }

        const historyContext = entries.map(e => `[${e.created_at.split('T')[0]}] ${e.emotion}: ${e.user_input}`).join('\n');
        const summaryPrompt = `Personalized mood history for the past week:\n${historyContext}\nWrite a 3-4 sentence compassionate summary paragraph using "you" language.`;

        let summary;
        // AI Logic for summary...
        if (groq) {
            const resp = await groq.chat.completions.create({ messages: [{ role: "user", content: summaryPrompt }], model: "llama-3.3-70b-versatile" });
            summary = resp.choices[0].message.content;
        } else if (openai) {
            const resp = await openai.chat.completions.create({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: summaryPrompt }] });
            summary = resp.choices[0].message.content;
        } else if (genAI) {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const resp = await model.generateContent(summaryPrompt);
            summary = resp.response.text();
        }

        res.json({ summary: summary || "AI is restin'." });
    } catch (error) {
        console.error('Summary Error:', error);
        res.status(500).json({ message: 'Failed to generate summary.' });
    }
});

app.get('/api/patterns', authenticateUser, async (req, res) => {
    const userId = req.user.id;
    try {
        if (!supabase) return res.json({ pattern: "No pattern insights available without database." });

        // Fetch the last 7 entries for this user
        const { data: entries, error } = await supabase
            .from('mood_entries')
            .select('emotion, user_input, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(7);

        if (error) throw error;
        if (!entries || entries.length < 3) {
            return res.json({ pattern: "Keep logging! After 3-7 entries, I'll start looking for patterns in your moods." });
        }

        const patternContext = entries.map(e => {
            const date = new Date(e.created_at);
            const time = date.getHours();
            const dayType = (date.getDay() === 0 || date.getDay() === 6) ? 'Weekend' : 'Weekday';
            const timeOfDay = time < 12 ? 'Morning' : (time < 17 ? 'Afternoon' : 'Evening');
            return `[${dayType} ${timeOfDay}] ${e.emotion}: ${e.user_input}`;
        }).reverse().join('\n');

        const patternPrompt = `Analyze these last 7 mood logs for patterns (temporal, triggers, or recurring themes):\n${patternContext}\nIdentify ONE specific, insightful pattern and give a 2-3 sentence observation using "You" language. Be direct and helpful like a psychologist. Focus on "why" or "when".`;

        let pattern;
        if (groq) {
            const resp = await groq.chat.completions.create({ messages: [{ role: "user", content: patternPrompt }], model: "llama-3.3-70b-versatile" });
            pattern = resp.choices[0].message.content;
        } else if (openai) {
            const resp = await openai.chat.completions.create({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: patternPrompt }] });
            pattern = resp.choices[0].message.content;
        } else if (genAI) {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const resp = await model.generateContent(patternPrompt);
            pattern = resp.response.text();
        }

        res.json({ pattern: pattern || "Patterns are still forming..." });
    } catch (error) {
        console.error('Pattern Error:', error);
        res.status(500).json({ message: 'Failed to analyze patterns.' });
    }
});

app.get('/api/monthly-report', authenticateUser, async (req, res) => {
    const userId = req.user.id;
    try {
        if (!supabase) return res.json({ stats: null });

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const { data: entries, error } = await supabase
            .from('mood_entries')
            .select('emotion, created_at')
            .eq('user_id', userId)
            .gte('created_at', firstDayOfMonth.toISOString())
            .order('created_at', { ascending: true });

        if (error) throw error;
        if (!entries || entries.length === 0) {
            return res.json({ stats: null });
        }

        // Count emotions
        const counts = {};
        entries.forEach(e => {
            counts[e.emotion] = (counts[e.emotion] || 0) + 1;
        });

        // Find happiest day (most happy-related entries)
        const dayScores = {};
        entries.forEach(e => {
            const dateStr = e.created_at.split('T')[0];
            const isHappy = ['happy', 'joy', 'excited', 'great', 'euphonic', 'calm'].includes(e.emotion.toLowerCase());
            if (isHappy) {
                dayScores[dateStr] = (dayScores[dateStr] || 0) + 1;
            }
        });

        let happiestDay = null;
        let maxScore = -1;
        Object.keys(dayScores).forEach(day => {
            if (dayScores[day] > maxScore) {
                maxScore = dayScores[day];
                happiestDay = day;
            }
        });

        const monthName = now.toLocaleString('default', { month: 'long' });

        res.json({
            stats: {
                month: monthName,
                totalEntries: entries.length,
                moodCounts: counts,
                happiestDay: happiestDay ? new Date(happiestDay).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A',
                topMood: Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
            }
        });
    } catch (error) {
        console.error('Monthly Report Error:', error);
        res.status(500).json({ message: 'Failed to generate monthly report.' });
    }
});

app.get('/api/community-mood', async (req, res) => {
    try {
        if (!supabase) return res.json({ moods: [] });

        const last24Hours = new Date();
        last24Hours.setHours(last24Hours.getHours() - 24);

        const { data: entries, error } = await supabase
            .from('mood_entries')
            .select('emotion')
            .gte('created_at', last24Hours.toISOString());

        if (error) throw error;
        if (!entries || entries.length === 0) {
            return res.json({ total: 0, moods: [] });
        }

        const counts = {};
        entries.forEach(e => {
            const emo = e.emotion.toLowerCase().trim();
            counts[emo] = (counts[emo] || 0) + 1;
        });

        const total = entries.length;
        const moodStats = Object.entries(counts)
            .map(([label, count]) => ({
                label: label.charAt(0).toUpperCase() + label.slice(1),
                percentage: Math.round((count / total) * 100),
                count
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 4); // Top 4 moods

        res.json({ total, moods: moodStats });
    } catch (error) {
        console.error('Community Mood Error:', error);
        res.status(500).json({ message: 'Failed to fetch community mood.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
