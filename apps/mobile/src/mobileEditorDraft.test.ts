import { describe, expect, it } from 'vitest'
import { createMobileEditorDraft } from './mobileEditorDraft'

describe('mobile editor draft', () => {
  it('serializes supported TenTap HTML into canonical Markdown', () => {
    expect(
      createMobileEditorDraft({
        note: {
          id: 'workflow',
          title: 'Workflow',
          content: '# Workflow\n\nOriginal markdown',
        },
        editorHtml: '<h1>Workflow</h1><p>Edited content</p><ul><li>First</li><li>Second</li></ul>',
      }),
    ).toEqual({
      noteId: 'workflow',
      sourceMarkdown: '# Workflow\n\nOriginal markdown',
      editorHtml: '<h1>Workflow</h1><p>Edited content</p><ul><li>First</li><li>Second</li></ul>',
      persistable: true,
      canonicalMarkdown: '# Workflow\n\nEdited content\n\n- First\n- Second',
    })
  })

  it('preserves source frontmatter outside the edited body', () => {
    const draft = createMobileEditorDraft({
      note: {
        id: 'workflow',
        title: 'Workflow',
        content: '---\ntype: Essay\n---\n\n# Workflow\n\nOriginal markdown',
      },
      editorHtml: '<h1>Workflow</h1><p>Edited content</p>',
    })

    expect(draft).toMatchObject({
      persistable: true,
      canonicalMarkdown: '---\ntype: Essay\n---\n# Workflow\n\nEdited content',
    })
  })

  it('decodes escaped text before writing Markdown', () => {
    const draft = createMobileEditorDraft({
      note: {
        id: 'symbols',
        title: 'Symbols',
        content: '# Symbols',
      },
      editorHtml: '<h1>Symbols</h1><p>Use &lt;tags&gt; &amp; &quot;quotes&quot;</p>',
    })

    expect(draft).toMatchObject({
      persistable: true,
      canonicalMarkdown: '# Symbols\n\nUse <tags> & "quotes"',
    })
  })

  it('blocks unsupported HTML instead of persisting unknown editor output', () => {
    expect(
      createMobileEditorDraft({
        note: {
          id: 'workflow',
          title: 'Workflow',
          content: '# Workflow\n\nOriginal markdown',
        },
        editorHtml: '<blockquote><p>Not yet supported</p></blockquote>',
      }),
    ).toEqual({
      noteId: 'workflow',
      sourceMarkdown: '# Workflow\n\nOriginal markdown',
      editorHtml: '<blockquote><p>Not yet supported</p></blockquote>',
      persistable: false,
      blockedReason: 'unsupportedEditorHtml',
    })
  })
})
