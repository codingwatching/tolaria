import { splitFrontmatter } from '@tolaria/markdown'

export type MobileEditorBlock = {
  id: string
  kind: 'bullet' | 'paragraph'
  text: string
}

export type MobileEditorDocument = {
  title: string
  blocks: MobileEditorBlock[]
}

export type MobileEditorDocumentInput = {
  title: string
  content: string
}

export function createMobileEditorDocument(input: MobileEditorDocumentInput): MobileEditorDocument {
  const [, body] = splitFrontmatter(input.content)

  return {
    title: input.title,
    blocks: createBlocks(body, input.title),
  }
}

export function createMobileEditorHtml(document: MobileEditorDocument) {
  return `<h1>${escapeHtml(document.title)}</h1>${document.blocks.map(blockToHtml).join('')}`
}

function createBlocks(body: string, title: string) {
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !isTitleHeading(line, title))
    .map(createBlock)
}

function createBlock(line: string, index: number): MobileEditorBlock {
  const bulletText = bulletContent(line)

  return {
    id: `${index}:${line}`,
    kind: bulletText ? 'bullet' : 'paragraph',
    text: bulletText ?? line,
  }
}

function bulletContent(line: string) {
  const match = /^[-*]\s+(.+)$/.exec(line)
  return match?.[1] ?? null
}

function isTitleHeading(line: string, title: string) {
  return line === `# ${title}`
}

function blockToHtml(block: MobileEditorBlock) {
  const text = escapeHtml(block.text)
  return block.kind === 'bullet' ? `<ul><li>${text}</li></ul>` : `<p>${text}</p>`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
