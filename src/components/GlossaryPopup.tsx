import { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ChevronLeft, ChevronRight, Pin } from 'lucide-react'
import { glossary, type GlossaryEntry, glossaryCategories } from '@/data/glossary'
import { steps } from '@/data/steps'
import { useTheme } from '@/context/Theme'
import { CopyToChatbot } from './CopyToChatbot'

interface GlossaryPopupProps {
  termId: string | null
  onClose: () => void
  onOpenTerm: (termId: string) => void
  onNavigateStep?: (stepIndex: number) => void
  /** If provided, enables the pin button */
  onPin?: (termId: string) => void
  pinnedIds?: Set<string>
}

const stepIndexById = new Map(steps.map((s, i) => [s.id, i]))
const termIndex = new Map(glossary.map((g, i) => [g.id, i]))

export function GlossaryPopup({ termId, onClose, onOpenTerm, onNavigateStep, onPin, pinnedIds }: GlossaryPopupProps) {
  const { theme } = useTheme()
  const d = theme === 'dark'
  const entry = termId ? glossary.find((g) => g.id === termId) : null
  const overlayRef = useRef<HTMLDivElement>(null)

  const currentIndex = termId ? termIndex.get(termId) ?? -1 : -1
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < glossary.length - 1

  const goTo = useCallback((dir: -1 | 1) => {
    const nextIdx = currentIndex + dir
    if (nextIdx >= 0 && nextIdx < glossary.length) {
      onOpenTerm(glossary[nextIdx].id)
    }
  }, [currentIndex, onOpenTerm])

  // Keyboard: Escape, Left, Right
  useEffect(() => {
    if (!entry) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && hasPrev) { e.preventDefault(); goTo(-1) }
      else if (e.key === 'ArrowRight' && hasNext) { e.preventDefault(); goTo(1) }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [entry, onClose, hasPrev, hasNext, goTo])

  const seeAlsoEntries = (entry?.seeAlso ?? [])
    .map((id) => glossary.find((g) => g.id === id))
    .filter((g): g is GlossaryEntry => !!g)

  const isPinned = termId ? pinnedIds?.has(termId) : false

  return (
    <AnimatePresence>
      {entry && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Card */}
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className={`relative w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden ${
              d ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            {/* Header */}
            <div className={`px-6 py-4 border-b flex items-start justify-between gap-3 ${
              d ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                {/* Prev/Next */}
                <button
                  onClick={() => goTo(-1)}
                  disabled={!hasPrev}
                  className={`shrink-0 p-1 rounded transition-colors disabled:opacity-20 disabled:cursor-not-allowed ${
                    d ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                  }`}
                  title="Previous term (←)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="min-w-0">
                  <h3 className={`text-lg font-semibold truncate ${d ? 'text-white' : 'text-gray-900'}`}>
                    {entry.term}
                  </h3>
                  <span className={`text-[10px] ${d ? 'text-gray-500' : 'text-gray-400'}`}>
                    {currentIndex + 1} / {glossary.length} · ← → to browse
                  </span>
                </div>
                <button
                  onClick={() => goTo(1)}
                  disabled={!hasNext}
                  className={`shrink-0 p-1 rounded transition-colors disabled:opacity-20 disabled:cursor-not-allowed ${
                    d ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                  }`}
                  title="Next term (→)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <CopyToChatbot
                  type="glossary"
                  title={entry.term}
                  category={glossaryCategories.find(c => c.id === entry.category)?.label}
                  className={`p-1.5 rounded-lg transition-colors ${d ? 'text-gray-500 hover:bg-gray-700 hover:text-purple-400' : 'text-gray-400 hover:bg-purple-50 hover:text-purple-600'}`}
                />
                {onPin && (
                  <button
                    onClick={() => onPin(entry.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isPinned
                        ? 'bg-purple-500/20 text-purple-400'
                        : d ? 'hover:bg-gray-700 text-gray-500' : 'hover:bg-gray-200 text-gray-400'
                    }`}
                    title={isPinned ? 'Unpin from comparison' : 'Pin to compare side by side'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className={`p-1.5 rounded-lg transition-colors ${
                    d ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <p className={`text-sm leading-relaxed ${d ? 'text-gray-300' : 'text-gray-600'}`}>
                {entry.definition}
              </p>

              {/* Related steps */}
              {onNavigateStep && entry.relatedSteps.length > 0 && (
                <div>
                  <div className={`text-xs font-medium mb-2 ${d ? 'text-gray-500' : 'text-gray-400'}`}>
                    See in walkthrough
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.relatedSteps.map((stepId) => {
                      const idx = stepIndexById.get(stepId)
                      const step = steps.find((s) => s.id === stepId)
                      if (idx === undefined || !step) return null
                      return (
                        <button
                          key={stepId}
                          onClick={() => { onClose(); onNavigateStep(idx) }}
                          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                            d
                              ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          }`}
                        >
                          <ArrowRight className="w-3 h-3" />
                          {step.title}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Related terms with previews */}
              {seeAlsoEntries.length > 0 && (
                <div>
                  <div className={`text-xs font-medium mb-2 ${d ? 'text-gray-500' : 'text-gray-400'}`}>
                    Related terms
                  </div>
                  <div className="space-y-2">
                    {seeAlsoEntries.map((sa) => (
                      <button
                        key={sa.id}
                        onClick={() => onOpenTerm(sa.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors border ${
                          d
                            ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                        }`}
                      >
                        <div className={`text-xs font-semibold mb-0.5 ${d ? 'text-gray-200' : 'text-gray-700'}`}>
                          {sa.term}
                        </div>
                        <div className={`text-[11px] leading-relaxed line-clamp-2 ${d ? 'text-gray-400' : 'text-gray-500'}`}>
                          {sa.definition}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
