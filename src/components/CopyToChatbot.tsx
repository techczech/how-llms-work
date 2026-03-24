import { useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'

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
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    const prompt = buildPrompt(props)
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [props])

  return (
    <button
      onClick={handleCopy}
      className={`p-1 rounded transition-colors ${props.className ?? 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'}`}
      title="Copy prompt for chatbot — paste into ChatGPT, Claude, etc."
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}
