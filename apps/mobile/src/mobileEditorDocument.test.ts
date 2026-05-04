import { describe, expect, it } from 'vitest'
import { createMobileEditorDocument, createMobileEditorHtml } from './mobileEditorDocument'

describe('mobile editor document', () => {
  it('strips frontmatter and title heading from the displayed editor body', () => {
    expect(
      createMobileEditorDocument({
        id: 'workflow',
        title: 'Workflow Orchestration Essay',
        content: [
          '---',
          'type: Essay',
          '---',
          '',
          '# Workflow Orchestration Essay',
          '',
          'The current narrative: everything routed through an LLM.',
        ].join('\n'),
      }),
    ).toEqual({
      title: 'Workflow Orchestration Essay',
      blocks: [
        {
          id: '0:The current narrative: everything routed through an LLM.',
          kind: 'paragraph',
          text: 'The current narrative: everything routed through an LLM.',
        },
      ],
    })
  })

  it('keeps colon paragraphs instead of treating them as frontmatter', () => {
    const document = createMobileEditorDocument({
      id: 'monday',
      title: 'Notes for Monday',
      content: '# Notes for Monday\n\nBottom line up front: ship the smallest useful slice.',
    })

    expect(document.blocks).toEqual([
      {
        id: '0:Bottom line up front: ship the smallest useful slice.',
        kind: 'paragraph',
        text: 'Bottom line up front: ship the smallest useful slice.',
      },
    ])
  })

  it('normalizes markdown bullets for the native placeholder surface', () => {
    const document = createMobileEditorDocument({
      id: 'plan',
      title: 'Plan',
      content: '# Plan\n\n- Sidebar\n* Note list',
    })

    expect(document.blocks).toEqual([
      {
        id: '0:- Sidebar',
        kind: 'bullet',
        text: 'Sidebar',
      },
      {
        id: '1:* Note list',
        kind: 'bullet',
        text: 'Note list',
      },
    ])
  })

  it('creates escaped HTML for TenTap initial content', () => {
    const html = createMobileEditorHtml({
      title: 'Tolaria <mobile>',
      blocks: [
        {
          id: '0:Use TenTap',
          kind: 'paragraph',
          text: 'Use TenTap & keep markdown durable',
        },
        {
          id: '1:- Escape quotes',
          kind: 'bullet',
          text: 'Escape "quotes"',
        },
      ],
    })

    expect(html).toBe(
      '<h1>Tolaria &lt;mobile&gt;</h1><p>Use TenTap &amp; keep markdown durable</p><ul><li>Escape &quot;quotes&quot;</li></ul>',
    )
  })

})
