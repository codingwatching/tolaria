import { useMemo } from 'react'
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native'
import { RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor'
import type { MobileNote } from './mobileNoteProjection'
import { createMobileEditorDocument, createMobileEditorHtml } from './mobileEditorDocument'
import { styles } from './styles'

export function MobileEditorAdapter({ note }: { note: MobileNote }) {
  const document = useMemo(() => createMobileEditorDocument(note), [note])
  const initialContent = useMemo(() => createMobileEditorHtml(document), [document])
  const editor = useEditorBridge({
    avoidIosKeyboard: true,
    initialContent,
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
