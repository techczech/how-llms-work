import { motion } from 'framer-motion'
import { Play, ArrowRight, ExternalLink, Code, BookOpen, BarChart3, Keyboard, GraduationCap, List, Database, FileText, Sparkles, Zap, Info } from 'lucide-react'
import { BLOG_URL, GIST_URL, COLAB_URL, NAMES_URL } from '@/data/steps'
import { useTheme } from '@/context/Theme'
import { ThemeToggle } from './ThemeToggle'

interface LandingProps {
  onStart: (stepIndex?: number) => void
  onPedagogy: () => void
  onGlossary: () => void
  onAbout: () => void
}

export function Landing({ onStart, onPedagogy, onGlossary, onAbout }: LandingProps) {
  const { theme } = useTheme()
  const d = theme === 'dark'

  return (
    <div className={`min-h-screen ${d ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white' : 'bg-gradient-to-b from-white via-gray-50 to-white text-gray-900'}`}>
      <div className="max-w-3xl mx-auto px-6 py-16 relative">

        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className={`inline-flex items-center gap-2 ${d ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-100 border-purple-200'} border rounded-full px-4 py-1.5 mb-6`}>
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className={`text-sm ${d ? 'text-purple-300' : 'text-purple-600'}`}>Interactive visual guide</span>
          </div>

          <h1 className={`text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent ${d ? 'bg-gradient-to-r from-white via-purple-200 to-purple-400' : 'bg-gradient-to-r from-gray-900 via-purple-700 to-purple-500'}`}>
            How LLMs Work
          </h1>

          <p className={`text-xl mb-2 max-w-xl mx-auto leading-relaxed ${d ? 'text-gray-400' : 'text-gray-600'}`}>
            The complete algorithm behind ChatGPT, Claude, and every modern AI — explained in 200 lines of Python.
          </p>

          <p className={`text-sm mb-10 ${d ? 'text-gray-500' : 'text-gray-500'}`}>
            Based on Andrej Karpathy's{' '}
            <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className={`${d ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'} underline underline-offset-2`}>
              microgpt
            </a>
          </p>

          <button
            onClick={() => onStart()}
            className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl text-lg font-medium transition-colors shadow-lg shadow-purple-600/25 hover:shadow-purple-500/30"
          >
            <Play className="w-5 h-5" />
            Start the walkthrough
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Key navigation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-16"
        >
            <button
            onClick={onAbout}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all group ${
              d ? 'bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/40'
                : 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
            }`}
          >
            <Info className={`w-6 h-6 ${d ? 'text-blue-400' : 'text-blue-500'}`} />
            <div>
              <div className={`text-sm font-semibold group-hover:text-blue-500 transition-colors ${d ? 'text-gray-100' : 'text-gray-800'}`}>About</div>
              <div className={`text-[11px] ${d ? 'text-gray-500' : 'text-gray-500'}`}>How this was built</div>
            </div>
          </button>
          <button
            onClick={onPedagogy}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all group ${
              d ? 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10 hover:border-amber-500/40'
                : 'bg-amber-50 border-amber-200 hover:bg-amber-100 hover:border-amber-300'
            }`}
          >
            <GraduationCap className={`w-6 h-6 ${d ? 'text-amber-400' : 'text-amber-500'}`} />
            <div>
              <div className={`text-sm font-semibold group-hover:text-amber-500 transition-colors ${d ? 'text-gray-100' : 'text-gray-800'}`}>Pedagogy</div>
              <div className={`text-[11px] ${d ? 'text-gray-500' : 'text-gray-500'}`}>Why this app exists</div>
            </div>
          </button>
          <button
            onClick={onGlossary}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all group ${
              d ? 'bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/40'
                : 'bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300'
            }`}
          >
            <List className={`w-6 h-6 ${d ? 'text-purple-400' : 'text-purple-500'}`} />
            <div>
              <div className={`text-sm font-semibold group-hover:text-purple-500 transition-colors ${d ? 'text-gray-100' : 'text-gray-800'}`}>Glossary</div>
              <div className={`text-[11px] ${d ? 'text-gray-500' : 'text-gray-500'}`}>40+ key terms explained</div>
            </div>
          </button>
        </motion.div>

        {/* What microgpt actually does */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-16"
        >
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 text-center">What microgpt actually does</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Database, heading: 'The task', body: 'Train a tiny neural network on 32,000 baby names, then have it invent plausible new ones \u2014 names like \u201cAdalyn\u201d or \u201cKeiran\u201d that weren\u2019t in the original list.' },
              { icon: FileText, heading: 'The code', body: 'One Python file, 200 lines, zero dependencies. No PyTorch, no GPU needed. Runs in minutes on any laptop or in a free Google Colab notebook.' },
              { icon: Sparkles, heading: 'What happens when you run it', body: 'The model starts by generating gibberish. Over many passes through the names, it gradually learns which letters tend to follow which \u2014 and starts producing convincing names.' },
              { icon: Zap, heading: 'Why this matters', body: 'This is the same algorithm behind ChatGPT and Claude. Same tokenizer, same attention mechanism, same training loop. The only difference is scale \u2014 4,000 parameters here vs. billions in production.' },
            ].map((item, i) => (
              <motion.div
                key={item.heading}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className={`flex gap-3 p-4 rounded-lg border ${
                  d ? 'bg-white/5 border-white/5' : 'bg-gray-100 border-gray-200'
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 mt-0.5 ${d ? 'text-purple-400' : 'text-purple-500'}`} />
                <div>
                  <div className={`text-sm font-medium ${d ? 'text-gray-200' : 'text-gray-800'}`}>{item.heading}</div>
                  <div className={`text-xs ${d ? 'text-gray-500' : 'text-gray-500'}`}>{item.body}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* The dataset */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 text-center">The training data</h2>
          <div className={`rounded-xl border overflow-hidden ${d ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
            <div className="p-5">
              <p className={`text-sm leading-relaxed mb-4 ${d ? 'text-gray-300' : 'text-gray-600'}`}>
                The model trains on{' '}
                <a href={NAMES_URL} target="_blank" rel="noopener noreferrer" className={`font-medium underline underline-offset-2 ${d ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'}`}>
                  names.txt
                </a>
                {' '}&mdash; a list of 32,033 baby names from US Social Security data, one per line. In a production LLM like ChatGPT, this would be billions of web pages. Here it&rsquo;s just names:
              </p>
              <div className={`font-mono text-xs rounded-lg p-3 mb-4 ${d ? 'bg-gray-800/80 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                <div>emma</div>
                <div>olivia</div>
                <div>ava</div>
                <div>isabella</div>
                <div>sophia</div>
                <div className={d ? 'text-gray-600' : 'text-gray-400'}>... 32,028 more names</div>
              </div>
              <p className={`text-xs leading-relaxed ${d ? 'text-gray-500' : 'text-gray-500'}`}>
                Each name is a &ldquo;document&rdquo; &mdash; the model sees thousands of examples of which letters tend to follow which, and learns the statistical patterns. After training, it can generate plausible new names that weren&rsquo;t in the list. From the model&rsquo;s perspective, this is exactly the same task as ChatGPT completing your prompt &mdash; just at character scale instead of word scale.
              </p>
            </div>
          </div>
        </motion.div>

        {/* What you'll learn */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-16"
        >
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 text-center">What you'll learn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'Tokenize', desc: 'How text becomes integers a neural network can process', step: 2 },
              { title: 'Backprop', desc: 'The computation graph engine that computes gradients', step: 3 },
              { title: 'Attend', desc: 'How tokens communicate — the core of every transformer', step: 6 },
              { title: 'Transform', desc: 'MLP computation — the feed-forward blocks', step: 7 },
              { title: 'Train', desc: 'Predict → loss → backprop → update parameters', step: 8 },
              { title: 'Predict', desc: 'Temperature sampling and autoregressive text generation', step: 10 },
            ].map((item, i) => (
              <motion.button
                key={item.title}
                onClick={() => onStart(item.step)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.05 }}
                className={`flex gap-3 p-3 rounded-lg border transition-colors text-left cursor-pointer group ${
                  d ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-purple-500/30'
                    : 'bg-gray-100 border-gray-200 hover:bg-purple-50 hover:border-purple-300'
                }`}
              >
                <div className="w-1.5 rounded-full bg-purple-500/60 group-hover:bg-purple-400 shrink-0 transition-colors" />
                <div>
                  <div className={`text-sm font-medium group-hover:text-purple-400 transition-colors ${d ? 'text-gray-200' : 'text-gray-800'}`}>{item.title}</div>
                  <div className={`text-xs ${d ? 'text-gray-500' : 'text-gray-500'}`}>{item.desc}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 text-center">Three panels, one algorithm</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Code, label: 'Code', desc: 'The actual Python from microgpt.py with syntax highlighting', color: 'text-green-400' },
              { icon: BookOpen, label: 'Narrative', desc: 'Karpathy\'s explanations from the blog post, step by step', color: 'text-blue-400' },
              { icon: BarChart3, label: 'Visual', desc: 'Animated diagrams showing what the code does', color: 'text-purple-400' },
            ].map((panel, i) => (
              <motion.div
                key={panel.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className={`p-4 rounded-lg border text-center ${d ? 'bg-white/5 border-white/5' : 'bg-gray-100 border-gray-200'}`}
              >
                <panel.icon className={`w-6 h-6 mx-auto mb-2 ${panel.color}`} />
                <div className={`text-sm font-medium mb-1 ${d ? 'text-gray-200' : 'text-gray-800'}`}>{panel.label}</div>
                <div className={`text-xs ${d ? 'text-gray-500' : 'text-gray-500'}`}>{panel.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Navigation hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Keyboard className="w-4 h-4" />
              Use <kbd className={`px-1.5 py-0.5 rounded text-xs font-mono ${d ? 'bg-white/10' : 'bg-gray-200'}`}>←</kbd> <kbd className={`px-1.5 py-0.5 rounded text-xs font-mono ${d ? 'bg-white/10' : 'bg-gray-200'}`}>→</kbd> arrow keys to navigate
            </span>
            <span className={d ? 'text-gray-700' : 'text-gray-300'}>|</span>
            <span>Or use the step controls and clickable pills</span>
          </div>
        </motion.div>

        {/* Sources */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {[
            { href: BLOG_URL, label: "Karpathy's blog post" },
            { href: GIST_URL, label: 'microgpt.py on GitHub' },
            { href: COLAB_URL, label: 'Run in Google Colab' },
            { href: 'https://www.youtube.com/watch?v=VMj-3S1tku0', label: "Karpathy's micrograd video (2.5h)" },
          ].map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
              className={`flex items-center gap-2 text-sm transition-colors px-4 py-2 rounded-lg border ${
                d ? 'text-gray-400 hover:text-purple-300 bg-white/5 hover:bg-white/10 border-white/5'
                  : 'text-gray-600 hover:text-purple-600 bg-gray-100 hover:bg-purple-50 border-gray-200'
              }`}>
              <ExternalLink className="w-3.5 h-3.5" />
              {link.label}
            </a>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className={`text-center text-sm border-t pt-8 ${d ? 'text-gray-600 border-white/5' : 'text-gray-500 border-gray-200'}`}
        >
          <p>
            Built by{' '}
            <a href="https://dominiklukes.net" target="_blank" rel="noopener noreferrer"
              className={`underline underline-offset-2 transition-colors ${d ? 'text-gray-400 hover:text-purple-300' : 'text-gray-600 hover:text-purple-500'}`}>
              Dominik Lukes
            </a>
            {' '}as an interactive companion to Karpathy's microgpt.
          </p>
          <p className={`mt-2 ${d ? 'text-gray-700' : 'text-gray-400'}`}>
            No data is collected. Everything runs in your browser.
          </p>
        </motion.footer>
      </div>
    </div>
  )
}
