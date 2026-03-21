import React, { useState, useEffect } from 'react';
import './App.css';
import MoodInput from './components/MoodInput';
import ResultCard from './components/ResultCard';
import HeatMap from './components/HeatMap';
import WeeklySummary from './components/WeeklySummary';
import Analytics from './components/Analytics';
import Navbar from './components/Navbar';
import ProfileView from './components/ProfileView';
import PatternInsight from './components/PatternInsight';
import MonthlyReport from './components/MonthlyReport';
import IntentionSetter from './components/IntentionSetter';
import CommunityMood from './components/CommunityMood';

import { supabase } from './supabaseClient';
import Auth from './components/Auth';

function App() {
  const [session, setSession] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [theme, setTheme] = useState(localStorage.getItem('moodsnap-theme') || 'dark');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      setSession(activeSession);
      if (activeSession) fetchHistory(activeSession);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) fetchHistory(newSession);
      else setHeatmapData([]); // Clear data on logout
    });

    // Apply theme on mount
    document.documentElement.classList.toggle('light-mode', theme === 'light');

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('moodsnap-theme', newTheme);
    document.documentElement.classList.toggle('light-mode', newTheme === 'light');
  };

  const fetchHistory = async (activeSession = session) => {
    if (!activeSession) return;
    try {
      const response = await fetch(`${API_BASE_URL}/history`, {
        headers: {
          'Authorization': `Bearer ${activeSession.access_token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setHeatmapData(data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleSubmit = async (text) => {
    if (!session) return;
    setIsSubmitting(true);
    setCurrentResult(null);
    setSelectedEntry(null);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/mood`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      const result = await response.json();
      setCurrentResult(result);
      setIsSubmitting(false);
      fetchHistory();
    } catch (err) {
      console.error('Error submitting mood:', err);
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const renderView = () => {
    if (!session) {
      return <Auth onAuthSuccess={setSession} />;
    }

    if (selectedEntry) {
      return (
        <div className="history-view">
          <div className="history-header">
            <button className="back-btn" onClick={() => setSelectedEntry(null)}>
              ← Back to History
            </button>
            <div className="history-date-badge">
              {new Date(selectedEntry.created_at).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
          <div className="past-input glass-panel">
            <p className="past-entry-text">"{selectedEntry.user_input}"</p>
          </div>
          <ResultCard result={selectedEntry} show={true} />
        </div>
      );
    }

    switch (currentView) {
      case 'home':
        return (
          <div className="view-container home-view animated">
            <header className="view-intro">
              <h1>Welcome Back</h1>
              <p>How are you feeling right now?</p>
            </header>
            <IntentionSetter apiUrl={API_BASE_URL} session={session} />
            <MoodInput onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            <div className="result-container">
              {error && (
                <div className="error-message glass-panel">
                  <p>{error}</p>
                  <button className="dismiss-btn" onClick={() => setError(null)}>Dismiss</button>
                </div>
              )}
              <ResultCard result={currentResult} show={!!currentResult && !isSubmitting} />
            </div>
          </div>
        );
      case 'dashboard':
        return (
          <div className="view-container dashboard-view animated">
            <div className="dashboard-grid">
              <div className="dashboard-main">
                <PatternInsight apiUrl={API_BASE_URL} session={session} />
                <WeeklySummary apiUrl={API_BASE_URL} session={session} />
                <Analytics data={heatmapData} />
              </div>
              <aside className="dashboard-sidebar glass-panel">
                <h3>Mood Journal</h3>
                <HeatMap data={heatmapData} onSelectEntry={setSelectedEntry} />
                <div style={{ marginTop: '30px' }}>
                  <MonthlyReport apiUrl={API_BASE_URL} session={session} />
                </div>
                <CommunityMood apiUrl={API_BASE_URL} />
              </aside>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="view-container profile-page animated">
            <ProfileView
              user={session.user}
              heatmapData={heatmapData}
              theme={theme}
              onToggleTheme={toggleTheme}
              onLogout={() => supabase.auth.signOut()}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <Navbar
        session={session}
        currentView={currentView}
        onViewChange={setCurrentView}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main className="app-main">
        {renderView()}
      </main>
      <footer className="app-footer-mini">
        <p>© 2026 MoodSnap • Your Mental Wellness Companion</p>
      </footer>
    </div>
  );
}

export default App;
