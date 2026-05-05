import { CaretDown, CaretRight } from 'phosphor-react-native'
import type { ReactNode } from 'react'
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native'
import type { MobileNote } from './demoData'
import { NamedIcon, type IconName } from './NamedIcon'
import {
  isMobileNotePropertySelected,
  mobileNoteIconOptions,
  mobileNoteStatusOptions,
  mobileNoteTagOptions,
  mobileNoteTypeOptions,
  toggleMobileNoteTag,
  type MobileNotePropertyPatch,
} from './mobileNoteProperties'
import { mobilePropertyDisplayValue, type MobilePropertyPickerKey } from './mobilePropertyPicker'
import { styles } from './styles'
import { colors } from './theme'

export function MobileEditablePropertyPickers({
  disabled,
  note,
  onChangeProperties,
  onSelectPicker,
  openPicker,
}: {
  disabled: boolean
  note: MobileNote
  onChangeProperties?: (patch: MobileNotePropertyPatch) => void
  onSelectPicker: (selected: MobilePropertyPickerKey) => void
  openPicker: MobilePropertyPickerKey | null
}) {
  return (
    <>
      <PropertyPickerSection
        disabled={disabled}
        isOpen={openPicker === 'type'}
        label="Type"
        value={mobilePropertyDisplayValue({ value: note.type })}
        onOpen={() => onSelectPicker('type')}
      >
        <PropertyChipOptions>
          {mobileNoteTypeOptions.map((option) => (
            <PropertyTextChip
              disabled={disabled}
              key={option}
              option={option}
              value={note.type}
              onSelect={(type) => onChangeProperties?.({ type })}
            />
          ))}
        </PropertyChipOptions>
      </PropertyPickerSection>
      <PropertyPickerSection
        disabled={disabled}
        isOpen={openPicker === 'status'}
        label="Status"
        value={mobilePropertyDisplayValue({ value: note.status })}
        onOpen={() => onSelectPicker('status')}
      >
        <PropertyChipOptions>
          {mobileNoteStatusOptions.map((option) => (
            <PropertyTextChip
              disabled={disabled}
              key={option || 'none'}
              option={option}
              value={note.status}
              onSelect={(status) => onChangeProperties?.({ status })}
            />
          ))}
        </PropertyChipOptions>
      </PropertyPickerSection>
      <PropertyPickerSection
        disabled={disabled}
        isOpen={openPicker === 'icon'}
        label="Icon"
        value={mobilePropertyDisplayValue({ value: note.icon })}
        onOpen={() => onSelectPicker('icon')}
      >
        <PropertyChipOptions>
          {mobileNoteIconOptions.map((option) => (
            <PropertyIconChip
              disabled={disabled}
              key={option}
              option={option}
              value={note.icon}
              onSelect={(icon) => onChangeProperties?.({ icon })}
            />
          ))}
        </PropertyChipOptions>
      </PropertyPickerSection>
      <PropertyPickerSection
        disabled={disabled}
        isOpen={openPicker === 'tags'}
        label="Tags"
        value={note.tags.length > 0 ? `${note.tags.length} selected` : 'None'}
        onOpen={() => onSelectPicker('tags')}
      >
        <PropertyChipOptions>
          {mobileNoteTagOptions.map((option) => (
            <PropertyTextChip
              disabled={disabled}
              key={option}
              option={option}
              value={note.tags}
              onSelect={(tag) => onChangeProperties?.({ tags: toggleMobileNoteTag(note.tags, tag) })}
            />
          ))}
        </PropertyChipOptions>
      </PropertyPickerSection>
    </>
  )
}

function PropertyPickerSection({
  children,
  disabled,
  isOpen,
  label,
  onOpen,
  value,
}: {
  children: ReactNode
  disabled: boolean
  isOpen: boolean
  label: string
  onOpen: () => void
  value: string
}) {
  return (
    <>
      <PropertyPickerRow disabled={disabled} isOpen={isOpen} label={label} value={value} onPress={onOpen} />
      {isOpen ? children : null}
    </>
  )
}

function PropertyPickerRow({
  disabled,
  isOpen,
  label,
  onPress,
  value,
}: {
  disabled: boolean
  isOpen: boolean
  label: string
  onPress: () => void
  value: string
}) {
  const Caret = isOpen ? CaretDown : CaretRight

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.propertyRow, disabled ? styles.propertyDisabled : null, pressed ? styles.pressed : null]}
    >
      <Text style={styles.propertyLabel}>{label}</Text>
      <Text style={styles.propertyValue}>{value}</Text>
      <Caret size={16} color={colors.textSoft} />
    </Pressable>
  )
}

function PropertyIconChip({
  disabled,
  onSelect,
  option,
  value,
}: {
  disabled: boolean
  onSelect: (option: string) => void
  option: string
  value: string | undefined
}) {
  const isSelected = isMobileNotePropertySelected({ current: value, option })

  return (
    <SelectablePropertyChip
      disabled={disabled}
      isSelected={isSelected}
      onPress={() => onSelect(option)}
      style={styles.propertyIconChip}
    >
      <NamedIcon color={isSelected ? colors.primary : colors.textSoft} name={option as IconName} size={20} />
    </SelectablePropertyChip>
  )
}

function PropertyChipOptions({ children }: { children: ReactNode }) {
  return (
    <View style={styles.propertyPickerOptions}>
      <View style={styles.propertyChipRow}>
        {children}
      </View>
    </View>
  )
}

function PropertyTextChip({
  disabled,
  onSelect,
  option,
  value,
}: {
  disabled: boolean
  onSelect: (option: string) => void
  option: string
  value: readonly string[] | string | undefined
}) {
  const isSelected = Array.isArray(value)
    ? value.includes(option)
    : isMobileNotePropertySelected({ current: typeof value === 'string' ? value : undefined, option })

  return (
    <SelectablePropertyChip
      disabled={disabled}
      isSelected={isSelected}
      onPress={() => onSelect(option)}
      style={styles.propertyChip}
    >
      <Text style={[styles.propertyChipText, isSelected ? styles.propertyChipTextSelected : null]}>
        {option || 'None'}
      </Text>
    </SelectablePropertyChip>
  )
}

function SelectablePropertyChip({
  children,
  disabled,
  isSelected,
  onPress,
  style,
}: {
  children: ReactNode
  disabled: boolean
  isSelected: boolean
  onPress: () => void
  style: StyleProp<ViewStyle>
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        style,
        isSelected ? styles.propertyChipSelected : null,
        disabled ? styles.propertyDisabled : null,
        pressed ? styles.pressed : null,
      ]}
    >
      {children}
    </Pressable>
  )
}
