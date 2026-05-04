import { splitFrontmatter } from '@tolaria/markdown'
import type { MobileEditorDocumentInput } from './mobileEditorDocument'

export type MobileEditorDraft =
  | {
      noteId: string
      sourceMarkdown: string
      editorHtml: string
      persistable: true
      canonicalMarkdown: string
    }
  | {
      noteId: string
      sourceMarkdown: string
      editorHtml: string
      persistable: false
      blockedReason: 'unsupportedEditorHtml'
    }

export function createMobileEditorDraft({
  editorHtml,
  note,
}: {
  editorHtml: string
  note: MobileEditorDocumentInput
}): MobileEditorDraft {
  const markdownBody = serializeSupportedHtml(editorHtml)
  if (!markdownBody) {
    return createBlockedDraft({ editorHtml, note })
  }

  return {
    noteId: note.id,
    sourceMarkdown: note.content,
    editorHtml,
    persistable: true,
    canonicalMarkdown: withFrontmatter({ markdownBody, sourceMarkdown: note.content }),
  }
}

function createBlockedDraft({
  editorHtml,
  note,
}: {
  editorHtml: string
  note: MobileEditorDocumentInput
}): MobileEditorDraft {
  return {
    noteId: note.id,
    sourceMarkdown: note.content,
    editorHtml,
    persistable: false,
    blockedReason: 'unsupportedEditorHtml',
  }
}

function withFrontmatter({
  markdownBody,
  sourceMarkdown,
}: {
  markdownBody: string
  sourceMarkdown: string
}) {
  const [frontmatter] = splitFrontmatter(sourceMarkdown)
  return frontmatter ? `${frontmatter}${markdownBody}` : markdownBody
}

function serializeSupportedHtml(editorHtml: string) {
  const blocks = editorHtml.match(/<(h1|p|ul)(?:\s[^>]*)?>[\s\S]*?<\/\1>/gi)
  if (!blocks || blocks.join('') !== editorHtml.trim()) {
    return null
  }

  return blocks?.map(serializeBlock).join('\n\n') ?? null
}

function serializeBlock(block: string) {
  if (block.match(/^<h1/i)) {
    return `# ${textContent(block)}`
  }

  if (block.match(/^<ul/i)) {
    return listItemText(block).map((text) => `- ${text}`).join('\n')
  }

  return textContent(block)
}

function listItemText(block: string) {
  return [...block.matchAll(/<li(?:\s[^>]*)?>([\s\S]*?)<\/li>/gi)].map((match) => textContent(match[1]))
}

function textContent(value: string) {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, '').trim())
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}
