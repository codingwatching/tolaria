import type { MobileNote } from './demoData'
import type { SavedMobileEditorDraft } from './mobileAutosaveQueue'
import { projectMobileNote } from './mobileNoteProjection'

export function applySavedMobileEditorDraft({
  draft,
  notes,
}: {
  draft: SavedMobileEditorDraft
  notes: MobileNote[]
}) {
  let updated = false
  const nextNotes = notes.map((note) => {
    if (note.id !== draft.noteId) {
      return note
    }

    updated = true
    return projectMobileNote({
      ...note,
      content: draft.canonicalMarkdown,
      filename: `${draft.noteId}.md`,
      modified: 'Saved now',
    })
  })

  return updated ? nextNotes : notes
}
