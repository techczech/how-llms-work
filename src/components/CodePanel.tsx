import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CodeAnnotation } from '@/data/steps'
import { MessageSquareText, X } from 'lucide-react'

interface CodePanelProps {
  code: string
  annotations?: CodeAnnotation[]
}

export function CodePanel({ code, annotations = [] }: CodePanelProps) {
  const lines = code.split('\n')
  const [activeAnnotation, setActiveAnnotation] = useState<CodeAnnotation | null>(null)

  // Build a map: line number → annotation (for highlighting)
  const lineToAnnotation = new Map<number, CodeAnnotation>()
  for (const ann of annotations) {
    for (const ln of ann.lines) {
      lineToAnnotation.set(ln, ann)
    }
  }

  const handleLineClick = (lineNum: number) => {
    const ann = lineToAnnotation.get(lineNum)
    if (!ann) {
      setActiveAnnotation(null)
      return
    }
    setActiveAnnotation(activeAnnotation === ann ? null : ann)
  }

  // Find where to insert the annotation card (after the last line of the active group)
  const insertAfterLine = activeAnnotation ? Math.max(...activeAnnotation.lines) : -1

  return (
    <div className="h-full flex flex-col bg-[#0d1117] rounded-xl overflow-hidden border border-gray-700/50">
      <div className="px-4 py-2 border-b border-gray-700/50 bg-[#161b22] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs text-gray-500 ml-2 font-mono">microgpt.py</span>
        </div>
        {annotations.length > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-gray-500">
            <MessageSquareText className="w-3 h-3" />
            Click lines for explanations
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <pre className="text-[13px] leading-[1.6]">
          {lines.map((line, i) => {
            const lineNum = i + 1
            const ann = lineToAnnotation.get(lineNum)
            const isHighlighted = activeAnnotation && activeAnnotation === ann
            const isClickable = !!ann

            return (
              <span key={`${i}-${line.slice(0, 20)}`}>
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.025, duration: 0.15 }}
                  onClick={() => handleLineClick(lineNum)}
                  className={`flex transition-colors duration-150 -mx-2 px-2 rounded ${
                    isHighlighted
                      ? 'bg-purple-500/15 border-l-2 border-purple-400 pl-1.5'
                      : isClickable
                        ? 'hover:bg-white/5 cursor-pointer border-l-2 border-transparent'
                        : 'border-l-2 border-transparent'
                  }`}
                >
                  <span className={`w-7 text-right mr-4 select-none text-xs leading-[1.6] shrink-0 ${
                    isHighlighted ? 'text-purple-400' : isClickable ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    {lineNum}
                  </span>
                  <code className="flex-1 whitespace-pre">
                    <SyntaxLine line={line} />
                  </code>
                </motion.div>

                {/* Annotation card inserted after last line of group */}
                {lineNum === insertAfterLine && activeAnnotation && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="my-1.5 mx-1 p-3 bg-purple-500/10 border border-purple-500/25 rounded-lg">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="text-xs font-semibold text-purple-300">{activeAnnotation.title}</span>
                          <button onClick={(e) => { e.stopPropagation(); setActiveAnnotation(null) }}
                            className="text-gray-500 hover:text-gray-300 shrink-0">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">{activeAnnotation.explanation}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </span>
            )
          })}
        </pre>
      </div>
    </div>
  )
}

const KEYWORDS = new Set(['def', 'class', 'for', 'in', 'range', 'if', 'return', 'import', 'from', 'lambda', 'not', 'and', 'or', 'else', 'elif', 'while', 'break', 'True', 'False', 'None'])
const BUILTINS = new Set(['len', 'sum', 'max', 'min', 'zip', 'enumerate', 'sorted', 'set', 'print', 'isinstance', 'float', 'int', 'list', 'str'])

function SyntaxLine({ line }: { line: string }) {
  if (line.trimStart().startsWith('#')) {
    return <span className="text-[#8b949e] italic">{line}</span>
  }
  if (line.trimStart().startsWith('"""') || line.trimStart().startsWith("'''")) {
    return <span className="text-[#a5d6ff]">{line}</span>
  }

  const tokens = line.split(/(\s+|[()[\]{},.:=+\-*/<>!@%^&|~]+|'[^']*'|"[^"]*")/)

  return (
    <span>
      {tokens.map((token, i) => {
        if (KEYWORDS.has(token)) return <span key={i} className="text-[#ff7b72]">{token}</span>
        if (BUILTINS.has(token)) return <span key={i} className="text-[#d2a8ff]">{token}</span>
        if (/^['"]/.test(token)) return <span key={i} className="text-[#a5d6ff]">{token}</span>
        if (/^\d+(\.\d+)?(e[+-]?\d+)?$/.test(token)) return <span key={i} className="text-[#79c0ff]">{token}</span>
        if (token === 'self') return <span key={i} className="text-[#ff7b72]">{token}</span>
        if (token === 'Value') return <span key={i} className="text-[#ffa657]">{token}</span>
        return <span key={i} className="text-[#c9d1d9]">{token}</span>
      })}
    </span>
  )
}
