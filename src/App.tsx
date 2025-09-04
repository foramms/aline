import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JournalProvider } from './contexts/JournalContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import JournalPage from './pages/JournalPage';
import DashboardPage from './pages/DashboardPage';
import InsightsPage from './pages/InsightsPage';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <JournalProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>
        </Layout>
      </Router>
    </JournalProvider>
  );
}

export default App;