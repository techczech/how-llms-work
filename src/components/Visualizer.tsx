import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
} from 'lucide-react'
import { steps, BLOG_URL, GIST_URL } from '@/data/steps'
import { CodePanel } from './CodePanel'
import { DiagramPanel } from './DiagramPanel'
import { NarrativePanel } from './NarrativePanel'
import { useTheme } from '@/context/Theme'
import { ThemeToggle } from './ThemeToggle'

type Mode = 'auto' | 'step'

export function Visualizer({ onBack, initialStep = 0 }: { onBack?: () => void; initialStep?: number }) {
  const { theme } = useTheme()
  const d = theme === 'dark'
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [mode, setMode] = useState<Mode>('step')
  const [isPlaying, setIsPlaying] = useState(false)
  const [showExpandable, setShowExpandable] = useState(false)

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  // Auto-play
  useEffect(() => {
    if (mode !== 'auto' || !isPlaying) return
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1)
      else setIsPlaying(false)
    }, step.duration)
    return () => clearTimeout(timer)
  }, [mode, isPlaying, currentStep, step.duration])

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) { setCurrentStep((s) => s + 1); setShowExpandable(false) }
  }, [currentStep])

  const handlePrev = useCallback(() => {
    if (currentStep > 0) { setCurrentStep((s) => s - 1); setShowExpandable(false) }
  }, [currentStep])

  const handleReset = useCallback(() => {
    setCurrentStep(0); setIsPlaying(false); setShowExpandable(false)
  }, [])

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); handleNext() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); handlePrev() }
      else if (e.key === 'r') handleReset()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleNext, handlePrev, handleReset])

  // Banner gradient per phase category
  const gradient = (() => {
    const p = step.phase
    if (p === 'overview') return d ? 'from-gray-800 to-gray-900' : 'from-gray-600 to-gray-700'
    if (p === 'tokenizer') return 'from-blue-700 to-blue-800'
    if (p === 'autograd') return 'from-orange-600 to-orange-700'
    if (p === 'parameters' || p === 'embeddings') return 'from-indigo-600 to-indigo-700'
    if (p === 'attention') return 'from-purple-600 to-purple-700'
    if (p === 'mlp') return 'from-amber-600 to-amber-700'
    if (p === 'training') return 'from-green-700 to-green-800'
    if (p === 'optimizer') return 'from-teal-600 to-teal-700'
    if (p === 'inference') return 'from-emerald-600 to-emerald-700'
    if (p === 'scaling') return 'from-violet-600 to-violet-700'
    return 'from-gray-700 to-gray-800'
  })()

  return (
    <div className={`h-screen flex flex-col ${d ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradient} text-white px-6 py-3 shrink-0`}>
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="flex items-center gap-0.5 text-xs text-white/60 hover:text-white transition-colors shrink-0">
                <ChevronLeft className="w-3.5 h-3.5" /> Home
              </button>
            )}
            <div className="flex items-center gap-3 mb-0.5">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-medium shrink-0">
                {currentStep + 1} / {steps.length}
              </span>
              <span className="text-white/80 text-sm font-medium">{step.title}</span>
              <span className="text-white/50 text-sm hidden md:inline">— {step.subtitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle className="text-white/60 hover:text-white hover:bg-white/10" />
            <a href={GIST_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors">
              Gist <ExternalLink className="w-3 h-3" />
            </a>
            <a href={BLOG_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-white/80 hover:text-white transition-colors">
              Karpathy's Blog Post <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={`flex items-center justify-between px-4 py-1.5 border-b shrink-0 ${d ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <span className={`text-[10px] hidden sm:inline ${d ? 'text-gray-500' : 'text-gray-400'}`}>← → arrows or click to navigate</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setMode(mode === 'auto' ? 'step' : 'auto')}
            className={cn('px-2 py-0.5 text-xs rounded transition-colors', mode === 'auto' ? 'bg-green-100 text-green-700' : d ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')}>
            {mode === 'auto' ? 'Auto' : 'Step'}
          </button>
          <div className={`w-px h-4 mx-1 ${d ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <button onClick={handlePrev} disabled={currentStep === 0}
            className={`p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${d ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <SkipBack className={`w-3.5 h-3.5 ${d ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
          {mode === 'auto' ? (
            <button onClick={() => setIsPlaying(!isPlaying)} className={`p-1 rounded transition-colors ${d ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              {isPlaying ? <Pause className={`w-3.5 h-3.5 ${d ? 'text-gray-400' : 'text-gray-600'}`} /> : <Play className={`w-3.5 h-3.5 ${d ? 'text-gray-400' : 'text-gray-600'}`} />}
            </button>
          ) : (
            <button onClick={handleNext} disabled={isLastStep}
              className="p-1 rounded bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={handleNext} disabled={isLastStep}
            className={`p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${d ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <SkipForward className={`w-3.5 h-3.5 ${d ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
          <div className={`w-px h-4 mx-1 ${d ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <button onClick={handleReset} className={`p-1 rounded transition-colors ${d ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <RotateCcw className={`w-3.5 h-3.5 ${d ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className={`h-1 shrink-0 ${d ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <motion.div className="h-full bg-green-500" initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
      </div>

      {/* Step pills */}
      <div className={`flex px-3 py-1 border-b gap-1 overflow-x-auto shrink-0 ${d ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        {steps.map((s, i) => (
          <button key={s.id}
            onClick={() => { setCurrentStep(i); setShowExpandable(false) }}
            className={cn(
              'px-2 py-0.5 rounded text-[10px] transition-colors whitespace-nowrap',
              i === currentStep ? (d ? 'bg-white text-gray-900' : 'bg-gray-800 text-white')
                : i < currentStep ? 'bg-green-100 text-green-700'
                  : d ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            )}>
            {s.title}
          </button>
        ))}
      </div>

      {/* Main 3-panel layout */}
      <div className="flex-1 flex overflow-hidden p-3 gap-3 min-h-0">
        {/* Left: Code */}
        <div className="w-[38%] flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            <motion.div key={step.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="h-full">
              <CodePanel code={step.code} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Center: Narrative */}
        <div className="w-[32%] flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            <motion.div key={step.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="h-full">
              <NarrativePanel step={step} showExpandable={showExpandable} onToggleExpandable={() => setShowExpandable(!showExpandable)} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Diagram */}
        <div className="w-[30%] flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            <motion.div key={step.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="h-full">
              <DiagramPanel phase={step.phase} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
