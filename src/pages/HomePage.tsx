import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Typewriter from "../components/Typewriter";
import { useJournal } from '../contexts/JournalContext';
import { Clock, Sparkles } from 'lucide-react';

function JournalCountdown({ lastEntryTime }: { lastEntryTime: Date | null }) {
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isUrgent, setIsUrgent] = useState<boolean>(false);

  useEffect(() => {
    if (!lastEntryTime) {
      setMessage("Ready to start your journaling journey?");
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const nextJournalTime = new Date(lastEntryTime);
      nextJournalTime.setHours(nextJournalTime.getHours() + 24);
      const diff = nextJournalTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining(null);
        setMessage("It's time for your daily reflection! ✨");
        setIsUrgent(true);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining({ hours, minutes, seconds });

      if (hours < 1) setMessage("Almost time for your daily reflection!");
      else if (hours < 6) setMessage("Your journal is waiting for your thoughts...");
      else if (hours < 12) setMessage("Great time to reflect on your day!");
      else setMessage("Keep up your amazing journaling streak!");
      setIsUrgent(hours < 1);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lastEntryTime]);

  if (!lastEntryTime) {
    return (
      <div className="bg-gradient-to-r from-primary-50 to-sage-50 rounded-xl p-6 border border-primary-200">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold gradient-text">
            Your thoughts, guided by empathy
          </h3>
          <Sparkles className="w-5 h-5 text-primary-600" />
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold gradient-text py-2 rounded-md">
            <Typewriter 
              textArray={[
                "Interactive Dashboard",
                "Personalized Prompts",
                "Daily Insights"
              ]} 
              speed={100} 
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Start your first entry to begin tracking your journey
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Align yourself with your goals, your reflections, and your life: One entry at a time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 border transition-all duration-300 ${
      isUrgent ? 'bg-gradient-to-r from-warm-50 to-orange-50 border-warm-200 shadow-lg' 
               : 'bg-gradient-to-r from-primary-50 to-sage-50 border-primary-200'
    }`}>
      <div className="flex items-center justify-center space-x-3 mb-4">
        <Clock className={`w-5 h-5 ${isUrgent ? 'text-warm-600' : 'text-primary-600'}`} />
                 <h3 className={`text-lg font-semibold gradient-text py-2 rounded-md ${isUrgent ? 'text-warm-900' : 'text-gray-900'}`}>
          Next Journal Time
        </h3>
      </div>
      <p className="text-center text-gray-700 mb-4">{message}</p>

      {timeRemaining ? (
        <div className="text-center">
          <div className="flex justify-center space-x-4 mb-3">
            {['hours','minutes','seconds'].map((unit, idx) => (
              <div key={idx} className="text-center">
                <div className={`text-2xl font-bold ${isUrgent ? 'text-warm-600' : 'text-primary-600'}`}>
                  {timeRemaining[unit as keyof typeof timeRemaining].toString().padStart(2,'0')}
                </div>
                <div className="text-xs text-gray-500">{unit.charAt(0).toUpperCase()+unit.slice(1)}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Last entry: {lastEntryTime.toLocaleDateString()} at {lastEntryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-2xl font-bold text-warm-600 mb-2">Time to Journal!</div>
          <p className="text-sm text-gray-600">Your daily reflection awaits</p>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const { entries } = useJournal();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setShowLogin(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      alert("Account created! You can now log in.");
      setIsRegistering(false);
      setShowLogin(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Logout
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUsername("");
    setPassword("");
    setShowLogin(false);
  };

  const todayEntries = entries.filter(entry => {
    const today = new Date();
    return entry.date.toDateString() === today.toDateString();
  });
  const hasWrittenToday = todayEntries.length > 0;
  const lastEntryTime = entries.length > 0 ? entries[0].date : null;

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-primary-50 via-white to-sage-50">
      
      {/* Top Right Login / Register / Logout */}
      <div className="absolute top-6 right-6 flex items-center gap-x-3">
        {!token && (
          <>
            <button
              onClick={() => { setShowLogin(true); setIsRegistering(false); }}
              className="font-semibold gradient-text-hover py-2 px-4 rounded-md"
            >
              Login
            </button>
            <button
              onClick={() => { setShowLogin(true); setIsRegistering(true); }}
              className="font-semibold gradient-text-hover py-2 px-4 rounded-md"
            >
              Register
            </button>
          </>
        )}

        {token && (
          <>
            <span className="text-teal-500 font-semibold">{username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-200 text-white py-1 px-3 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
          <Typewriter textArray={["Weelcome to Aline"]} speed={120} />
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-prose mx-auto mb-10">
          Transform your daily reflections into meaningful insights. Our empathetic AI helps you maintain a consistent journaling practice while preserving your complete privacy.
        </p>

        {/* Login/Register */}
        {!token && showLogin && (
          <div className="mx-auto max-w-sm bg-white p-6 rounded-xl shadow-md mb-10">
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            <form 
              onSubmit={isRegistering ? handleRegister : handleLogin} 
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded-md p-2"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-md p-2"
              />
              <button
                type="submit"
                className="w-full font-semibold gradient-text-hover py-2 rounded-md"
              >
                {isRegistering ? "Register" : "Login"}
              </button>
            </form>
          </div>
        )}

        {/* Countdown Widget */}
        <div className="mt-8 mb-10">
          <JournalCountdown lastEntryTime={lastEntryTime} />
        </div>

        {/* Journaling Buttons */}
        {token && (
          <div className="flex items-center justify-center gap-x-6 ">
            {hasWrittenToday ? (
              <Link to="/journal" className="text-green-600 border border-green-600 px-4 py-2 rounded-md font-semibold hover:text-green-800 hover:border-green-800 transition-colors">
                Continue Journaling
              </Link>
            ) : (
              <Link to="/journal" className="text-teal-500  border border-green-600 px-4 py-2 rounded-md font-semibold hover:text-green-800 hover:border-green-800 transition-colors">
                Start Today's Entry
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
