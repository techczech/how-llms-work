export interface Step {
  id: string
  phase: string
  title: string
  subtitle: string
  narrative: string
  expandable?: { title: string; content: string }
  duration: number
  code: string
}

export const BLOG_URL = 'https://karpathy.github.io/2026/02/12/microgpt/'
export const GIST_URL = 'https://gist.github.com/karpathy/8627fe009c40f57531cb18360106ce95'

export const steps: Step[] = [
  {
    id: 'overview',
    phase: 'overview',
    title: 'The Complete Algorithm',
    subtitle: 'microgpt.py — 200 lines, zero dependencies, one GPT',
    narrative: `This is Karpathy's microgpt — a single file of 200 lines of pure Python with no dependencies that trains and runs a GPT. It contains the full algorithmic content: dataset, tokenizer, autograd engine, a GPT-2-like neural network, the Adam optimizer, training loop, and inference loop.

"Everything else is just efficiency."

The script is the culmination of multiple projects (micrograd, makemore, nanogpt) and a decade-long obsession to simplify LLMs to their bare essentials. The goal: learn the patterns in a dataset of 32,000 names, then generate ("hallucinate") plausible new ones.

From the perspective of a model like ChatGPT, your conversation with it is just a funny looking "document". When you initialize it with your prompt, the model's response is just a statistical document completion.`,
    expandable: {
      title: 'What is microgpt.py?',
      content: 'A 200-line, dependency-free Python file that trains and runs a GPT from scratch. No PyTorch, no TensorFlow — just math, random, and the complete algorithm that powers every modern LLM. Available as a GitHub Gist and Google Colab notebook.',
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

# Dataset: 32,000 names
docs = [line.strip() for line in open('input.txt')
        if line.strip()]
random.shuffle(docs)
print(f"num docs: {len(docs)}")`,
  },
  {
    id: 'tokenizer',
    phase: 'tokenizer',
    title: 'Tokenizer',
    subtitle: 'Text → Numbers',
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
  },
  {
    id: 'autograd',
    phase: 'autograd',
    title: 'Autograd',
    subtitle: 'The engine of learning',
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
  },
  {
    id: 'parameters',
    phase: 'parameters',
    title: 'Parameters',
    subtitle: 'The model\'s knowledge',
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
  },
  {
    id: 'embeddings',
    phase: 'embeddings',
    title: 'Embeddings',
    subtitle: 'Giving tokens meaning',
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
  },
  {
    id: 'attention',
    phase: 'attention',
    title: 'Attention',
    subtitle: 'How tokens talk to each other',
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
  },
  {
    id: 'mlp',
    phase: 'mlp',
    title: 'MLP',
    subtitle: 'Processing the information',
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
  },
  {
    id: 'training',
    phase: 'training',
    title: 'Training Loop',
    subtitle: 'Forward → Loss → Backward → Update',
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
  },
  {
    id: 'optimizer',
    phase: 'optimizer',
    title: 'Adam Optimizer',
    subtitle: 'Smarter than gradient descent',
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
  },
  {
    id: 'inference',
    phase: 'inference',
    title: 'Inference',
    subtitle: 'Generating new text',
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
  },
  {
    id: 'scaling',
    phase: 'scaling',
    title: 'The Complete Picture',
    subtitle: 'Everything else is just efficiency',
    narrative: `microgpt contains the complete algorithmic essence of training and running a GPT. But between this and a production LLM like ChatGPT, there is a long list of things that change. None of them alter the core algorithm, but they are what makes it work at scale.

Data: trillions of tokens of internet text instead of 32K names. Tokenizer: BPE with ~100K vocabulary instead of 27 characters. Autograd: tensors on GPUs instead of scalar Python. Architecture: hundreds of billions of parameters, 100+ layers, with additions like RoPE, GQA, and Mixture of Experts — but the core structure of Attention (communication) and MLP (computation) on a residual stream is preserved.

Post-training turns the document completer into a chatbot: first SFT (supervised fine-tuning on curated conversations), then RL (reinforcement learning from human/model feedback). Algorithmically, the model is still training on documents — but those documents now include tokens from the model itself.

The model doesn't learn explicit rules — it learns a probability distribution that happens to reflect statistical regularities. microgpt "hallucinating" a name like "karia" is the same phenomenon as ChatGPT confidently stating a false fact. Both are plausible-sounding completions that happen not to be real.

If you understand microgpt, you understand the algorithmic essence.`,
    expandable: {
      title: 'FAQ: Does it "understand" anything?',
      content: 'Mechanically: no magic is happening. The model is a big math function that maps input tokens to a probability distribution over the next token. During training, parameters are adjusted to make the correct next token more probable. Whether this constitutes "understanding" is up to you, but the mechanism is fully contained in the 200 lines above.',
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
