import { useMemo, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Step } from '@/data/steps'
import { steps, BLOG_URL } from '@/data/steps'
import { glossary } from '@/data/glossary'
import { CopyToChatbot } from './CopyToChatbot'

interface NarrativePanelProps {
  step: Step
  showExpandable: boolean
  onToggleExpandable: () => void
  onGlossary?: (termId: string) => void
}

/**
 * Build a regex that matches glossary terms in text.
 * Sorted longest-first so "attention head" matches before "attention".
 */
const glossaryTerms = glossary
  .flatMap((e) => {
    // Include both the full term and common short forms
    const terms = [e.term]
    // Extract parenthetical abbreviations like "MLP (Multilayer Perceptron)" → also match "MLP"
    const abbrevMatch = e.term.match(/^([A-Z]{2,})/)
    if (abbrevMatch) terms.push(abbrevMatch[1])
    return terms.map((t) => ({ pattern: t, id: e.id }))
  })
  .sort((a, b) => b.pattern.length - a.pattern.length)

const termRegex = new RegExp(
  `\\b(${glossaryTerms.map((t) => t.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
  'gi'
)

const patternToId = new Map(glossaryTerms.map((t) => [t.pattern.toLowerCase(), t.id]))

function linkifyTerms(text: string, onGlossary?: (termId: string) => void): ReactNode {
  if (!onGlossary) return text

  const parts: ReactNode[] = []
  let lastIndex = 0
  const seen = new Set<string>()

  // Use matchAll for non-mutating iteration
  for (const match of text.matchAll(termRegex)) {
    const matchText = match[0]
    const idx = match.index!
    const termId = patternToId.get(matchText.toLowerCase())
    if (!termId) continue
    // Only linkify first occurrence of each term per paragraph
    if (seen.has(termId)) continue
    seen.add(termId)

    if (idx > lastIndex) {
      parts.push(text.slice(lastIndex, idx))
    }
    parts.push(
      <button
        key={`${termId}-${idx}`}
        onClick={(e) => { e.stopPropagation(); onGlossary(termId) }}
        className="underline decoration-dotted underline-offset-2 decoration-purple-400/50 hover:decoration-purple-500 hover:text-purple-600 transition-colors cursor-pointer"
        title={`View glossary: ${matchText}`}
      >
        {matchText}
      </button>
    )
    lastIndex = idx + matchText.length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

export function NarrativePanel({ step, showExpandable, onToggleExpandable, onGlossary }: NarrativePanelProps) {
  const paragraphs = step.narrative.split('\n\n').filter(Boolean)

  const linkedParagraphs = useMemo(
    () => paragraphs.map((para) => linkifyTerms(para, onGlossary)),
    [step.id, onGlossary]
  )

  return (
    <div className="h-full flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">From Karpathy's Guide</span>
        <div className="flex items-center gap-1.5">
          <CopyToChatbot type="step" title={step.title} subtitle={step.subtitle} stepNumber={steps.indexOf(step) + 1} />
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-600 hover:text-purple-800 hover:underline"
          >
            Read full post ↗
          </a>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {linkedParagraphs.map((content, i) => (
          <motion.p
            key={`${step.id}-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.25 }}
            className={
              paragraphs[i].startsWith('"') && paragraphs[i].endsWith('"')
                ? 'text-lg font-medium text-purple-700 italic border-l-4 border-purple-300 pl-4 py-1'
                : paragraphs[i].startsWith('•')
                  ? 'text-sm text-gray-700 leading-relaxed pl-2'
                  : 'text-sm text-gray-700 leading-relaxed'
            }
          >
            {content}
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
