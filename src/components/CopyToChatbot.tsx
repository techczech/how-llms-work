import { useState, useCallback, useRef, useEffect } from 'react'
import { Copy, Check, X, Bot } from 'lucide-react'

interface CopyToChatbotProps {
  type: 'step' | 'glossary'
  title: string
  subtitle?: string
  stepNumber?: number
  category?: string
  className?: string
}

function buildPrompt({ type, title, subtitle, stepNumber, category }: CopyToChatbotProps): string {
  const base = `${window.location.origin}/llms-full.txt`

  if (type === 'step') {
    const stepLabel = stepNumber ? `Step ${stepNumber}: ${title}` : title
    return `I'm learning how LLMs work using an interactive walkthrough of Karpathy's microgpt (a complete GPT in 200 lines of Python). I'm on step "${title}${subtitle ? ` — ${subtitle}` : ''}".

Please explain this step to me in depth. For the complete walkthrough content (all 12 steps, code annotations, and glossary), fetch:
${base}

Look for the "${stepLabel}" section. Use related steps and glossary terms to build a thorough explanation. Adapt to my level — if I ask follow-up questions, use the full context to answer.`
  }

  return `I'm learning how LLMs work using an interactive walkthrough of Karpathy's microgpt (a complete GPT in 200 lines of Python). I'd like you to explain this concept:

**${title}**${category ? ` (category: ${category})` : ''}

For the complete walkthrough content (all steps, code annotations, and glossary), fetch:
${base}

Look for "${title}" under the Glossary section. Use related steps and terms to build a clear, thorough explanation.`
}

export function CopyToChatbot(props: CopyToChatbotProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  const prompt = open ? buildPrompt(props) : ''

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [prompt])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Close on click outside
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors ${
          props.className ?? 'text-purple-600 hover:text-purple-800 hover:bg-purple-50 bg-purple-50/50'
        }`}
      >
        <Bot className="w-3 h-3" />
        Ask LLM
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            ref={popupRef}
            className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-gray-800">Ask an LLM about this</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Explanation */}
            <div className="px-5 py-3 text-xs text-gray-500 border-b border-gray-100 space-y-1.5">
              <p>Copy the prompt below and paste it into <strong className="text-gray-700">ChatGPT</strong>, <strong className="text-gray-700">Claude</strong>, or any chatbot.</p>
              <p>The prompt tells the LLM what you're looking at and links to the full walkthrough content so it can give you a thorough, contextual explanation.</p>
            </div>

            {/* Prompt text */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 rounded-lg p-3 border border-gray-200 leading-relaxed">
                {prompt}
              </pre>
            </div>

            {/* Footer with copy button */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-[10px] text-gray-400">Works best with models that can fetch URLs</span>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy to clipboard'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
