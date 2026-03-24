import { motion } from 'framer-motion'
import { ChevronLeft, Info, Bot, Code, User, ExternalLink, FileText } from 'lucide-react'
import { useTheme } from '@/context/Theme'
import { ThemeToggle } from './ThemeToggle'
import { BLOG_URL, GIST_URL } from '@/data/steps'

interface AboutProps {
  onBack: () => void
  onStart: () => void
}

export function About({ onBack, onStart }: AboutProps) {
  const { theme } = useTheme()
  const d = theme === 'dark'

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://howllmswork-4fw.pages.dev'

  return (
    <div className={`min-h-screen ${d ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white' : 'bg-gradient-to-b from-white via-gray-50 to-white text-gray-900'}`}>
      <div className="max-w-3xl mx-auto px-6 py-10 relative">

        <div className="absolute top-4 right-6">
          <ThemeToggle />
        </div>

        {/* Back nav */}
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex items-center gap-1 text-sm transition-colors mb-6 ${d ? 'text-gray-500 hover:text-blue-300' : 'text-gray-500 hover:text-blue-600'}`}
        >
          <ChevronLeft className="w-4 h-4" /> Back to home
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-4 ${d ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-100 border-blue-200'}`}>
            <Info className="w-4 h-4 text-blue-400" />
            <span className={`text-sm ${d ? 'text-blue-300' : 'text-blue-600'}`}>About</span>
          </div>

          <h1 className={`text-4xl font-bold tracking-tight mb-3 bg-clip-text text-transparent ${d ? 'bg-gradient-to-r from-white via-blue-200 to-purple-400' : 'bg-gradient-to-r from-gray-900 via-blue-600 to-purple-500'}`}>
            About this site
          </h1>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {/* What it is */}
          <section className={`rounded-xl border p-6 ${d ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <p className={`text-base leading-relaxed ${d ? 'text-gray-300' : 'text-gray-700'}`}>
              This is an interactive walkthrough of Andrej Karpathy's{' '}
              <a href={GIST_URL} target="_blank" rel="noopener noreferrer" className={`underline underline-offset-2 ${d ? 'text-blue-400' : 'text-blue-600'}`}>microgpt</a>
              {' '}— a complete GPT implementation in 200 lines of pure Python with zero dependencies. The walkthrough breaks down every line of code into 12 steps, from the training data to inference, with interactive diagrams, a glossary of 40+ terms, and line-by-line code annotations.
            </p>
          </section>

          {/* Who made it */}
          <section className={`rounded-xl border p-6 space-y-4 ${d ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${d ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                <User className="w-5 h-5 text-purple-500" />
              </div>
              <h2 className={`text-lg font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>Built by</h2>
            </div>
            <p className={`text-base leading-relaxed ${d ? 'text-gray-300' : 'text-gray-700'}`}>
              <a href="https://github.com/techczech" target="_blank" rel="noopener noreferrer" className={`font-semibold underline underline-offset-2 ${d ? 'text-blue-400' : 'text-blue-600'}`}>Dominik Lukes</a>
              {' '}conceived, directed, and curated this project — choosing what to build, how to structure the walkthrough, what pedagogical approach to take, and iterating on the design through extensive review and feedback.
            </p>
          </section>

          <section className={`rounded-xl border p-6 space-y-4 ${d ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${d ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
                <Bot className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className={`text-lg font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>Written by</h2>
            </div>
            <p className={`text-base leading-relaxed ${d ? 'text-gray-300' : 'text-gray-700'}`}>
              All code, narratives, code annotations, glossary definitions, and diagrams were written by{' '}
              <strong className={d ? 'text-orange-300' : 'text-orange-600'}>Claude 4.6 Opus</strong>
              {' '}(Anthropic's AI model). This includes the React components, the walkthrough text explaining each step, the 200+ line-by-line code explanations, and the 40+ glossary entries. Every commit is co-authored by Claude.
            </p>
          </section>

          {/* How it was made */}
          <section className={`rounded-xl border p-6 space-y-4 ${d ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${d ? 'bg-green-500/10' : 'bg-green-50'}`}>
                <Code className="w-5 h-5 text-green-500" />
              </div>
              <h2 className={`text-lg font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>How it was made</h2>
            </div>
            <p className={`text-base leading-relaxed ${d ? 'text-gray-300' : 'text-gray-700'}`}>
              The project was built in a series of conversations using{' '}
              <a href="https://claude.ai/claude-code" target="_blank" rel="noopener noreferrer" className={`underline underline-offset-2 ${d ? 'text-blue-400' : 'text-blue-600'}`}>Claude Code</a>
              {' '}(Anthropic's CLI coding agent). The source material was Karpathy's{' '}
              <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className={`underline underline-offset-2 ${d ? 'text-blue-400' : 'text-blue-600'}`}>blog post</a>,{' '}
              <a href={GIST_URL} target="_blank" rel="noopener noreferrer" className={`underline underline-offset-2 ${d ? 'text-blue-400' : 'text-blue-600'}`}>code gist</a>,
              {' '}and the 200-line microgpt.py script itself. Claude analyzed the code, wrote all the pedagogical content, and built the interactive app — the human provided direction, structure, and quality control.
            </p>
            <p className={`text-sm leading-relaxed ${d ? 'text-gray-400' : 'text-gray-500'}`}>
              This is itself a demonstration of Karpathy's thesis: the irreducible human contribution is the 200 lines of code and the decision to build this walkthrough. Everything else — the explanations, the UI, the glossary — is agent work, steered by human judgment.
            </p>
          </section>

          {/* LLM accessible */}
          <section className={`rounded-xl border p-6 space-y-4 ${d ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${d ? 'bg-cyan-500/10' : 'bg-cyan-50'}`}>
                <FileText className="w-5 h-5 text-cyan-500" />
              </div>
              <h2 className={`text-lg font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>LLM-accessible content</h2>
            </div>
            <p className={`text-base leading-relaxed ${d ? 'text-gray-300' : 'text-gray-700'}`}>
              Following Karpathy's "markdown for agents" philosophy, all walkthrough content is available as plain text that any LLM can fetch and reason about:
            </p>
            <div className="flex flex-col gap-2">
              <a href={`${siteUrl}/llms.txt`} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-mono transition-colors ${d ? 'border-gray-700 hover:border-cyan-600 hover:bg-cyan-500/5 text-gray-300' : 'border-gray-200 hover:border-cyan-400 hover:bg-cyan-50 text-gray-700'}`}>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 text-cyan-500" />
                /llms.txt <span className={`font-sans ${d ? 'text-gray-500' : 'text-gray-400'}`}>— summary and table of contents</span>
              </a>
              <a href={`${siteUrl}/llms-full.txt`} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-mono transition-colors ${d ? 'border-gray-700 hover:border-cyan-600 hover:bg-cyan-500/5 text-gray-300' : 'border-gray-200 hover:border-cyan-400 hover:bg-cyan-50 text-gray-700'}`}>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 text-cyan-500" />
                /llms-full.txt <span className={`font-sans ${d ? 'text-gray-500' : 'text-gray-400'}`}>— complete walkthrough content (67KB)</span>
              </a>
            </div>
            <p className={`text-sm ${d ? 'text-gray-400' : 'text-gray-500'}`}>
              Use the "Ask LLM" buttons throughout the walkthrough and glossary to copy a ready-made prompt for any chatbot.
            </p>
          </section>

          {/* Tech stack */}
          <section className={`rounded-xl border p-6 space-y-3 ${d ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <h2 className={`text-lg font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>Tech stack</h2>
            <p className={`text-sm leading-relaxed ${d ? 'text-gray-400' : 'text-gray-500'}`}>
              React + TypeScript + Vite + Tailwind CSS + Framer Motion. Deployed to Cloudflare Pages. No backend — everything runs in the browser.
            </p>
          </section>

          {/* CTA */}
          <div className="text-center pt-4 pb-8">
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Start the walkthrough
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
