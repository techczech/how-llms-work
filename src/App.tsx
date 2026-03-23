import { useState, useEffect, useCallback } from 'react'
import { Landing } from '@/components/Landing'
import { Visualizer } from '@/components/Visualizer'
import { Pedagogy } from '@/components/Pedagogy'
import { Glossary } from '@/components/Glossary'
import { ThemeProvider } from '@/context/Theme'

type View = 'landing' | 'visualizer' | 'pedagogy' | 'glossary'

function viewFromPath(path: string): View {
  if (path === '/pedagogy') return 'pedagogy'
  if (path === '/glossary') return 'glossary'
  return 'landing'
}

function App() {
  const [view, setView] = useState<View>(() => viewFromPath(window.location.pathname))
  const [initialStep, setInitialStep] = useState(0)
  const [glossaryTermId, setGlossaryTermId] = useState<string | null>(null)

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

  const handleGlossary = (termId?: string) => {
    setGlossaryTermId(termId ?? null)
    navigate('glossary', '/glossary')
  }

  return (
    <ThemeProvider>
      {view === 'visualizer' ? (
        <Visualizer initialStep={initialStep} onBack={() => navigate('landing', '/')} onGlossary={() => handleGlossary()} onPedagogy={() => navigate('pedagogy', '/pedagogy')} />
      ) : view === 'pedagogy' ? (
        <Pedagogy onBack={() => navigate('landing', '/')} onStart={() => handleStart()} />
      ) : view === 'glossary' ? (
        <Glossary onBack={() => navigate('landing', '/')} onNavigateStep={(idx) => handleStart(idx)} initialTermId={glossaryTermId} />
      ) : (
        <Landing onStart={handleStart} onPedagogy={() => navigate('pedagogy', '/pedagogy')} onGlossary={() => handleGlossary()} />
      )}
    </ThemeProvider>
  )
}

export default App
