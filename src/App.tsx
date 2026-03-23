import { useState, useEffect, useCallback } from 'react'
import { Landing } from '@/components/Landing'
import { Visualizer } from '@/components/Visualizer'
import { Pedagogy } from '@/components/Pedagogy'
import { ThemeProvider } from '@/context/Theme'

type View = 'landing' | 'visualizer' | 'pedagogy'

function viewFromPath(path: string): View {
  if (path === '/pedagogy') return 'pedagogy'
  return 'landing'
}

function App() {
  const [view, setView] = useState<View>(() => viewFromPath(window.location.pathname))
  const [initialStep, setInitialStep] = useState(0)

  const navigate = useCallback((v: View, path: string) => {
    setView(v)
    window.history.pushState(null, '', path)
  }, [])

  useEffect(() => {
    const onPop = () => setView(viewFromPath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const handleStart = (stepIndex?: number) => {
    setInitialStep(stepIndex ?? 0)
    navigate('visualizer', '/')
  }

  return (
    <ThemeProvider>
      {view === 'visualizer' ? (
        <Visualizer initialStep={initialStep} onBack={() => navigate('landing', '/')} />
      ) : view === 'pedagogy' ? (
        <Pedagogy onBack={() => navigate('landing', '/')} onStart={() => handleStart()} />
      ) : (
        <Landing onStart={handleStart} onPedagogy={() => navigate('pedagogy', '/pedagogy')} />
      )}
    </ThemeProvider>
  )
}

export default App
