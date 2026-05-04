import { describe, expect, it } from 'vitest'
import { notes } from './demoData'
import { applySavedMobileEditorDraft } from './mobileSavedDraftProjection'

describe('mobile saved draft projection', () => {
  it('refreshes the saved note from canonical markdown', () => {
    const updatedNotes = applySavedMobileEditorDraft({
      notes,
      draft: {
        noteId: 'workflow',
        sourceMarkdown: notes[0].content,
        editorHtml: '<h1>New title</h1><p>Updated body</p>',
        persistable: true,
        canonicalMarkdown: '# New title\n\nUpdated body',
      },
    })

    expect(updatedNotes[0]).toMatchObject({
      id: 'workflow',
      title: 'New title',
      snippet: 'Updated body',
      modified: 'Saved now',
      words: 2,
    })
    expect(updatedNotes[1]).toBe(notes[1])
  })

  it('returns the original note list when the saved note is not loaded', () => {
    const updatedNotes = applySavedMobileEditorDraft({
      notes,
      draft: {
        noteId: 'missing',
        sourceMarkdown: '',
        editorHtml: '<p>Missing</p>',
        persistable: true,
        canonicalMarkdown: 'Missing',
      },
    })

    expect(updatedNotes).toBe(notes)
  })
})
