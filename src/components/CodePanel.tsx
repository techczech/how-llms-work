import { motion } from 'framer-motion'

interface CodePanelProps {
  code: string
}

export function CodePanel({ code }: CodePanelProps) {
  const lines = code.split('\n')

  return (
    <div className="h-full flex flex-col bg-[#0d1117] rounded-xl overflow-hidden border border-gray-700/50">
      <div className="px-4 py-2 border-b border-gray-700/50 bg-[#161b22] flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-xs text-gray-500 ml-2 font-mono">microgpt.py</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <pre className="text-[13px] leading-[1.6]">
          {lines.map((line, i) => (
            <motion.div
              key={`${i}-${line.slice(0, 20)}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.025, duration: 0.15 }}
              className="flex"
            >
              <span className="text-gray-600 w-7 text-right mr-4 select-none text-xs leading-[1.6] shrink-0">
                {i + 1}
              </span>
              <code className="flex-1 whitespace-pre">
                <SyntaxLine line={line} />
              </code>
            </motion.div>
          ))}
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
        if (token === 'Value' || token === 'Value') return <span key={i} className="text-[#ffa657]">{token}</span>
        return <span key={i} className="text-[#c9d1d9]">{token}</span>
      })}
    </span>
  )
}
