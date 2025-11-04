import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import SplashScreen from './components/SplashScreen.jsx'
import StartScreen from './pages/StartScreen.jsx'
import SignUp from './pages/SignUp.jsx'
import LogIn from './pages/LogIn.jsx'
import Homepage from './pages/Homepage.jsx'
import Search from './pages/Search.jsx'
import FilterResults from './pages/FilterResults.jsx'
import PlatformResults from './pages/PlatformResults.jsx'
import ContentTypeResults from './pages/ContentTypeResults.jsx'
import Favorites from './pages/Favorites.jsx'
import Profile from './pages/Profile.jsx'
import DetailsScreen from './pages/DetailsScreen.jsx'

import './App.css'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashComplete = () => {
    console.log('Splash screen completed, showing main app');
    setShowSplash(false)
  }

  // Emergency fallback - if splash doesn't complete after 6 seconds, skip it
  useEffect(() => {
    const emergencyTimer = setTimeout(() => {
      console.log('Emergency fallback - forcing app to show');
      setShowSplash(false);
    }, 6000);

    return () => clearTimeout(emergencyTimer);
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/filter-results" element={<FilterResults />} />
        <Route path="/platform-results" element={<PlatformResults />} />
        <Route path="/content-type-results" element={<ContentTypeResults />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/details" element={<DetailsScreen />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
