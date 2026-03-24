/**
 * Generates llms.txt and llms-full.txt from the app's data modules.
 * Run with: bun scripts/generate-llms-txt.ts
 */
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { steps, stepGroups, scaleComparison, BLOG_URL, GIST_URL, COLAB_URL } from '../src/data/steps'
import { glossary, glossaryCategories } from '../src/data/glossary'

const SITE_URL = 'https://howllmswork-4fw.pages.dev'
const outDir = resolve(import.meta.dir, '../public')

// ── llms.txt (summary) ──

const summary = `# How LLMs Work — Interactive Walkthrough

> An interactive walkthrough of Karpathy's microgpt: a complete GPT implementation in 200 lines of pure Python, with no dependencies.
> ${SITE_URL}

## What this is

This site teaches how large language models work from the ground up, by walking through every line of microgpt.py — a 200-line Python script that trains a character-level GPT on 32,033 baby names and generates new ones. The same algorithm powers ChatGPT, just at a different scale.

## Source material

- Blog post: ${BLOG_URL}
- Code (gist): ${GIST_URL}
- Google Colab: ${COLAB_URL}

## Walkthrough Steps

${stepGroups.map(g => {
  const groupSteps = steps.filter(s => s.group === g.id)
  return `### ${g.label}\n${groupSteps.map((s, i) => {
    const globalIdx = steps.indexOf(s) + 1
    return `${globalIdx}. **${s.title}** — ${s.subtitle}`
  }).join('\n')}`
}).join('\n\n')}

## Glossary (${glossary.length} terms)

${glossaryCategories.map(c => {
  const terms = glossary.filter(g => g.category === c.id)
  return `- **${c.label}** (${terms.length} terms): ${terms.map(t => t.term).join(', ')}`
}).join('\n')}

## Scale Comparison: microgpt vs Production LLMs

| Dimension | microgpt | Production |
|-----------|----------|------------|
${scaleComparison.map(r => `| ${r.dim} | ${r.micro} | ${r.prod} |`).join('\n')}

## Full content

For the complete narratives, code annotations, and glossary definitions, see:
${SITE_URL}/llms-full.txt
`

// ── llms-full.txt (complete dump) ──

const full = `# How LLMs Work — Complete Walkthrough Content

> Source: ${SITE_URL}
> Based on Karpathy's microgpt — a complete GPT in 200 lines of Python
> Blog: ${BLOG_URL}
> Gist: ${GIST_URL}
> Colab: ${COLAB_URL}

This document contains the full text content of the interactive walkthrough at ${SITE_URL}. It is structured for LLM consumption following the llms.txt convention. Each step includes pedagogical narrative, code from microgpt.py with line numbers, and line-by-line code annotations. A complete glossary follows the walkthrough.

---

# Walkthrough

${steps.map((s, idx) => {
  const startLine = s.codeStartLine ?? 1
  const codeLines = s.code.split('\n')
  const endLine = startLine + codeLines.length - 1

  let section = `## Step ${idx + 1}: ${s.title}\n*${s.subtitle}*\n\n### Narrative\n\n${s.narrative}\n`

  if (s.expandable) {
    section += `\n### ${s.expandable.title}\n\n${s.expandable.content}\n`
  }

  section += `\n### Code (microgpt.py lines ${startLine}–${endLine})\n\n\`\`\`python\n${codeLines.map((line, i) => `${String(startLine + i).padStart(3)} ${line}`).join('\n')}\n\`\`\`\n`

  if (s.codeAnnotations && s.codeAnnotations.length > 0) {
    section += `\n### Code Annotations\n\n${s.codeAnnotations.map(a => {
      const annLines = a.lines.map(l => l + startLine - 1)
      const lineRange = annLines.length === 1 ? `line ${annLines[0]}` : `lines ${annLines[0]}–${annLines[annLines.length - 1]}`
      return `- **${a.title}** (${lineRange}): ${a.explanation}`
    }).join('\n')}\n`
  }

  return section
}).join('\n---\n\n')}

---

# Glossary

${glossaryCategories.map(c => {
  const terms = glossary.filter(g => g.category === c.id)
  return `## ${c.label}\n*${c.description}*\n\n${terms.map(t => {
    let entry = `#### ${t.term}\n\n${t.definition}\n`
    const relatedStepNames = t.relatedSteps
      .map(id => steps.find(s => s.id === id))
      .filter(Boolean)
      .map(s => s!.title)
    if (relatedStepNames.length > 0) {
      entry += `\nRelated steps: ${relatedStepNames.join(', ')}`
    }
    if (t.seeAlso && t.seeAlso.length > 0) {
      const seeAlsoNames = t.seeAlso
        .map(id => glossary.find(g => g.id === id))
        .filter(Boolean)
        .map(g => g!.term)
      entry += `\nSee also: ${seeAlsoNames.join(', ')}`
    }
    return entry
  }).join('\n\n')}`
}).join('\n\n---\n\n')}

---

# Scale Comparison: microgpt vs Production LLMs

| Dimension | microgpt | Production |
|-----------|----------|------------|
${scaleComparison.map(r => `| ${r.dim} | ${r.micro} | ${r.prod} |`).join('\n')}
`

writeFileSync(resolve(outDir, 'llms.txt'), summary)
writeFileSync(resolve(outDir, 'llms-full.txt'), full)

console.log(`Generated llms.txt (${(summary.length / 1024).toFixed(1)} KB)`)
console.log(`Generated llms-full.txt (${(full.length / 1024).toFixed(1)} KB)`)
