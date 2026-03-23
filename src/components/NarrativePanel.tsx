import { motion, AnimatePresence } from 'framer-motion'
import type { Step } from '@/data/steps'
import { BLOG_URL } from '@/data/steps'

interface NarrativePanelProps {
  step: Step
  showExpandable: boolean
  onToggleExpandable: () => void
}

export function NarrativePanel({ step, showExpandable, onToggleExpandable }: NarrativePanelProps) {
  const paragraphs = step.narrative.split('\n\n').filter(Boolean)

  return (
    <div className="h-full flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">From Karpathy's Guide</span>
        <a
          href={BLOG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-purple-600 hover:text-purple-800 hover:underline"
        >
          Read full post ↗
        </a>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {paragraphs.map((para, i) => (
          <motion.p
            key={`${step.id}-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.25 }}
            className={
              para.startsWith('"') && para.endsWith('"')
                ? 'text-lg font-medium text-purple-700 italic border-l-4 border-purple-300 pl-4 py-1'
                : para.startsWith('•')
                  ? 'text-sm text-gray-700 leading-relaxed pl-2'
                  : 'text-sm text-gray-700 leading-relaxed'
            }
          >
            {para}
          </motion.p>
        ))}

        {/* Expandable info box */}
        {step.expandable && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={onToggleExpandable}
              className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-medium mt-2"
            >
              <span className={`transition-transform ${showExpandable ? 'rotate-90' : ''}`}>▶</span>
              {step.expandable.title}
            </button>
            <AnimatePresence>
              {showExpandable && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-200 text-sm text-purple-800 leading-relaxed">
                    {step.expandable.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
