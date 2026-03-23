import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { scaleComparison } from '@/data/steps'

interface DiagramPanelProps {
  phase: string
  title?: string
  subtitle?: string
}

export function DiagramPanel({ phase, title, subtitle }: DiagramPanelProps) {
  const Diagram = diagrams[phase] ?? OverviewDiagram
  return (
    <div className="h-full flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50">
        <span className="text-lg font-bold text-gray-800">{title}</span>
        {subtitle && <span className="text-sm text-gray-500 ml-2">{subtitle}</span>}
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <Diagram />
      </div>
    </div>
  )
}

const diagrams: Record<string, () => ReactNode> = {
  overview: OverviewDiagram,
  dataset: DatasetDiagram,
  tokenizer: TokenizerDiagram,
  autograd: AutogradDiagram,
  parameters: ParametersDiagram,
  embeddings: EmbeddingsDiagram,
  attention: AttentionDiagram,
  mlp: MLPDiagram,
  training: TrainingDiagram,
  optimizer: OptimizerDiagram,
  inference: InferenceDiagram,
  scaling: ScalingDiagram,
}

function OverviewDiagram() {
  const stages = [
    { label: 'Tokenize', desc: 'Text → integers', color: 'bg-blue-100 border-blue-300 text-blue-800' },
    { label: 'Embed', desc: 'IDs → vectors', color: 'bg-indigo-100 border-indigo-300 text-indigo-800' },
    { label: 'Attend', desc: 'Tokens communicate', color: 'bg-purple-100 border-purple-300 text-purple-800' },
    { label: 'Transform', desc: 'MLP computation', color: 'bg-amber-100 border-amber-300 text-amber-800' },
    { label: 'Predict', desc: 'Next token probs', color: 'bg-green-100 border-green-300 text-green-800' },
    { label: 'Backprop', desc: 'Compute gradients', color: 'bg-orange-100 border-orange-300 text-orange-800' },
    { label: 'Update', desc: 'Adjust parameters', color: 'bg-red-100 border-red-300 text-red-800' },
  ]
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500 text-center">What happens in one training step:</p>
      <div className="flex flex-col items-center gap-1">
        {stages.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="w-full">
            <div className={`flex items-center justify-between px-4 py-2.5 rounded-lg border ${s.color}`}>
              <span className="font-medium text-sm">{s.label}</span>
              <span className="text-xs opacity-70">{s.desc}</span>
            </div>
            {i < stages.length - 1 && <div className="flex justify-center"><div className="w-0.5 h-2 bg-gray-300" /></div>}
          </motion.div>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center">Each training step repeats this cycle. The walkthrough ahead explores each piece in depth.</p>
    </div>
  )
}

function DatasetDiagram() {
  const names = ['emma', 'olivia', 'ava', 'isabella', 'sophia', 'charlotte', 'mia', 'amelia']
  const generated = ['kamon', 'karai', 'vialan', 'alerin', 'karia', 'yeran', 'lenne', 'kaina']
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 text-center">32,033 names in → plausible new names out</p>
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2 text-center">Training data</div>
          <div className="space-y-1">
            {names.map((name, i) => (
              <motion.div key={name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="font-mono text-xs px-2.5 py-1 rounded bg-cyan-50 border border-cyan-200 text-cyan-700 text-center"
              >{name}</motion.div>
            ))}
            <div className="text-[10px] text-gray-400 text-center">... 32,025 more</div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-xs text-gray-400 font-medium"
          >train<br/>1,000×</motion.div>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6, duration: 0.3 }}
            className="w-8 h-0.5 bg-gray-300 my-1"
          />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="text-gray-400">→</motion.div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2 text-center">Generated</div>
          <div className="space-y-1">
            {generated.map((name, i) => (
              <motion.div key={name} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.06 }}
                className="font-mono text-xs px-2.5 py-1 rounded bg-green-50 border border-green-200 text-green-700 text-center"
              >{name}</motion.div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center">None of the generated names are in the training data</p>
    </div>
  )
}

function TokenizerDiagram() {
  const chars = 'emma'.split('')
  const ids = [4, 12, 12, 0]
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">Tokenizing "emma" with BOS delimiters:</p>
      <div className="flex items-center justify-center gap-1.5">
        <Token ch="BOS" id={26} highlight />
        {chars.map((ch, i) => <Token key={i} ch={ch} id={ids[i]} delay={i * 0.12} />)}
        <Token ch="BOS" id={26} highlight delay={0.6} />
      </div>
      <div className="flex flex-wrap gap-1 justify-center mt-3">
        {'abcdefghijklmnopqrstuvwxyz'.split('').map((ch) => (
          <div key={ch} className={`w-6 h-6 rounded text-[10px] flex items-center justify-center font-mono border ${
            ['a', 'e', 'm'].includes(ch)
              ? 'bg-yellow-100 border-yellow-400 text-yellow-800 font-bold'
              : 'bg-gray-50 border-gray-200 text-gray-400'
          }`}>{ch}</div>
        ))}
        <div className="w-8 h-6 rounded text-[10px] flex items-center justify-center font-mono bg-purple-100 border border-purple-400 text-purple-800 font-bold">BOS</div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800">
        <strong>Result:</strong> [26, 4, 12, 12, 0, 26] — the neural network never sees letters, only integers.
      </motion.div>
    </div>
  )
}

function Token({ ch, id, highlight, delay = 0 }: { ch: string; id: number; highlight?: boolean; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="flex flex-col items-center gap-1">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-base font-mono font-bold border-2 ${
        highlight ? 'bg-purple-100 border-purple-400 text-purple-800' : 'bg-blue-100 border-blue-400 text-blue-800'
      }`}>{ch}</div>
      <div className="text-[10px] text-gray-400">↓</div>
      <div className={`w-11 h-8 rounded flex items-center justify-center text-sm font-mono font-bold border ${
        highlight ? 'bg-purple-50 border-purple-300 text-purple-700' : 'bg-green-50 border-green-300 text-green-700'
      }`}>{id}</div>
    </motion.div>
  )
}

function AutogradDiagram() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Computation graph for: L = a×b + a (a=2, b=3)</p>
      <svg viewBox="0 0 300 240" className="w-full max-w-xs mx-auto">
        {/* Edges */}
        {[[50,200,100,140],[140,200,100,140],[100,140,170,80],[220,200,170,80],[170,80,170,30]].map(([x1,y1,x2,y2], i) => (
          <motion.line key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2+i*0.1 }}
            x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="2" />
        ))}
        {/* Nodes */}
        {[
          { x: 50, y: 200, r: 22, fill: '#dbeafe', stroke: '#3b82f6', text: 'a=2', delay: 0 },
          { x: 140, y: 200, r: 22, fill: '#dbeafe', stroke: '#3b82f6', text: 'b=3', delay: 0.1 },
          { x: 220, y: 200, r: 22, fill: '#dbeafe', stroke: '#3b82f6', text: 'a=2', delay: 0.15 },
          { x: 100, y: 140, r: 22, fill: '#fef3c7', stroke: '#f59e0b', text: '×=6', delay: 0.3 },
          { x: 170, y: 80, r: 22, fill: '#fef3c7', stroke: '#f59e0b', text: '+=8', delay: 0.5 },
          { x: 170, y: 30, r: 22, fill: '#fee2e2', stroke: '#ef4444', text: 'L=8', delay: 0.7 },
        ].map((n, i) => (
          <motion.g key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: n.delay }}>
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.fill} stroke={n.stroke} strokeWidth="2" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#1f2937">{n.text}</text>
          </motion.g>
        ))}
        {/* Gradient labels */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          {[
            { x: 10, y: 195, t: 'grad=4' },
            { x: 140, y: 230, t: 'grad=2' },
            { x: 235, y: 195, t: 'grad=1' },
            { x: 200, y: 30, t: 'grad=1' },
          ].map((g, i) => (
            <text key={i} x={g.x} y={g.y} fontSize="9" fontFamily="monospace" fill="#ef4444">{g.t}</text>
          ))}
        </motion.g>
      </svg>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-blue-50 rounded border border-blue-200 text-blue-800"><strong>Forward ↑</strong> Compute values</div>
        <div className="p-2 bg-red-50 rounded border border-red-200 text-red-800"><strong>Backward ↓</strong> Chain rule for grads</div>
      </div>
    </div>
  )
}

function ParametersDiagram() {
  const layers = [
    { name: 'Token Embed (wte)', shape: '27×16', params: 432, color: 'blue' },
    { name: 'Position Embed (wpe)', shape: '16×16', params: 256, color: 'indigo' },
    { name: 'Attn Q,K,V,O', shape: '4×(16×16)', params: 1024, color: 'purple' },
    { name: 'MLP fc1', shape: '64×16', params: 1024, color: 'amber' },
    { name: 'MLP fc2', shape: '16×64', params: 1024, color: 'amber' },
    { name: 'Output (lm_head)', shape: '27×16', params: 432, color: 'green' },
  ]
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">4,192 parameters organized into matrices:</p>
      {layers.map((l, i) => (
        <motion.div key={l.name} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
          <div>
            <div className="text-sm font-medium text-gray-800">{l.name}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono text-gray-500">{l.shape}</div>
            <div className="text-[10px] text-gray-400">{l.params} params</div>
          </div>
        </motion.div>
      ))}
      <div className="text-xs text-gray-400 text-center">All start as random Gaussian noise (μ=0, σ=0.08)</div>
    </div>
  )
}

function EmbeddingsDiagram() {
  const tok = [0.03, -0.07, 0.12, 0.05, -0.02, 0.08]
  const pos = [0.01, 0.05, -0.02, 0.03, 0.07, -0.01]
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Token "e" (id=4) at position 1:</p>
      <VecRow label="Token Embed" color="blue" values={tok} delay={0} />
      <div className="flex justify-center"><div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-500">+</div></div>
      <VecRow label="Position Embed" color="indigo" values={pos} delay={0.3} />
      <div className="flex justify-center"><div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-500">=</div></div>
      <VecRow label="Combined x" color="green" values={tok.map((v, i) => v + pos[i])} delay={0.6} bold />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800">
        This 16-dim vector IS the model's representation of "e at position 1". The model learns what these numbers mean through training.
      </motion.div>
    </div>
  )
}

function VecRow({ label, color, values, delay, bold }: { label: string; color: string; values: number[]; delay: number; bold?: boolean }) {
  const bgMap: Record<string, string> = { blue: 'bg-blue-100 border-blue-300', indigo: 'bg-indigo-100 border-indigo-300', green: 'bg-green-100 border-green-400' }
  const textMap: Record<string, string> = { blue: 'text-blue-600', indigo: 'text-indigo-600', green: 'text-green-600' }
  return (
    <div>
      <div className={`text-xs font-medium mb-1 ${textMap[color] ?? 'text-gray-600'}`}>{label}:</div>
      <div className="flex gap-1">
        {values.map((v, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay + i * 0.04 }}
            className={`w-12 h-9 rounded flex items-center justify-center text-[10px] font-mono border ${bgMap[color] ?? 'bg-gray-100 border-gray-300'} ${bold ? 'font-bold' : ''}`}>
            {v.toFixed(2)}
          </motion.div>
        ))}
        <span className="text-gray-400 text-xs self-center ml-1">…</span>
      </div>
    </div>
  )
}

function AttentionDiagram() {
  const tokens = ['BOS', 'e', 'm', 'm']
  const weights = [0.05, 0.15, 0.70, 0.10]
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">Token "a" (pos 4) attending to previous tokens:</p>
      <div className="flex gap-3 justify-center">
        {['Query (Q)', 'Key (K)', 'Value (V)'].map((label, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`flex-1 p-2.5 rounded-lg border text-center ${
              i === 0 ? 'bg-rose-50 border-rose-300 text-rose-800' :
              i === 1 ? 'bg-sky-50 border-sky-300 text-sky-800' :
              'bg-emerald-50 border-emerald-300 text-emerald-800'
            }`}>
            <div className="text-xs font-bold">{label}</div>
            <div className="text-[10px] mt-0.5 opacity-70">{['What am I looking for?', 'What do I contain?', 'What do I offer?'][i]}</div>
          </motion.div>
        ))}
      </div>
      <div className="flex items-end gap-2 justify-center h-28">
        {tokens.map((tok, i) => (
          <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex flex-col items-center origin-bottom">
            <div className="text-[10px] font-mono text-gray-500 mb-0.5">{(weights[i]*100).toFixed(0)}%</div>
            <div className="w-12 rounded-t" style={{ height: `${weights[i]*140}px`, backgroundColor: `rgba(139,92,246,${0.3+weights[i]*0.7})` }} />
            <div className="w-12 h-8 bg-gray-100 border border-gray-300 rounded-b flex items-center justify-center text-xs font-mono font-bold">{tok}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        className="p-2 bg-gray-50 rounded border border-gray-200 text-xs text-center font-mono text-gray-600">
        score = (q · k) / √d → softmax → weights that sum to 1
      </motion.div>
    </div>
  )
}

function MLPDiagram() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Expand → ReLU → Contract:</p>
      <div className="flex flex-col items-center gap-2">
        <Layer n={16} color="bg-blue-200 border-blue-300" label="Input: 16 dims" delay={0} />
        <Arrow label="Linear (expand 4×)" delay={0.2} />
        <Layer n={48} color="bg-amber-200 border-amber-300" label="Expanded: 64 dims" delay={0.3} small />
        <Arrow label="ReLU (zero negatives)" delay={0.5} />
        <div className="flex gap-0.5 flex-wrap justify-center max-w-[280px]">
          {Array.from({ length: 48 }).map((_, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.005 }}
              className={`w-2.5 h-5 rounded-sm border ${i % 3 === 0 ? 'bg-gray-100 border-gray-200' : 'bg-amber-300 border-amber-400'}`} />
          ))}
        </div>
        <div className="text-[10px] text-gray-400">~⅓ zeroed out (sparse activation)</div>
        <Arrow label="Linear (contract)" delay={0.8} />
        <Layer n={16} color="bg-green-200 border-green-300" label="Output: 16 dims + residual" delay={0.9} />
      </div>
    </div>
  )
}

function Layer({ n, color, label, delay, small }: { n: number; color: string; label: string; delay: number; small?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>
      <div className="flex gap-0.5 justify-center flex-wrap max-w-[280px]">
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} className={`${small ? 'w-2.5 h-5' : 'w-3.5 h-7'} rounded-sm border ${color}`} />
        ))}
      </div>
      <div className="text-[10px] text-gray-500 text-center mt-0.5">{label}</div>
    </motion.div>
  )
}

function Arrow({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }} className="text-[10px] text-gray-400 text-center">
      ↓ {label}
    </motion.div>
  )
}

function TrainingDiagram() {
  const lossCurve = [3.37, 3.42, 3.18, 3.07, 3.22, 2.95, 2.80, 2.70, 2.55, 2.45, 2.40, 2.37]
  const maxLoss = 3.5
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Loss decreases from ~3.3 (random) to ~2.37:</p>
      <div className="flex items-end gap-1.5 h-28 border-b border-l border-gray-300 pl-1 pb-0.5">
        {lossCurve.map((loss, i) => (
          <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.2 + i * 0.06 }} className="flex flex-col items-center flex-1 origin-bottom">
            <div className="text-[8px] font-mono text-gray-400 mb-0.5">{loss.toFixed(1)}</div>
            <div className="w-full rounded-t bg-gradient-to-t from-purple-500 to-purple-300" style={{ height: `${(loss / maxLoss) * 90}px` }} />
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between text-[9px] text-gray-400 px-1">
        <span>Step 1</span><span>Step 1000</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 text-[10px]">
        {['1. Pick doc', '2. Forward pass', '3. Backward pass', '4. Adam update'].map((s, i) => (
          <motion.div key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.08 }}
            className="p-1.5 bg-gray-50 rounded border border-gray-200 text-center text-gray-600 font-medium">{s}</motion.div>
        ))}
      </div>
    </div>
  )
}

function OptimizerDiagram() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Adam vs basic gradient descent:</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-xs font-bold text-gray-600 mb-1">Basic SGD</div>
          <div className="text-[10px] font-mono text-gray-500">p -= lr × grad</div>
          <div className="text-[10px] text-gray-400 mt-1">Same rate for all params</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-xs font-bold text-green-700 mb-1">Adam</div>
          <div className="text-[10px] font-mono text-green-600">p -= lr × m̂/(√v̂ + ε)</div>
          <div className="text-[10px] text-green-500 mt-1">Momentum + adaptive rate</div>
        </div>
      </div>
      <div className="space-y-1.5">
        {[
          { label: 'm (momentum)', desc: 'EMA of gradients — pushes through flat regions', color: 'bg-blue-50 border-blue-200' },
          { label: 'v (adaptive rate)', desc: 'EMA of squared gradients — per-param learning rate', color: 'bg-amber-50 border-amber-200' },
          { label: 'bias correction', desc: 'Compensates for zero-initialization warmup', color: 'bg-gray-50 border-gray-200' },
          { label: 'lr decay', desc: 'Large steps early (explore) → small steps late (refine)', color: 'bg-green-50 border-green-200' },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
            className={`px-3 py-2 rounded-lg border ${item.color}`}>
            <span className="text-xs font-bold text-gray-700">{item.label}</span>
            <span className="text-[10px] text-gray-500 ml-2">{item.desc}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function InferenceDiagram() {
  const seq = [
    { input: 'BOS', output: 'k' },
    { input: 'k', output: 'a' },
    { input: 'a', output: 'm' },
    { input: 'm', output: 'o' },
    { input: 'o', output: 'n' },
    { input: 'n', output: 'BOS' },
  ]
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Autoregressive generation — output feeds back as input:</p>
      <div className="space-y-1">
        {seq.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
            className="flex items-center gap-2 text-sm">
            <div className="w-9 h-7 bg-gray-100 border border-gray-300 rounded flex items-center justify-center font-mono text-[10px]">{s.input}</div>
            <span className="text-gray-400 text-xs">→ GPT →</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: i * 0.15 + 0.05, duration: 0.2 }}
                className="h-full bg-purple-400 rounded-full" />
            </div>
            <span className="text-gray-400 text-xs">→ sample →</span>
            <div className={`w-9 h-7 rounded flex items-center justify-center font-mono text-[10px] font-bold ${
              s.output === 'BOS' ? 'bg-red-100 border border-red-300 text-red-700' : 'bg-green-100 border border-green-300 text-green-700'
            }`}>{s.output}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
        <div className="text-lg font-bold text-green-800 font-mono">kamon</div>
        <div className="text-xs text-green-600 mt-0.5">A hallucinated name that doesn't exist in the training data</div>
      </motion.div>
      <div className="flex gap-2 text-[10px]">
        <div className="flex-1 p-2 bg-blue-50 rounded border border-blue-200 text-blue-700 text-center">temp=0.1 → "a" (boring)</div>
        <div className="flex-1 p-2 bg-purple-50 rounded border border-purple-200 text-purple-700 text-center font-bold">temp=0.5 → balanced</div>
        <div className="flex-1 p-2 bg-red-50 rounded border border-red-200 text-red-700 text-center">temp=1.5 → "xqz" (wild)</div>
      </div>
    </div>
  )
}

function ScalingDiagram() {
  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-100 text-[10px] font-bold text-gray-600 px-3 py-1.5">
          <div>Dimension</div><div className="text-center">microgpt</div><div className="text-center">GPT-4 / Claude</div>
        </div>
        {scaleComparison.map((row, i) => (
          <motion.div key={row.dim} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
            className="grid grid-cols-3 text-[11px] px-3 py-1.5 border-t border-gray-100 even:bg-gray-50">
            <div className="text-gray-700 font-medium">{row.dim}</div>
            <div className="text-center font-mono text-gray-500">{row.micro}</div>
            <div className="text-center font-mono text-purple-700 font-bold">{row.prod}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-sm text-purple-800 text-center">
        Same embed → attend → transform → predict → backprop → update loop.
        <br /><span className="opacity-70">The gap is scale, not algorithm.</span>
      </motion.div>
    </div>
  )
}
