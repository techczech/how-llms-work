import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, BookOpen, Search, X, ArrowRight, Pin } from 'lucide-react'
import { glossary, glossaryCategories } from '@/data/glossary'
import { steps } from '@/data/steps'
import { useTheme } from '@/context/Theme'
import { ThemeToggle } from './ThemeToggle'
import { GlossaryPopup } from './GlossaryPopup'

const stepIndexById = new Map(steps.map((s, i) => [s.id, i]))

interface GlossaryProps {
  onBack: () => void
  onNavigateStep: (stepIndex: number) => void
  initialTermId?: string | null
}

export function Glossary({ onBack, onNavigateStep, initialTermId }: GlossaryProps) {
  const { theme } = useTheme()
  const d = theme === 'dark'
  const [search, setSearch] = useState('')
  const [popupTermId, setPopupTermId] = useState<string | null>(initialTermId ?? null)
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set())

  const togglePin = useCallback((id: string) => {
    setPinnedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const filtered = search.trim()
    ? glossary.filter(
        (e) =>
          e.term.toLowerCase().includes(search.toLowerCase()) ||
          e.definition.toLowerCase().includes(search.toLowerCase())
      )
    : glossary

  // Group by category
  const grouped = glossaryCategories.map((cat) => ({
    ...cat,
    entries: filtered.filter((e) => e.category === cat.id),
  })).filter((g) => g.entries.length > 0)

  const pinnedEntries = glossary.filter((e) => pinnedIds.has(e.id))

  return (
    <div className={`min-h-screen ${d ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className={`flex items-center gap-1 text-sm transition-colors ${d ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <ChevronLeft className="w-4 h-4" /> Home
          </button>
          <ThemeToggle />
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className={`w-6 h-6 ${d ? 'text-purple-400' : 'text-purple-600'}`} />
            <h1 className="text-3xl font-bold">Glossary</h1>
          </div>
          <p className={`text-sm mb-8 ${d ? 'text-gray-400' : 'text-gray-500'}`}>
            Click any term to learn more. Use <kbd className={`px-1 py-0.5 rounded text-[10px] font-mono ${d ? 'bg-gray-800' : 'bg-gray-200'}`}>←</kbd> <kbd className={`px-1 py-0.5 rounded text-[10px] font-mono ${d ? 'bg-gray-800' : 'bg-gray-200'}`}>→</kbd> to browse in the popup. Pin terms to compare side by side.
          </p>

          {/* Search */}
          <div className="relative mb-8">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${d ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search terms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
                d
                  ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-400'
              }`}
            />
          </div>

          {/* Pinned comparison strip */}
          <AnimatePresence>
            {pinnedEntries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-8"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Pin className={`w-4 h-4 ${d ? 'text-purple-400' : 'text-purple-500'}`} />
                    <span className={`text-sm font-semibold ${d ? 'text-gray-300' : 'text-gray-600'}`}>
                      Comparing {pinnedEntries.length} term{pinnedEntries.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <button
                    onClick={() => setPinnedIds(new Set())}
                    className={`text-xs transition-colors ${d ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Clear all
                  </button>
                </div>
                <div className={`grid gap-3 ${
                  pinnedEntries.length === 1 ? 'grid-cols-1' :
                  pinnedEntries.length === 2 ? 'grid-cols-2' :
                  'grid-cols-2 lg:grid-cols-3'
                }`}>
                  {pinnedEntries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`relative p-4 rounded-xl border ${
                        d ? 'bg-gray-900 border-purple-500/30' : 'bg-purple-50/50 border-purple-200'
                      }`}
                    >
                      <button
                        onClick={() => togglePin(entry.id)}
                        className={`absolute top-2 right-2 p-1 rounded transition-colors ${
                          d ? 'hover:bg-gray-800 text-gray-500' : 'hover:bg-purple-100 text-gray-400'
                        }`}
                        title="Unpin"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <h4 className={`text-sm font-semibold mb-2 pr-6 ${d ? 'text-purple-300' : 'text-purple-700'}`}>
                        {entry.term}
                      </h4>
                      <p className={`text-xs leading-relaxed mb-3 ${d ? 'text-gray-300' : 'text-gray-600'}`}>
                        {entry.definition}
                      </p>
                      {/* Step links */}
                      <div className="flex flex-wrap gap-1">
                        {entry.relatedSteps.map((stepId) => {
                          const idx = stepIndexById.get(stepId)
                          const step = steps.find((s) => s.id === stepId)
                          if (idx === undefined || !step) return null
                          return (
                            <button
                              key={stepId}
                              onClick={() => onNavigateStep(idx)}
                              className={`inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                                d
                                  ? 'bg-purple-500/15 text-purple-400 hover:bg-purple-500/25'
                                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                              }`}
                            >
                              <ArrowRight className="w-2.5 h-2.5" />
                              {step.title}
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Categorised terms */}
          <div className="space-y-8">
            {grouped.map((group, gi) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.05 }}
              >
                <div className="mb-3">
                  <h2 className={`text-sm font-semibold uppercase tracking-wider ${d ? 'text-gray-400' : 'text-gray-500'}`}>
                    {group.label}
                  </h2>
                  <p className={`text-xs ${d ? 'text-gray-600' : 'text-gray-400'}`}>{group.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.entries.map((entry) => {
                    const isPinned = pinnedIds.has(entry.id)
                    return (
                      <button
                        key={entry.id}
                        onClick={() => setPopupTermId(entry.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                          isPinned
                            ? d
                              ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                              : 'bg-purple-100 border-purple-300 text-purple-700'
                            : d
                              ? 'bg-gray-900 border-gray-800 text-gray-200 hover:bg-purple-500/15 hover:border-purple-500/30 hover:text-purple-300'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700'
                        }`}
                      >
                        {isPinned && <Pin className="w-3 h-3 inline mr-1 -mt-0.5" />}
                        {entry.term}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            ))}

            {grouped.length === 0 && (
              <p className={`text-center py-8 text-sm ${d ? 'text-gray-500' : 'text-gray-400'}`}>
                No terms match "{search}"
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Popup */}
      <GlossaryPopup
        termId={popupTermId}
        onClose={() => setPopupTermId(null)}
        onOpenTerm={setPopupTermId}
        onNavigateStep={onNavigateStep}
        onPin={togglePin}
        pinnedIds={pinnedIds}
      />
    </div>
  )
}
