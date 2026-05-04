import { useEffect, useMemo, useRef } from 'react'
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native'
import { RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor'
import type { MobileNote } from './mobileNoteProjection'
import { createMobileEditorDraft, type MobileEditorDraft } from './mobileEditorDraft'
import {
  createMobileEditorDocument,
  createMobileEditorHtml,
} from './mobileEditorDocument'
import { styles } from './styles'

export function MobileEditorAdapter({
  note,
  onDraftChange,
}: {
  note: MobileNote
  onDraftChange?: (draft: MobileEditorDraft) => void
}) {
  const document = useMemo(() => createMobileEditorDocument(note), [note])
  const initialContent = useMemo(() => createMobileEditorHtml(document), [document])
  const draftTargetRef = useRef({ note, onDraftChange })
  useEffect(() => {
    draftTargetRef.current = { note, onDraftChange }
  }, [note, onDraftChange])
  const editor = useEditorBridge({
    avoidIosKeyboard: true,
    initialContent,
    onChange: () => {
      const draftTarget = draftTargetRef.current
      void editor.getHTML().then((editorHtml) => {
        draftTarget.onDraftChange?.(createMobileEditorDraft({ editorHtml, note: draftTarget.note }))
      })
    },
  })

  return (
    <View style={styles.editorAdapterContent}>
      <View style={styles.breadcrumbRow}>
        <Text style={styles.breadcrumbText}>{note.type}</Text>
        <Text style={styles.breadcrumbDivider}>/</Text>
        <Text style={styles.breadcrumbText}>{note.id}</Text>
      </View>
      <View style={styles.tentapEditor}>
        <RichText key={note.id} editor={editor} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.tentapToolbar}
      >
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </View>
  )
}
