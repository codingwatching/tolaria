import { StyleSheet } from 'react-native'
import { colors, spacing } from '../theme'

export const noteCreateStyles = StyleSheet.create({
  composeButtonDisabled: {
    opacity: 0.55,
  },
  createNoteError: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl + 76,
    maxWidth: 220,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textSoft,
    backgroundColor: colors.chipRed,
    fontSize: 13,
    fontWeight: '600',
  },
})
