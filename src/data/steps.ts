export interface CodeAnnotation {
  lines: number[]  // 1-indexed line numbers
  title: string
  explanation: string
}

export interface Step {
  id: string
  phase: string
  group: string
  title: string
  subtitle: string
  narrative: string
  expandable?: { title: string; content: string }
  duration: number
  codeStartLine?: number
  code: string
  codeAnnotations?: CodeAnnotation[]
}

export const stepGroups = [
  { id: 'context', label: 'Context' },
  { id: 'preprocessing', label: 'Preprocessing' },
  { id: 'engine', label: 'Learning Engine' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'training', label: 'Training' },
  { id: 'using', label: 'Using the Model' },
] as const

export const BLOG_URL = 'https://karpathy.github.io/2026/02/12/microgpt/'
export const GIST_URL = 'https://gist.github.com/karpathy/8627fe009c40f57531cb18360106ce95'
export const COLAB_URL = 'https://colab.research.google.com/drive/1vyN5zo6rqUp_dYNbT4Yrco66zuWCZKoN?usp=sharing'
export const NAMES_URL = 'https://raw.githubusercontent.com/karpathy/makemore/refs/heads/master/names.txt'

export const steps: Step[] = [
  {
    id: 'task',
    phase: 'overview',
    group: 'context',
    title: 'The Task',
    subtitle: 'What microgpt does and why it matters',
    codeStartLine: 1,
    narrative: `This is Karpathy's microgpt — a single Python file that trains a tiny neural network on 32,000 baby names and then generates plausible new ones. The entire algorithm fits in 200 lines with zero dependencies: no PyTorch, no TensorFlow, no GPU required. It runs in about a minute on a laptop.

The goal: learn which letters tend to follow which in real names, then "hallucinate" convincing new ones. After training, the model produces names like "kamon", "karai", "vialan", and "alerin" — names that sound real but aren't in the original list.

Why does this matter? This is the exact same algorithm behind ChatGPT and Claude. Same tokenizer, same attention mechanism, same training loop. The only difference is scale — 4,192 parameters here vs. hundreds of billions in production. From a production model's perspective, your conversation is just a funny-looking "document" and its response is statistical document completion.

"Everything else is just efficiency."`,
    expandable: {
      title: 'How to run it yourself',
      content: 'All you need is Python — no pip install, no dependencies. Save microgpt.py and run: python microgpt.py. The script downloads the dataset automatically, trains for 1,000 steps (~1 minute on a MacBook), then generates 20 new names. You can also run it directly in a Google Colab notebook. Try playing with the script: use a different dataset, train for longer (increase num_steps), or increase the model size for better results.',
    },
    duration: 5000,
    code: `"""
The most atomic way to train and run inference
for a GPT in pure, dependency-free Python.
This file is the complete algorithm.
Everything else is just efficiency.

@karpathy
"""

import os       # os.path.exists
import math     # math.log, math.exp
import random   # random.seed, random.choices
random.seed(42) # Let there be order among chaos

# --- After training, the model generates: ---
# sample  1: kamon
# sample  2: ann
# sample  3: karai
# sample  4: jaire
# sample  5: vialan
# sample  6: karia
# sample  7: yeran
# sample  8: anna
# sample  9: areli
# sample 10: kaina`,
    codeAnnotations: [
      { lines: [1, 2, 3, 4, 5, 6, 7, 8], title: 'Docstring', explanation: 'The manifesto: this single file IS the complete algorithm. Everything production LLMs add (GPUs, tensors, distributed training) is optimization, not new ideas.' },
      { lines: [10, 11, 12], title: 'Imports', explanation: 'Only 3 standard library modules. os for file I/O, math for log/exp (needed for loss and softmax), random for reproducibility and sampling. Zero external dependencies — no PyTorch, no NumPy.' },
      { lines: [13], title: 'Random seed', explanation: 'Fixes the random number generator so every run produces identical results. Essential for debugging — without this, training would differ each time. The number 42 is a Hitchhiker\'s Guide reference.' },
      { lines: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24], title: 'Sample output', explanation: 'After 1,000 training steps, the model generates these names. None of them are in the original dataset — the model learned the statistical patterns of English names and can now "hallucinate" new plausible ones. This is exactly what ChatGPT does with text, just at a much larger scale.' },
    ],
  },
  {
    id: 'dataset',
    phase: 'dataset',
    group: 'context',
    title: 'The Data',
    subtitle: '32,033 baby names — each one a "document"',
    codeStartLine: 14,
    narrative: `The fuel of large language models is text data, optionally separated into a set of documents. In production, each document would be an internet web page, but for microgpt we use a simpler example: 32,033 baby names from US Social Security data, one per line.

The script downloads names.txt automatically if it's not already present. Each name is a "document" — the model's job is to learn the patterns in the data and then generate similar new documents that share the same statistical patterns.

The names are shuffled so the model doesn't memorize the file order. Instead, it learns general patterns: which letters tend to follow which, how names typically start and end, what makes a name "sound right."

This is the same relationship ChatGPT has with its training data. Where microgpt sees "emma" and learns that 'm' often follows 'e', ChatGPT sees billions of web pages and learns that "the cat sat on the" is often followed by "mat." The principle is identical — only the scale differs.`,
    expandable: {
      title: 'What does the training output look like?',
      content: 'When you run the script, you see the loss printed at each step: "step 1/1000 | loss 3.3660". The loss starts around 3.3 (random guessing among 27 tokens: −log(1/27) ≈ 3.3) and decreases to about 2.37 over 1,000 steps. Lower is better — the model is learning to predict which letter comes next. Perfect prediction would be loss 0, so there\'s room to improve. You can train longer or make the model bigger for better results.',
    },
    duration: 5000,
    code: `# Let there be a Dataset
# Download 32,033 baby names if not present
if not os.path.exists('input.txt'):
    import urllib.request
    names_url = 'https://raw.githubusercontent.com/karpathy/makemore/master/names.txt'
    urllib.request.urlretrieve(names_url, 'input.txt')
docs = [line.strip() for line in open('input.txt')
        if line.strip()]
random.shuffle(docs)
print(f"num docs: {len(docs)}")
# >>> num docs: 32033

# The data looks like this:
# emma
# olivia
# ava
# isabella
# sophia
# charlotte
# ... (32,033 names total)`,
    codeAnnotations: [
      { lines: [1, 2, 3, 4, 5, 6], title: 'Auto-download', explanation: 'The script downloads names.txt from Karpathy\'s GitHub repo if not already present. This is the only network operation — once downloaded, everything runs locally. The dataset is a plain text file: one lowercase name per line.' },
      { lines: [7, 8, 9, 10, 11], title: 'Load and shuffle', explanation: 'Reads all names, strips whitespace, filters empty lines. random.shuffle randomizes the order so the model doesn\'t memorize the sequence of the training data — it should learn patterns in the names themselves, not patterns in the file ordering.' },
      { lines: [13, 14, 15, 16, 17, 18, 19], title: 'The raw data', explanation: 'Just lowercase names, one per line. Each name is a "document." In production LLMs, each document would be an entire web page, book chapter, or conversation. The model\'s job is the same either way: learn the statistical patterns and generate more text that shares those patterns.' },
    ],
  },
  {
    id: 'tokenizer',
    phase: 'tokenizer',
    group: 'preprocessing',
    title: 'Tokenize',
    subtitle: 'Text → integers',
    codeStartLine: 23,
    narrative: `Under the hood, neural networks work with numbers, not characters, so we need a way to convert text into a sequence of integer token IDs and back. Production tokenizers like tiktoken (used by GPT-4) operate on chunks of characters for efficiency, but the simplest possible tokenizer just assigns one integer to each unique character in the dataset.

We collect all unique characters across the dataset (just the lowercase letters a–z), sort them, and each letter gets an ID by its index. The integer values themselves have no meaning at all — each token is just a separate discrete symbol. Instead of 0, 1, 2 they might as well be different emoji.

We also create one special token called BOS (Beginning of Sequence), which acts as a delimiter: it tells the model "a new document starts/ends here." During training, each name gets wrapped with BOS on both sides: [BOS, e, m, m, a, BOS]. The model learns that BOS initiates a new name, and another BOS ends it.

Final vocabulary: 27 tokens (26 lowercase letters + 1 BOS token).`,
    expandable: {
      title: 'How do production tokenizers differ?',
      content: 'Production models use subword tokenizers like BPE (Byte Pair Encoding), which learn to merge frequently co-occurring character sequences into single tokens. Common words like "the" become one token, rare words get broken into pieces. This gives a vocabulary of ~100K tokens and is much more efficient because the model sees more content per position.',
    },
    duration: 5000,
    code: `# unique characters become token ids 0..n-1
uchars = sorted(set(''.join(docs)))
BOS = len(uchars)       # Beginning of Sequence token
vocab_size = len(uchars) + 1  # +1 for BOS
print(f"vocab size: {vocab_size}")

# Example: tokenize "emma"
doc = "emma"
tokens = [BOS] + [uchars.index(ch) for ch in doc] + [BOS]
# tokens = [26, 4, 12, 12, 0, 26]
#           BOS  e   m   m   a  BOS

# vocab: a=0, b=1, c=2, d=3, e=4, f=5, ...
#         z=25, BOS=26`,
    codeAnnotations: [
      { lines: [1, 2], title: 'Build vocabulary', explanation: 'Collects every unique character across all names, sorts them alphabetically. sorted(set(...)) gives a deterministic ordering: a=0, b=1, ..., z=25. The IDs themselves are arbitrary — what matters is each character gets a unique integer.' },
      { lines: [3], title: 'BOS token', explanation: 'BOS (Beginning of Sequence) gets the next available ID (26). It serves double duty: marks the start of a name AND the end. The model learns that generating BOS means "I\'m done with this name."' },
      { lines: [4, 5], title: 'Vocabulary size', explanation: '26 letters + 1 BOS = 27 tokens total. This is the number of possible outputs at each step. Production models use ~100K tokens (subword pieces), but the principle is identical.' },
      { lines: [7, 8, 9, 10, 11], title: 'Tokenization example', explanation: 'The name "emma" becomes [BOS, e, m, m, a, BOS] = [26, 4, 12, 12, 0, 26]. Each character is replaced by its index in the sorted vocabulary. BOS bookends tell the model where names start and end.' },
      { lines: [13], title: 'Vocabulary mapping', explanation: 'The complete mapping from characters to IDs. This is a character-level tokenizer — the simplest possible. Production tokenizers (BPE) merge frequent character pairs into single tokens for efficiency.' },
    ],
  },
  {
    id: 'autograd',
    phase: 'autograd',
    group: 'engine',
    title: 'Backprop',
    subtitle: 'Compute gradients',
    codeStartLine: 30,
    narrative: `Training a neural network requires gradients: for each parameter, we need to know "if I nudge this number up a little, does the loss go up or down, and by how much?"

A Value wraps a single scalar number (.data) and tracks how it was computed. Think of each operation as a little lego block: it takes some inputs, produces an output (the forward pass), and it knows how its output would change with respect to each of its inputs (the local gradient). That's all the information autograd needs. Everything else is just the chain rule, stringing the blocks together.

Every time you do math with Value objects (add, multiply, etc.), the result is a new Value that remembers its inputs and the local derivative. For example, __mul__ records that ∂(a·b)/∂a = b and ∂(a·b)/∂b = a.

The backward() method walks the graph in reverse topological order, applying the chain rule at each step. We kick things off by setting self.grad = 1 at the loss node, because ∂L/∂L = 1. From there, the chain rule just multiplies local gradients along every path back to the parameters.

Note the += (accumulation, not assignment). When a value is used in multiple places in the graph, gradients flow back along each branch independently and must be summed.

"If a car travels twice as fast as a bicycle and the bicycle is four times as fast as a walking man, then the car travels 2 × 4 = 8 times as fast as the man." The chain rule is the same idea: you multiply the rates of change along the path.`,
    expandable: {
      title: 'How does this compare to PyTorch?',
      content: 'This is the same algorithm that PyTorch\'s loss.backward() runs, just on scalars instead of tensors (arrays of scalars). Algorithmically identical, significantly smaller and simpler, but of course a lot less efficient. Production systems use tensors and run on GPUs that perform billions of floating-point operations per second.',
    },
    duration: 6000,
    code: `class Value:
    def __init__(self, data, children=(), local_grads=()):
        self.data = data          # forward: computed value
        self.grad = 0             # backward: ∂loss/∂self
        self._children = children
        self._local_grads = local_grads

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        return Value(self.data + other.data,
                     (self, other), (1, 1))

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        return Value(self.data * other.data,
                     (self, other), (other.data, self.data))

    def __pow__(self, n):
        return Value(self.data**n, (self,),
                     (n * self.data**(n-1),))
    def log(self):
        return Value(math.log(self.data), (self,),
                     (1/self.data,))
    def exp(self):
        return Value(math.exp(self.data), (self,),
                     (math.exp(self.data),))
    def relu(self):
        return Value(max(0, self.data), (self,),
                     (float(self.data > 0),))

    def backward(self):
        topo = []
        visited = set()
        def build_topo(v):
            if v not in visited:
                visited.add(v)
                for child in v._children:
                    build_topo(child)
                topo.append(v)
        build_topo(self)
        self.grad = 1  # ∂loss/∂loss = 1
        for v in reversed(topo):
            for child, lg in zip(v._children, v._local_grads):
                child.grad += lg * v.grad  # chain rule!`,
    codeAnnotations: [
      { lines: [1, 2, 3, 4, 5, 6], title: 'Value class', explanation: 'Each Value wraps a single number (.data) and tracks its gradient (.grad). It also remembers which Values produced it (_children) and the local derivatives (_local_grads). This is the foundation of automatic differentiation.' },
      { lines: [8, 9, 10, 11], title: 'Addition', explanation: 'When two Values are added, the result remembers both inputs. The local gradients are both 1 because ∂(a+b)/∂a = 1 and ∂(a+b)/∂b = 1. The isinstance check lets you write v + 3 (auto-wrapping the 3).' },
      { lines: [13, 14, 15, 16], title: 'Multiplication', explanation: 'For a*b, the local gradient w.r.t. a is b, and w.r.t. b is a. This is the product rule: ∂(a·b)/∂a = b. These stored gradients are used later during backpropagation.' },
      { lines: [18, 19, 20], title: 'Power', explanation: 'Implements the power rule: ∂(x^n)/∂x = n·x^(n-1). Used for squared differences in loss computation and in the optimizer\'s square root.' },
      { lines: [21, 22, 23], title: 'Log', explanation: 'Natural logarithm with derivative 1/x. Critical for the cross-entropy loss: -log(probability). When the model assigns high probability to the correct token, -log(p) is small (low loss).' },
      { lines: [24, 25, 26], title: 'Exp', explanation: 'Exponential function, derivative is itself: ∂e^x/∂x = e^x. Used in softmax to convert logits to probabilities. The self-derivative property makes backprop through softmax elegant.' },
      { lines: [27, 28, 29], title: 'ReLU', explanation: 'Rectified Linear Unit: max(0, x). Gradient is 1 if x > 0, else 0 (a binary gate). This nonlinearity is what gives the network its learning power — without it, stacked layers would collapse into one linear transformation.' },
      { lines: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40], title: 'Topological sort', explanation: 'Before backpropagating, we need to process nodes in the right order: a node\'s gradient must be fully computed before we propagate through it. This DFS-based topological sort ensures that.' },
      { lines: [41], title: 'Seed gradient', explanation: 'Backprop starts at the loss node. ∂loss/∂loss = 1 by definition. This "1" is the seed that flows backward through the entire computation graph.' },
      { lines: [42, 43, 44], title: 'Chain rule', explanation: 'The core of backpropagation: for each node, multiply the local gradient by the upstream gradient and ADD it to the child\'s gradient. The += (not =) is crucial — when a value is reused in multiple places, gradients from all paths must be summed.' },
    ],
  },
  {
    id: 'parameters',
    phase: 'parameters',
    group: 'architecture',
    title: 'Parameters',
    subtitle: 'The model\'s knowledge',
    codeStartLine: 75,
    narrative: `The parameters are the knowledge of the model. They are a large collection of floating-point numbers (wrapped in Value for autograd) that start out random and are iteratively optimized during training.

Each parameter is initialized to a small random number drawn from a Gaussian distribution. The state_dict organizes them into named matrices (borrowing PyTorch's terminology): embedding tables, attention weights, MLP weights, and a final output projection.

We also flatten all parameters into a single list so the optimizer can loop over them later. In our tiny model this comes out to 4,192 parameters. GPT-2 had 1.6 billion, and modern LLMs have hundreds of billions.

The exact role of each parameter will make more sense once we define the model architecture, but the key dimensions are: n_embd=16 (embedding width), n_head=4 (attention heads), n_layer=1 (transformer depth), and block_size=16 (max context length — the longest name is 15 characters).`,
    expandable: {
      title: 'How do parameters scale?',
      content: 'Our model: 4,192 parameters. GPT-2: 1.6 billion. GPT-4-class models: hundreds of billions to over a trillion. The architecture is the same — just much wider (embedding dimensions of 10,000+) and much deeper (100+ layers).',
    },
    duration: 5000,
    code: `n_embd = 16      # embedding dimension (width)
n_head = 4       # number of attention heads
n_layer = 1      # transformer depth
block_size = 16  # max context length
head_dim = n_embd // n_head  # = 4

# Initialize random weight matrices
matrix = lambda nout, nin, std=0.08: [
    [Value(random.gauss(0, std)) for _ in range(nin)]
    for _ in range(nout)
]

state_dict = {
    'wte': matrix(vocab_size, n_embd),    # token embeddings
    'wpe': matrix(block_size, n_embd),    # position embeddings
    'lm_head': matrix(vocab_size, n_embd),# output projection
}
for i in range(n_layer):
    state_dict[f'layer{i}.attn_wq'] = matrix(n_embd, n_embd)
    state_dict[f'layer{i}.attn_wk'] = matrix(n_embd, n_embd)
    state_dict[f'layer{i}.attn_wv'] = matrix(n_embd, n_embd)
    state_dict[f'layer{i}.attn_wo'] = matrix(n_embd, n_embd)
    state_dict[f'layer{i}.mlp_fc1'] = matrix(4*n_embd, n_embd)
    state_dict[f'layer{i}.mlp_fc2'] = matrix(n_embd, 4*n_embd)

params = [p for mat in state_dict.values()
          for row in mat for p in row]
print(f"num params: {len(params)}")  # 4,192`,
    codeAnnotations: [
      { lines: [1, 2, 3, 4, 5], title: 'Hyperparameters', explanation: 'These define the model\'s capacity. n_embd=16 means each token is represented as a 16-number vector. n_head=4 attention heads each get 4 dimensions (16/4). block_size=16 is the context window — the longest name is 15 characters.' },
      { lines: [7, 8, 9, 10], title: 'Matrix factory', explanation: 'A helper that creates a 2D list of Value objects initialized with small random Gaussian numbers (std=0.08). Small initialization prevents any single parameter from dominating early training.' },
      { lines: [12, 13, 14, 15], title: 'Embedding tables', explanation: 'wte: one 16-dim vector per token (27×16). wpe: one 16-dim vector per position (16×16). lm_head: projects the final hidden state back to 27 logits (27×16). These are lookup tables, not matrix multiplications.' },
      { lines: [16, 17, 18, 19, 20, 21, 22, 23], title: 'Transformer layer weights', explanation: 'Each layer has: 4 attention matrices (Q, K, V projections + output, each 16×16 = 256 params) and 2 MLP matrices (expand to 64 then contract back, 16×64 + 64×16 = 2048 params). With 1 layer, that\'s ~3,328 params for the transformer block.' },
      { lines: [25, 26, 27], title: 'Parameter list', explanation: 'Flattens every matrix into one list so the optimizer can iterate over all 4,192 parameters in a single loop. This is equivalent to PyTorch\'s model.parameters().' },
    ],
  },
  {
    id: 'embeddings',
    phase: 'embeddings',
    group: 'architecture',
    title: 'Embed',
    subtitle: 'IDs → vectors',
    codeStartLine: 103,
    narrative: `The neural network can't process a raw token ID like 5 directly. It can only work with vectors (lists of numbers). So we associate a learned vector with each possible token, and feed that in as its neural signature.

The token ID and position ID each look up a row from their respective embedding tables (wte and wpe). These two vectors are added together, giving the model a representation that encodes both what the token is and where it is in the sequence.

Without position information, "cat sat" and "sat cat" would be identical to the model. Modern LLMs usually skip learned position embeddings and use relative-based schemes like RoPE instead, but the principle is the same.

The embedding dimension (16 here, 12,288 in GPT-4) determines the model's capacity to represent nuance. Everything the model knows about a token at a given position must fit into this single vector.`,
    expandable: {
      title: 'What is RMSNorm?',
      content: 'RMSNorm (Root Mean Square Normalization) rescales a vector so its values have unit root-mean-square. This keeps activations from growing or shrinking as they flow through the network, which stabilizes training. It\'s a simpler variant of the LayerNorm used in the original GPT-2.',
    },
    duration: 5000,
    code: `def rmsnorm(x):
    ms = sum(xi * xi for xi in x) / len(x)
    scale = (ms + 1e-5) ** -0.5
    return [xi * scale for xi in x]

def gpt(token_id, pos_id, keys, values):
    # Look up embeddings (simple table lookup!)
    tok_emb = state_dict['wte'][token_id]  # [16 values]
    pos_emb = state_dict['wpe'][pos_id]    # [16 values]

    # Combine: element-wise addition
    x = [t + p for t, p in zip(tok_emb, pos_emb)]

    # Normalize
    x = rmsnorm(x)

    # ... (attention + MLP layers follow)

# Example: token "e" (id=4) at position 1
# tok_emb = [0.03, -0.07, 0.12, ...] (16 numbers)
# pos_emb = [0.01,  0.05,-0.02, ...] (16 numbers)
# x       = [0.04, -0.02, 0.10, ...] (combined)`,
    codeAnnotations: [
      { lines: [1, 2, 3, 4], title: 'RMSNorm', explanation: 'Normalizes a vector so its root-mean-square is ~1. This prevents activations from growing or shrinking as they flow through layers. The 1e-5 epsilon avoids division by zero. Simpler than LayerNorm (no mean subtraction), and works just as well.' },
      { lines: [6], title: 'GPT function signature', explanation: 'The model processes one token at a time. It takes the token ID, its position, and the running key/value caches. This is the same function used in both training (to compute loss) and inference (to generate text).' },
      { lines: [7, 8, 9], title: 'Embedding lookup', explanation: 'Token embedding: use token_id as an index into wte to get a 16-dim vector. Position embedding: use pos_id as an index into wpe. These are simple array lookups — no math, just indexing. The vectors are learnable parameters.' },
      { lines: [11, 12], title: 'Combine embeddings', explanation: 'Element-wise addition merges token identity and position information into a single vector. Without position embeddings, the model couldn\'t distinguish "ab" from "ba". This combined vector is the token\'s initial representation.' },
      { lines: [14, 15], title: 'Normalize', explanation: 'RMSNorm before the first layer stabilizes the input. This is "pre-norm" style (normalize before attention/MLP), which modern transformers prefer over the original "post-norm" (normalize after).' },
    ],
  },
  {
    id: 'attention',
    phase: 'attention',
    group: 'architecture',
    title: 'Attend',
    subtitle: 'Tokens communicate',
    codeStartLine: 114,
    narrative: `The current token is projected into three vectors: a query (Q), a key (K), and a value (V). Intuitively, the query says "what am I looking for?", the key says "what do I contain?", and the value says "what do I offer if selected?"

For example, in the name "emma", when the model is at the second "m" and trying to predict what comes next, it might learn a query like "what vowels appeared recently?" The earlier "e" would have a key that matches this query well, so it gets a high attention weight, and its value (information about being a vowel) flows into the current position.

Each attention head computes dot products between its query and all cached keys (scaled by √d_head), applies softmax to get attention weights, and takes a weighted sum of the cached values. The outputs of all heads are concatenated and projected through attn_wo.

It's worth emphasizing that the Attention block is the exact and only place where a token at position t gets to "look" at tokens in the past 0..t-1. Attention is a token communication mechanism.

The division by √head_dim prevents the dot products from getting too large, which would make softmax extremely peaked.`,
    expandable: {
      title: 'Why multiple heads?',
      content: 'Each head independently decides what to attend to. One head might track the previous character, another vowel patterns, another repetition. Multi-head attention lets the model attend to different patterns simultaneously. Our model has 4 heads; GPT-4 uses 96+.',
    },
    duration: 6000,
    code: `    for li in range(n_layer):
        # 1) Multi-head Attention block
        x_residual = x
        x = rmsnorm(x)
        q = linear(x, state_dict[f'layer{li}.attn_wq'])
        k = linear(x, state_dict[f'layer{li}.attn_wk'])
        v = linear(x, state_dict[f'layer{li}.attn_wv'])
        keys[li].append(k)
        values[li].append(v)
        x_attn = []
        for h in range(n_head):
            hs = h * head_dim
            q_h = q[hs:hs+head_dim]
            k_h = [ki[hs:hs+head_dim] for ki in keys[li]]
            v_h = [vi[hs:hs+head_dim] for vi in values[li]]
            # Dot-product attention with scaling
            attn_logits = [
                sum(q_h[j] * k_h[t][j]
                    for j in range(head_dim))
                / head_dim**0.5
                for t in range(len(k_h))
            ]
            attn_weights = softmax(attn_logits)
            head_out = [
                sum(attn_weights[t] * v_h[t][j]
                    for t in range(len(v_h)))
                for j in range(head_dim)
            ]
            x_attn.extend(head_out)  # concat heads
        x = linear(x_attn, state_dict[f'layer{li}.attn_wo'])
        x = [a + b for a, b in zip(x, x_residual)]`,
    codeAnnotations: [
      { lines: [1, 2, 3], title: 'Layer loop + residual save', explanation: 'Iterates through transformer layers (just 1 here, 100+ in GPT-4). x_residual saves the input so we can add it back later — this "skip connection" is critical for training deep networks.' },
      { lines: [4, 5, 6, 7], title: 'QKV projections', explanation: 'Three linear projections create Query, Key, and Value vectors. Q asks "what am I looking for?", K advertises "what do I contain?", V holds "what information do I provide if selected?" Each is a matrix multiply: 16→16.' },
      { lines: [8, 9], title: 'KV cache append', explanation: 'Keys and values are stored for all previous positions. This is the KV cache — it lets us process one token at a time without recomputing attention over the whole sequence. At position t, we attend to positions 0..t.' },
      { lines: [10, 11, 12, 13, 14, 15], title: 'Split into heads', explanation: 'The 16-dim vectors are split into 4 heads of 4 dimensions each. Each head independently selects which past tokens to attend to. This lets the model learn multiple attention patterns simultaneously.' },
      { lines: [16, 17, 18, 19, 20, 21], title: 'Attention scores', explanation: 'Dot product between query and each cached key, divided by √head_dim (=2). The scaling prevents large dot products from making softmax too peaked. Higher score = this past token is more relevant to the current query.' },
      { lines: [22], title: 'Softmax → weights', explanation: 'Converts raw scores to a probability distribution over past tokens. The attention weights always sum to 1.0. Softmax is shift-invariant (subtracting max for numerical stability happens inside our softmax function).' },
      { lines: [23, 24, 25, 26, 27], title: 'Weighted value sum', explanation: 'Each head\'s output is a weighted average of all past value vectors, using the attention weights. Tokens that matched the query strongly contribute more. This is how information flows between positions.' },
      { lines: [28, 29], title: 'Concat + project + residual', explanation: 'Head outputs (4 heads × 4 dims = 16) are concatenated and projected through attn_wo. The result is added back to x_residual — this residual connection lets gradients flow directly and makes training stable.' },
    ],
  },
  {
    id: 'mlp',
    phase: 'mlp',
    group: 'architecture',
    title: 'Transform',
    subtitle: 'MLP computation',
    codeStartLine: 94,
    narrative: `MLP is short for "multilayer perceptron" — a two-layer feed-forward network: project up to 4× the embedding dimension, apply ReLU, project back down. This is where the model does most of its "thinking" per position.

Unlike attention, this computation is fully local to the current time step. The Transformer intersperses communication (Attention) with computation (MLP).

The expand-then-contract pattern (4× expansion is standard) creates a wider intermediate space where the network can compute more complex functions. ReLU zeroes out negatives, creating sparse activation patterns. Without this nonlinearity, stacking linear layers would collapse into one big linear transformation — no learning power.

Residual connections (x = [a + b for ...]) appear after both the attention and MLP blocks. Both blocks add their output back to their input. This lets gradients flow directly through the network and makes deeper models trainable.

The final hidden state is projected to vocabulary size by lm_head, producing one logit per token. Higher logit = the model thinks that corresponding token is more likely to come next.`,
    expandable: {
      title: 'Why residual connections matter',
      content: 'Without residual connections, gradients vanish in deep networks and training fails. The "shortcut" path lets gradients flow directly backward, like an express lane. This is why transformers can be stacked 100+ layers deep when earlier architectures couldn\'t.',
    },
    duration: 5000,
    code: `def linear(x, w):
    return [sum(wi * xi for wi, xi in zip(wo, x))
            for wo in w]

def softmax(logits):
    max_val = max(val.data for val in logits)
    exps = [(val - max_val).exp() for val in logits]
    total = sum(exps)
    return [e / total for e in exps]

        # 2) MLP block
        x_residual = x
        x = rmsnorm(x)
        # Expand: 16 → 64 (4x wider)
        x = linear(x, state_dict[f'layer{li}.mlp_fc1'])
        # Nonlinearity: ReLU kills negatives
        x = [xi.relu() for xi in x]
        # Contract: 64 → 16
        x = linear(x, state_dict[f'layer{li}.mlp_fc2'])
        # Residual connection
        x = [a + b for a, b in zip(x, x_residual)]

    # Output: project to vocabulary logits
    logits = linear(x, state_dict['lm_head'])
    return logits  # 27 numbers, one per token`,
    codeAnnotations: [
      { lines: [1, 2, 3], title: 'Linear projection', explanation: 'Matrix-vector multiply: each output is a dot product of one weight row with the input. This is the fundamental building block — attention projections, MLP layers, and the final output all use this same operation.' },
      { lines: [5, 6, 7, 8, 9], title: 'Softmax', explanation: 'Converts raw logits to probabilities that sum to 1. Subtracting max_val prevents numerical overflow in exp() without changing the result (softmax is shift-invariant). Used for both attention weights and output probabilities.' },
      { lines: [11, 12, 13], title: 'MLP: save residual + normalize', explanation: 'Same pattern as attention: save input for the skip connection, then normalize. Pre-norm ensures the MLP sees well-scaled inputs regardless of what attention did.' },
      { lines: [14, 15], title: 'MLP: expand (16→64)', explanation: 'Projects to 4× the embedding dimension, creating a wider space for computation. This expansion ratio (4×) is a standard transformer design choice, used in GPT-2 through GPT-4.' },
      { lines: [16, 17], title: 'MLP: ReLU activation', explanation: 'Zeroes out negative values, creating sparsity. Without this nonlinearity, the expand-then-contract would be equivalent to a single linear layer. ReLU is what gives the network its ability to learn complex, nonlinear patterns.' },
      { lines: [18, 19], title: 'MLP: contract (64→16)', explanation: 'Projects back to the embedding dimension. The expand→nonlinearity→contract pattern lets the model compute arbitrary nonlinear functions of each token\'s representation.' },
      { lines: [20, 21], title: 'Residual connection', explanation: 'Adds the MLP output back to the input (saved on line 12). Both attention and MLP blocks use this pattern. It ensures information can flow through the network even if a block learns nothing useful.' },
      { lines: [23, 24, 25], title: 'Output projection', explanation: 'The final linear layer maps the 16-dim hidden state to 27 logits (one per token in the vocabulary). Higher logit = the model thinks that token is more likely to come next. These logits become probabilities via softmax.' },
    ],
  },
  {
    id: 'training',
    phase: 'training',
    group: 'training',
    title: 'Train',
    subtitle: 'Predict → loss → backprop → update',
    codeStartLine: 152,
    narrative: `The training loop repeatedly: (1) picks a document, (2) runs the model forward over its tokens, (3) computes a loss, (4) backpropagates to get gradients, and (5) updates the parameters.

We feed tokens through the model one at a time, building up the KV cache. At each position, the model outputs 27 logits, which we convert to probabilities via softmax. The loss at each position is the negative log probability of the correct next token: −log p(target). This is called the cross-entropy loss.

Intuitively, the loss measures surprise: how shocked the model is by what actually comes next. If the model assigns probability 1.0 to the correct token, loss is 0 (not surprised). If it assigns probability close to 0, loss goes to +∞ (very surprised). We average across the document to get a single scalar loss.

One call to loss.backward() runs backpropagation through the entire computation graph. After this, each parameter's .grad tells us how to change it to reduce the loss.

Over 1,000 steps the loss decreases from ~3.3 (random guessing among 27 tokens: −log(1/27) ≈ 3.3) down to ~2.37. The knowledge of the statistical patterns is distilled into the parameters.`,
    expandable: {
      title: 'What about the KV cache during training?',
      content: 'We\'re using a KV cache during training, which is unusual. People typically associate it with inference only. But the KV cache is conceptually always there — in production implementations, it\'s just hidden inside the highly vectorized attention computation. Since microgpt processes one token at a time, we build it explicitly. Unlike typical inference, here the cached keys and values are live Value nodes, so we actually backpropagate through them.',
    },
    duration: 6000,
    code: `num_steps = 1000
for step in range(num_steps):
    # 1. Pick a document and tokenize
    doc = docs[step % len(docs)]
    tokens = [BOS] + [uchars.index(ch) for ch in doc] + [BOS]
    n = min(block_size, len(tokens) - 1)

    # 2. Forward pass: predict each next token
    keys = [[] for _ in range(n_layer)]
    values = [[] for _ in range(n_layer)]
    losses = []
    for pos_id in range(n):
        token_id = tokens[pos_id]
        target_id = tokens[pos_id + 1]  # what comes next
        logits = gpt(token_id, pos_id, keys, values)
        probs = softmax(logits)
        loss_t = -probs[target_id].log()  # cross-entropy
        losses.append(loss_t)
    # Average loss. May yours be low.
    loss = (1/n) * sum(losses)

    # 3. Backward pass: compute all gradients
    loss.backward()

    # 4. Adam optimizer: update parameters
    lr_t = learning_rate * (1 - step / num_steps)
    for i, p in enumerate(params):
        m[i] = beta1*m[i] + (1-beta1)*p.grad
        v[i] = beta2*v[i] + (1-beta2)*p.grad**2
        m_hat = m[i] / (1 - beta1**(step+1))
        v_hat = v[i] / (1 - beta2**(step+1))
        p.data -= lr_t * m_hat / (v_hat**0.5 + eps)
        p.grad = 0  # reset for next step`,
    codeAnnotations: [
      { lines: [1, 2, 3, 4], title: 'Training loop', explanation: 'Iterates 1,000 times. Each step picks one document (cycling through the dataset), tokenizes it with BOS delimiters, and clips to block_size. In production, you\'d use batches of many documents for efficiency.' },
      { lines: [6, 7, 8], title: 'Initialize caches', explanation: 'Fresh KV caches for each document. keys and values are lists-of-lists: one per layer, each growing as we process tokens. losses collects per-position loss values for averaging.' },
      { lines: [9, 10, 11], title: 'Token-by-token forward', explanation: 'Process tokens sequentially. At each position, token_id is the input and target_id is what should come next. The model sees positions 0..t and must predict position t+1. This is causal (left-to-right) language modeling.' },
      { lines: [12, 13, 14], title: 'Loss computation', explanation: 'The model outputs logits → softmax gives probabilities → take -log of the probability assigned to the correct next token. This cross-entropy loss measures surprise: -log(1.0) = 0 (not surprised), -log(0.01) = 4.6 (very surprised).' },
      { lines: [16, 17], title: 'Average loss', explanation: 'Sum per-position losses and divide by sequence length. This gives a single scalar that measures how well the model predicted this entire document. "May yours be low" — Karpathy\'s benediction.' },
      { lines: [19, 20], title: 'Backpropagation', explanation: 'One call walks the entire computation graph backward, computing ∂loss/∂p for every parameter. This is where the autograd engine from step 2 does its work. After this, every param.grad tells us how to reduce the loss.' },
      { lines: [22, 23, 24, 25, 26, 27, 28, 29, 30], title: 'Adam optimizer update', explanation: 'For each parameter: update momentum (m) and adaptive rate (v), apply bias correction, then nudge p.data in the direction that reduces loss. Learning rate decays linearly so early steps explore broadly and late steps refine.' },
    ],
  },
  {
    id: 'optimizer',
    phase: 'optimizer',
    group: 'training',
    title: 'Update',
    subtitle: 'Adjust parameters (Adam)',
    codeStartLine: 146,
    narrative: `We could just do p.data -= lr * p.grad (gradient descent), but Adam is smarter. It maintains two running averages per parameter:

• m tracks the mean of recent gradients (momentum, like a rolling ball — helps push through flat regions)
• v tracks the mean of recent squared gradients (adapting the learning rate per parameter — parameters with consistently large gradients get smaller effective learning rates)

The m_hat and v_hat are bias corrections that account for the fact that m and v are initialized to zero and need warmup. The learning rate decays linearly over training: large steps early (explore), small steps late (refine). After updating, we reset .grad = 0 for the next step.

Adam is used in virtually all modern LLM training because it converges faster and more reliably than basic SGD. At scale, optimization becomes its own discipline — teams run extensive smaller-scale experiments to predict the right settings before committing to a full training run, because getting any detail wrong can waste millions of dollars of compute.`,
    expandable: {
      title: 'What changes at scale?',
      content: 'At scale, models train in reduced precision (bfloat16 or fp8) across large GPU clusters. Optimizer settings (learning rate, weight decay, beta parameters, warmup, decay schedule) must be tuned precisely — the right values depend on model size, batch size, and dataset composition. Scaling laws (e.g. Chinchilla) guide how to allocate a fixed compute budget between model size and number of training tokens.',
    },
    duration: 5000,
    code: `# Let there be Adam, the blessed optimizer
learning_rate = 0.01
beta1, beta2, eps = 0.85, 0.99, 1e-8
m = [0.0] * len(params)  # momentum (1st moment)
v = [0.0] * len(params)  # adaptive rate (2nd moment)

# Linear learning rate decay
lr_t = learning_rate * (1 - step / num_steps)

for i, p in enumerate(params):
    # Momentum: exponential moving avg of gradients
    m[i] = beta1 * m[i] + (1 - beta1) * p.grad

    # Adaptive rate: EMA of squared gradients
    v[i] = beta2 * v[i] + (1 - beta2) * p.grad**2

    # Bias correction (warmup)
    m_hat = m[i] / (1 - beta1**(step + 1))
    v_hat = v[i] / (1 - beta2**(step + 1))

    # THE UPDATE
    p.data -= lr_t * m_hat / (v_hat**0.5 + eps)
    p.grad = 0  # reset for next step

# Loss curve: 3.3 → 2.37 over 1000 steps`,
    codeAnnotations: [
      { lines: [1, 2, 3, 4, 5], title: 'Adam initialization', explanation: 'Learning rate 0.01, relatively high for this small model. beta1=0.85 controls momentum decay (how much to remember past gradients). beta2=0.99 controls adaptive rate decay. m and v are per-parameter running averages, initialized to zero.' },
      { lines: [7, 8], title: 'Learning rate decay', explanation: 'Linear decay from 0.01 to 0 over training. Large steps early to explore the loss landscape broadly, small steps late to fine-tune. Most production systems use cosine decay instead, but linear works fine here.' },
      { lines: [10, 11, 12], title: 'Momentum update', explanation: 'Exponential moving average of gradients. Like a rolling ball: if gradients consistently point the same direction, momentum builds up and pushes through flat regions or noise. beta1=0.85 means ~85% old momentum + 15% new gradient.' },
      { lines: [14, 15], title: 'Adaptive rate', explanation: 'EMA of squared gradients tracks the typical magnitude of each parameter\'s gradient. Parameters with large, volatile gradients get effectively smaller learning rates. This per-parameter adaptation is what makes Adam better than basic SGD.' },
      { lines: [17, 18, 19], title: 'Bias correction', explanation: 'Since m and v start at 0, early estimates are biased toward 0. Dividing by (1 - beta^step) corrects this. The correction is large for early steps and approaches 1.0 as training progresses. Without it, early updates would be too small.' },
      { lines: [21, 22, 23], title: 'The parameter update', explanation: 'The actual weight change: step size is lr × (momentum / √adaptive_rate). The eps (1e-8) prevents division by zero. After updating, grad is reset to 0 for the next training step\'s backward pass.' },
    ],
  },
  {
    id: 'inference',
    phase: 'inference',
    group: 'using',
    title: 'Predict',
    subtitle: 'Generate new text',
    codeStartLine: 187,
    narrative: `Once training is done, we can sample new names from the model. The parameters are frozen and we just run the forward pass in a loop, feeding each generated token back as the next input.

We start each sample with BOS, which tells the model "begin a new name." The model produces 27 logits, we convert them to probabilities, and we randomly sample one token. That token gets fed back in as the next input, and we repeat until the model produces BOS again ("I'm done") or we hit the maximum sequence length.

The temperature parameter controls randomness. Before softmax, we divide the logits by the temperature. A temperature of 1.0 samples directly from the model's learned distribution. Lower temperatures (like 0.5 here) sharpen the distribution, making the model more conservative. A temperature approaching 0 always picks the single most likely token (greedy decoding). Higher temperatures flatten the distribution — more diverse but potentially less coherent.

The generated names (kamon, karai, vialan, alerin...) don't exist in the training data — they are statistical hallucinations that sound plausible given the patterns the model learned.`,
    expandable: {
      title: 'How does this relate to ChatGPT?',
      content: 'ChatGPT is this same core loop (predict next token, sample, repeat) scaled up enormously, with post-training to make it conversational. When you chat with it, the system prompt, your message, and its reply are all just tokens in a sequence. The model is completing the document one token at a time, same as microgpt completing a name.',
    },
    duration: 5000,
    code: `temperature = 0.5  # creativity dial

for sample_idx in range(20):
    keys = [[] for _ in range(n_layer)]
    values = [[] for _ in range(n_layer)]
    token_id = BOS       # start with BOS
    sample = []

    for pos_id in range(block_size):
        # Same forward pass as training, no loss
        logits = gpt(token_id, pos_id, keys, values)

        # Scale by temperature, then softmax
        probs = softmax([l / temperature for l in logits])

        # Sample from distribution
        token_id = random.choices(
            range(vocab_size),
            weights=[p.data for p in probs]
        )[0]

        if token_id == BOS: break  # end of name
        sample.append(uchars[token_id])

    print(f"{''.join(sample)}")
# Output: kamon, ann, karai, jaire, vialan,
#   karia, yeran, anna, areli, kaina, ...`,
    codeAnnotations: [
      { lines: [1], title: 'Temperature', explanation: 'Controls randomness in generation. Temperature < 1 sharpens the distribution (more conservative, predictable names). Temperature > 1 flattens it (more creative, potentially weird). Temperature → 0 becomes greedy (always pick the most likely token).' },
      { lines: [3, 4, 5, 6, 7], title: 'Sample loop setup', explanation: 'Generate 20 names. Each starts fresh with empty KV caches and the BOS token. The sample list accumulates generated characters. This autoregressive loop is the exact same process ChatGPT uses to generate responses.' },
      { lines: [9, 10, 11], title: 'Forward pass', explanation: 'Same gpt() function as training, but no loss computation. The model sees all tokens generated so far (via KV cache) and outputs 27 logits predicting what comes next.' },
      { lines: [13, 14], title: 'Temperature scaling', explanation: 'Divide logits by temperature BEFORE softmax. With temp=0.5, a logit of 2.0 becomes 4.0 — softmax amplifies the difference, making high-probability tokens even more likely. This is the "creativity dial."' },
      { lines: [16, 17, 18, 19, 20], title: 'Sampling', explanation: 'random.choices picks one token weighted by the probability distribution. Unlike argmax (greedy), this introduces controlled randomness — the model usually picks likely tokens but occasionally surprises, making output more natural and varied.' },
      { lines: [22, 23], title: 'Stop condition', explanation: 'If the model generates BOS, it\'s signaling "this name is done." We break out of the generation loop. Otherwise, we convert the token ID back to a character and append it.' },
      { lines: [25, 26, 27], title: 'Output', explanation: 'The generated names (kamon, karai, vialan...) don\'t exist in the training data. They are "hallucinations" — statistically plausible outputs that the model invented by learning character patterns from 32K real names.' },
    ],
  },
  {
    id: 'scaling',
    phase: 'scaling',
    group: 'using',
    title: 'The Complete Picture',
    subtitle: 'Everything else is just efficiency',
    codeStartLine: 152,
    narrative: `microgpt contains the complete algorithmic essence of training and running a GPT. But between this and a production LLM like ChatGPT, there is a long list of things that change. None of them alter the core algorithm, but they are what makes it work at scale.

Data: trillions of tokens of internet text instead of 32K names. Tokenizer: BPE with ~100K vocabulary instead of 27 characters. Autograd: tensors on GPUs instead of scalar Python. Architecture: hundreds of billions of parameters, 100+ layers, with additions like RoPE, GQA, and Mixture of Experts — but the core structure of Attention (communication) and MLP (computation) on a residual stream is preserved.

Post-training turns the document completer into a chatbot: first SFT (supervised fine-tuning on curated conversations), then RL (reinforcement learning from human/model feedback). Algorithmically, the model is still training on documents — but those documents now include tokens from the model itself.

The model doesn't learn explicit rules — it learns a probability distribution that happens to reflect statistical regularities. microgpt "hallucinating" a name like "karia" is the same phenomenon as ChatGPT confidently stating a false fact. Both are plausible-sounding completions that happen not to be real.

If you understand microgpt, you understand the algorithmic essence.`,
    expandable: {
      title: 'What next? Run it, extend it, understand it',
      content: 'All you need is Python (no pip install, no dependencies). The script takes about 1 minute on a MacBook. You can also run it in Google Colab. To see the code built up piece by piece, Karpathy provides a progression: train0.py (bigram count table, no neural net), train1.py (MLP + manual gradients), train2.py (autograd replaces manual gradients), train3.py (position embeddings + single-head attention), train4.py (multi-head attention + full GPT). Each file adds one conceptual layer. And the question "does it understand anything?" — mechanically, the model is a big math function that maps input tokens to a probability distribution. Whether that constitutes understanding is up to you, but the mechanism is fully contained in the 200 lines above.',
    },
    duration: 6000,
    code: `# The ENTIRE training loop:
for step in range(1000):
    doc = docs[step % len(docs)]             # 1. Pick data
    tokens = [BOS] + tokenize(doc) + [BOS]   # 2. Tokenize

    for pos_id in range(n):
        logits = gpt(token_id, pos_id, ...)  # 3. Forward
        probs = softmax(logits)
        loss_t = -probs[target].log()        # 4. Loss

    loss.backward()                          # 5. Backward

    for p in params:
        p.data -= lr * adam_update(p.grad)   # 6. Update
        p.grad = 0

# That's it. Repeat 1000× → trained LLM.
# Everything else is just efficiency.
#
# microgpt.py: 4,192 params, 27 tokens, 1 layer
# GPT-4:       1T+ params, 200K tokens, 120+ layers
# Same algorithm. Different scale.`,
    codeAnnotations: [
      { lines: [1, 2, 3], title: 'Pick data + tokenize', explanation: 'The two-step data pipeline: select a document, convert to token IDs with BOS delimiters. This is the same for a 200-line script and a trillion-parameter model — only the data source and tokenizer complexity differ.' },
      { lines: [5, 6, 7, 8], title: 'Forward pass', explanation: 'Feed tokens through the model one by one, get logits, compute loss. The gpt() function encapsulates embeddings → attention → MLP → output projection. Each position predicts the next token independently (given its context).' },
      { lines: [10], title: 'Backward pass', explanation: 'One call computes gradients for all ~4,192 parameters. The autograd engine traces backward through every addition, multiplication, softmax, attention weight, and embedding lookup that happened during the forward pass.' },
      { lines: [12, 13, 14], title: 'Parameter update', explanation: 'Adam adjusts each parameter to reduce the loss, then resets gradients. After 1,000 iterations of this loop, the random initial parameters have been shaped into a model that captures the statistical patterns of English names.' },
      { lines: [16, 17, 18, 19, 20], title: 'The punchline', explanation: 'microgpt and GPT-4 run the same algorithm. The differences are engineering: bigger tensors, more layers, better tokenizers, GPU parallelism, RLHF. But the core loop — forward, loss, backward, update — is exactly what you see here in 200 lines.' },
    ],
  },
]

export const scaleComparison = [
  { dim: 'Parameters', micro: '4,192', prod: '100B – 1T+' },
  { dim: 'Layers', micro: '1', prod: '80 – 120+' },
  { dim: 'Embedding dim', micro: '16', prod: '8,192 – 12,288' },
  { dim: 'Context window', micro: '16 tokens', prod: '128K – 1M+' },
  { dim: 'Vocabulary', micro: '27 chars', prod: '100K – 200K tokens' },
  { dim: 'Training data', micro: '32K names', prod: 'Trillions of tokens' },
  { dim: 'Compute', micro: 'Python scalars', prod: 'Thousands of GPUs' },
  { dim: 'Tokenizer', micro: 'Character-level', prod: 'BPE / SentencePiece' },
  { dim: 'Post-training', micro: 'None', prod: 'SFT + RLHF' },
]
