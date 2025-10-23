import { useState } from 'react'
import SplashScreen from './components/SplashScreen'
import StartScreen from './pages/StartScreen'
import './App.css'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return <StartScreen />
}

export default App
