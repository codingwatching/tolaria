import { describe, expect, it } from 'vitest'
import { mobilePropertyDisplayValue, nextMobilePropertyPicker } from './mobilePropertyPicker'

describe('nextMobilePropertyPicker', () => {
  it('opens a selected picker and closes it when selected again', () => {
    expect(nextMobilePropertyPicker({ current: null, selected: 'type' })).toBe('type')
    expect(nextMobilePropertyPicker({ current: 'type', selected: 'type' })).toBeNull()
  })

  it('switches between editable property pickers', () => {
    expect(nextMobilePropertyPicker({ current: 'type', selected: 'status' })).toBe('status')
  })
})

describe('mobilePropertyDisplayValue', () => {
  it('normalizes missing property values for compact property rows', () => {
    expect(mobilePropertyDisplayValue({ value: undefined })).toBe('None')
    expect(mobilePropertyDisplayValue({ value: '' })).toBe('None')
    expect(mobilePropertyDisplayValue({ value: 'Essay' })).toBe('Essay')
  })
})
