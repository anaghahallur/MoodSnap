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

// Endpoint to analyze mood
app.post('/api/mood', async (req, res) => {
    const { text } = req.body;
    console.log(`--- NEW MOOD SUBMISSION: "${text}" ---`);

    if (!text || text.trim().length === 0) {
        return res.status(400).json({ message: 'How are you feeling? Please enter some text.' });
    }

    try {
        // Fetch last 5 tips to ensure uniqueness (Smart Tips feature)
        let pastTips = [];
        if (supabase) {
            const { data: recentEntries } = await supabase
                .from('mood_entries')
                .select('tip')
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

        // 1. Try Groq (Fast & Free)
        if (groq) {
            try {
                console.log('Calling Groq AI...');
                const response = await groq.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: `You are a mental wellness assistant. Analyze the user's emotion and provide a structured JSON response with exactly: emotion (label), emoji (single), message (empathetic one-liner), and tip (small actionable step). ${uniquenessInstruction}`
                        },
                        {
                            role: "user",
                            content: text
                        }
                    ],
                    model: "llama-3.3-70b-versatile",
                    response_format: { type: "json_object" }
                });

                result = JSON.parse(response.choices[0].message.content);
                console.log('Groq Parsed Result:', result);
            } catch (groqError) {
                console.error('Groq Specific Error:', groqError);
            }
        }

        // 2. Try OpenAI if Groq fails or is not configured
        if (!result && openai) {
            try {
                console.log('Calling OpenAI...');
                const response = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: `You are a mental wellness assistant. Analyze the user's emotion and provide a structured JSON response with exactly: emotion (label), emoji (single), message (empathetic one-liner), and tip (small actionable step). ${uniquenessInstruction}`
                        },
                        {
                            role: "user",
                            content: text
                        }
                    ],
                    response_format: { type: "json_object" }
                });

                result = JSON.parse(response.choices[0].message.content);
                console.log('OpenAI Parsed Result:', result);
            } catch (oaError) {
                console.error('OpenAI Specific Error:', oaError);
            }
        }

        // 3. Try Gemini
        if (!result && genAI) {
            try {
                console.log('Calling Gemini AI...');
                const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
                const prompt = `
            Analyze the following text and determine the user's emotion.
            Return a structured JSON response with exactly these fields:
            - emotion (one word label like calm, happy, sad, anxious, stressed, exhausted, etc.)
            - emoji (a single matching emoji)
            - message (a one-line empathetic message acknowledging the user's feeling)
            - tip (one small actionable thing they can do right now to feel better or maintain the mood)

            ${uniquenessInstruction}

            Text: "${text}"
          `;

                const aiResponse = await model.generateContent(prompt);
                const fullResponse = aiResponse.response.text();
                const jsonStr = fullResponse.replace(/```json/g, '').replace(/```/g, '').trim();
                result = JSON.parse(jsonStr);
                console.log('Gemini Parsed Result:', result);
            } catch (aiError) {
                console.error('Gemini Specific Error:', aiError);
            }
        }

        // Fallback
        if (!result) {
            result = {
                emotion: 'neutral',
                emoji: '☁️',
                message: 'I am here to listen, though my AI pathways are currently disconnected.',
                tip: 'Take a deep breath and remember you are doing your best.'
            };
        }

        // Save to Supabase
        if (supabase) {
            const { error } = await supabase
                .from('mood_entries')
                .insert([{
                    user_input: text,
                    emotion: result.emotion,
                    emoji: result.emoji,
                    message: result.message,
                    tip: result.tip,
                    created_at: new Date().toISOString()
                }]);

            if (error) console.error('Supabase Error:', error);
        }

        res.json(result);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ message: 'Failed to analyze mood. Please try again.' });
    }
});

app.get('/api/history', async (req, res) => {
    try {
        if (!supabase) {
            return res.json([]);
        }

        const { data, error } = await supabase
            .from('mood_entries')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('History Error:', error);
        res.status(500).json({ message: 'Failed to fetch history.' });
    }
});

// Endpoint to generate weekly summary
app.get('/api/summary', async (req, res) => {
    try {
        if (!supabase) return res.json({ summary: "Connect Supabase to see your weekly summary!" });

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: entries, error } = await supabase
            .from('mood_entries')
            .select('emotion, created_at, user_input')
            .gte('created_at', sevenDaysAgo.toISOString())
            .order('created_at', { ascending: true });

        if (error) throw error;
        if (!entries || entries.length === 0) {
            return res.json({ summary: "No entries yet this week. Keep tracking to see your summary!" });
        }

        const historyContext = entries.map(e => `[${e.created_at.split('T')[0]}] ${e.emotion}: ${e.user_input}`).join('\n');
        const summaryPrompt = `
            You are a compassionate wellness coach. Below is a user's mood history for the past week:
            ${historyContext}

            Write a short, personal summary paragraph (max 3-4 sentences) about their week. 
            Identify trends, acknowledge their struggles, and highlight positive moments. 
            Be empathetic and encouraging. Use "you" language.
        `;

        let summary;

        if (groq) {
            const response = await groq.chat.completions.create({
                messages: [{ role: "user", content: summaryPrompt }],
                model: "llama-3.3-70b-versatile"
            });
            summary = response.choices[0].message.content;
        } else if (openai) {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: summaryPrompt }]
            });
            summary = response.choices[0].message.content;
        } else if (genAI) {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const aiResponse = await model.generateContent(summaryPrompt);
            summary = aiResponse.response.text();
        }

        res.json({ summary: summary || "Our AI is taking a rest. Check back later!" });
    } catch (error) {
        console.error('Summary Error:', error);
        res.status(500).json({ message: 'Failed to generate summary.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
