import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importación de páginas
import Home from './pages/Home';
import Equipos from './pages/Equipos';
import Matches from './pages/Matches';
import MatchForm from './pages/MatchForm';
import Statistics from './pages/Statistics';
import LiveScoreBoard from './components/LiveScoreBoard';
import Login from './pages/Login';
import Register from './pages/Register';
import MatchDetails from './pages/MatchDetails';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/equipos" element={<Equipos />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/create-match" element={<MatchForm />} />
                <Route path="/edit-match/:id" element={<MatchForm />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/live-scoreboard/:matchId" element={<LiveScoreBoard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/match-details/:matchId" element={<MatchDetails />} />
              </Routes>
            </main>
          </div>
          <ToastContainer />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;