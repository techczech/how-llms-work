import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, GraduationCap, Quote, Lightbulb, Bot, Sparkles, Play } from 'lucide-react'
import { useTheme } from '@/context/Theme'
import { ThemeToggle } from './ThemeToggle'

const NOPRIORS_URL = 'https://www.youtube.com/watch?v=kwSVtQ7dziU'
const VIDEO_ID = 'kwSVtQ7dziU'

interface PedagogyProps {
  onBack: () => void
  onStart: () => void
}

const quotes = [
  {
    icon: Bot,
    label: 'Explaining to agents, not people',
    time: '62:49',
    seconds: 3769,
    speaker: 'karpathy' as const,
    text: `Maybe a year ago, if I had come up with microGPT, I would have been tempted to explain it to people — make a video stepping through it or something like that. I actually tried to make that video, and I tried to make a little guide to it, but I kind of realized that it's not really adding too much. Because it's already so simple — it's 200 lines that anyone could ask their agent to explain in various ways. I'm not explaining to people anymore. I'm explaining it to agents. If you can explain it to agents, then agents can be the router and they can actually target it to the human in their language, with infinite patience, at their capability level.`,
  },
  {
    icon: GraduationCap,
    label: 'Skills as curriculum',
    time: '63:33',
    seconds: 3813,
    speaker: 'karpathy' as const,
    text: `What is education? It used to be guides, it used to be lectures. But now I'm explaining things to agents. A skill is just a way to instruct the agent how to teach the thing. So maybe I could have a skill for microGPT — the progression I imagine the agent should take you through if you're interested in understanding the codebase. It's just hints to the model: first start off with this, then with that. I could just script the curriculum a little bit as a skill.`,
  },
  {
    icon: Lightbulb,
    label: 'Markdown for agents, not HTML for humans',
    time: '64:28',
    seconds: 3868,
    speaker: 'karpathy' as const,
    text: `Education is going to be reshuffled by this quite substantially. It's the end of teaching each other things, almost. If I have a library of code, it used to be that you have documentation for other people using my library. But you shouldn't do that anymore. Instead of HTML documents for humans, you should have markdown documents for agents. Because if agents get it, then they can just explain all the different parts of it. It's this redirection through agents.`,
  },
  {
    icon: Sparkles,
    label: 'The irreducible human contribution',
    time: '65:07',
    seconds: 3907,
    speaker: 'karpathy' as const,
    text: `I tried to get an agent to write microGPT. I told it: try to boil down neural networking to the simplest thing. And it can't do it. MicroGPT is my obsession. It's the 200 lines. I thought about this for a long time. I was obsessed about this for a long time. This is the solution. Trust me, it can't get simpler. And this is my value add. Everything else — the agent gets it.`,
  },
  {
    icon: Quote,
    label: 'Agents get it, they just can\'t originate it',
    time: '65:33',
    seconds: 3933,
    speaker: 'karpathy' as const,
    text: `It just can't come up with it. But it totally gets it and understands why it's done a certain way. So my contribution is kind of like these few bits, but everything else in terms of the education that goes on after that is not my domain anymore. Maybe education changes in those ways — you have to infuse the few bits that you feel strongly about, the curriculum, the better way of explaining it.`,
  },
]

export function Pedagogy({ onBack, onStart }: PedagogyProps) {
  const { theme } = useTheme()
  const d = theme === 'dark'
  const [activeSeconds, setActiveSeconds] = useState(3769)
  const [iframeKey, setIframeKey] = useState(0)

  const jumpTo = (seconds: number) => {
    setActiveSeconds(seconds)
    setIframeKey((k) => k + 1)
  }

  const embedUrl = `https://www.youtube.com/embed/${VIDEO_ID}?start=${activeSeconds}`

  return (
    <div className={`min-h-screen ${d ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white' : 'bg-gradient-to-b from-white via-gray-50 to-white text-gray-900'}`}>
      <div className="max-w-6xl mx-auto px-6 py-10 relative">

        <div className="absolute top-4 right-6">
          <ThemeToggle />
        </div>

        {/* Back nav */}
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex items-center gap-1 text-sm transition-colors mb-6 ${d ? 'text-gray-500 hover:text-purple-300' : 'text-gray-500 hover:text-purple-600'}`}
        >
          <ChevronLeft className="w-4 h-4" /> Back to home
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-4 ${d ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-100 border-amber-200'}`}>
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span className={`text-sm ${d ? 'text-amber-300' : 'text-amber-600'}`}>Pedagogy</span>
          </div>

          <h1 className={`text-4xl font-bold tracking-tight mb-3 bg-clip-text text-transparent ${d ? 'bg-gradient-to-r from-white via-amber-200 to-purple-400' : 'bg-gradient-to-r from-gray-900 via-amber-600 to-purple-500'}`}>
            Why this app exists
          </h1>

          <p className={`text-base max-w-2xl mx-auto leading-relaxed ${d ? 'text-gray-400' : 'text-gray-600'}`}>
            In a{' '}
            <a href={NOPRIORS_URL} target="_blank" rel="noopener noreferrer" className={`underline underline-offset-2 ${d ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'}`}>
              NoPriors podcast interview
            </a>
            , Andrej Karpathy described a new model for technical education: don't explain things to people — explain them to agents, and let agents do the teaching. This app is an experiment in that direction.
          </p>
        </motion.div>

        {/* Two-column: Video + Quotes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-5 mb-14"
        >
          {/* Left: Sticky video */}
          <div className="w-[55%] shrink-0">
            <div className="sticky top-10">
              <div className={`aspect-video rounded-xl overflow-hidden border shadow-2xl ${d ? 'border-white/10 shadow-purple-900/20' : 'border-gray-200 shadow-gray-300/30'}`}>
                <iframe
                  key={iframeKey}
                  src={embedUrl}
                  title="Andrej Karpathy on NoPriors — Education through agents"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <p className={`text-xs mt-2 text-center ${d ? 'text-gray-600' : 'text-gray-400'}`}>
                Click a quote to jump to that moment in the video
              </p>
            </div>
          </div>

          {/* Right: Quotes */}
          <div className="w-[45%] space-y-3">
            <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Key ideas from the conversation
            </h2>

            {quotes.map((q, i) => {
              const isActive = activeSeconds === q.seconds
              return (
                <motion.button
                  key={q.label}
                  onClick={() => jumpTo(q.seconds)}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  className={`block w-full text-left rounded-xl p-4 border transition-all cursor-pointer ${
                    isActive
                      ? d ? 'bg-purple-500/10 border-purple-500/30 shadow-lg shadow-purple-900/20'
                           : 'bg-purple-50 border-purple-300 shadow-lg shadow-purple-200/30'
                      : d ? 'bg-white/5 border-white/5 hover:bg-white/8 hover:border-purple-500/20'
                           : 'bg-gray-100 border-gray-200 hover:bg-purple-50/50 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <q.icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : d ? 'text-amber-400' : 'text-amber-500'}`} />
                    <span className={`text-xs font-medium flex-1 ${d ? 'text-gray-300' : 'text-gray-700'}`}>{q.label}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive
                        ? d ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-200 text-purple-700'
                        : d ? 'bg-white/10 text-gray-500' : 'bg-gray-200 text-gray-500'
                    }`}>
                      <Play className="w-2.5 h-2.5" />
                      {q.time}
                    </span>
                  </div>

                  <div>
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${d ? 'text-purple-400' : 'text-purple-600'}`}>Karpathy</span>
                    <p className={`text-xs leading-relaxed mt-0.5 italic border-l-2 pl-3 ${d ? 'text-gray-400 border-purple-500/30' : 'text-gray-600 border-purple-300'}`}>
                      {q.text}
                    </p>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Connection to this app */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`border rounded-xl p-6 mb-14 max-w-3xl mx-auto ${
            d ? 'bg-gradient-to-r from-purple-500/10 to-amber-500/10 border-purple-500/20'
              : 'bg-gradient-to-r from-purple-50 to-amber-50 border-purple-200'
          }`}
        >
          <h2 className={`text-lg font-semibold mb-3 ${d ? 'text-gray-200' : 'text-gray-800'}`}>How this app connects</h2>
          <div className={`space-y-3 text-sm leading-relaxed ${d ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>
              Karpathy's microGPT is the irreducible 200-line kernel — his contribution. This interactive walkthrough is one possible "skill" built on top of it: a scripted curriculum that takes you through the code step by step, with visuals and narrative pulled from his blog post.
            </p>
            <p>
              It was itself built entirely by an AI agent (Claude) from Karpathy's source material — the gist, the blog post, and this podcast interview. The agent understood the code and the pedagogy, then generated the walkthrough. Exactly the kind of redirection through agents that Karpathy describes.
            </p>
            <p>
              But the insight that 200 lines is the right level of compression, the choice of what to include and what to leave out — that's the human contribution that no agent could originate.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center pb-8"
        >
          <button
            onClick={onStart}
            className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl text-lg font-medium transition-colors shadow-lg shadow-purple-600/25 hover:shadow-purple-500/30"
          >
            Start the walkthrough
          </button>
        </motion.div>

      </div>
    </div>
  )
}
