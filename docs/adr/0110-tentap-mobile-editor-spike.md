---
type: ADR
id: "0110"
title: "TenTap as the mobile editor spike"
status: active
date: 2026-05-04
---

## Context

Tolaria mobile needs an iPad-first editor that feels native enough for real writing while keeping Markdown files as durable source of truth. The mobile strategy already rejected direct BlockNote reuse as the default path because BlockNote's React DOM assumptions and Markdown import/export risks are a poor first bet for React Native.

The editor is the highest-risk mobile subsystem. It must support iPad keyboard behavior, touch selection, scrolling, formatting controls, wikilinks, Markdown persistence, and future Android without turning the entire app into a WebView.

## Decision

Use `@10play/tentap-editor` as the first mobile editor spike, installed only in `apps/mobile` and isolated behind `MobileEditorAdapter`.

TenTap may use a WebView internally, but that WebView is limited to the editor surface. Sidebar, note list, properties, gestures, storage, Git, auth, and app navigation remain React Native surfaces.

`react-native-webview` is installed through Expo's compatible package selection because TenTap requires it as the native WebView bridge.

## Consequences

Positive:

- The spike starts from a React Native editor package built for mobile rich-text editing.
- TenTap brings a Tiptap/ProseMirror editing core without making the whole mobile app WebView-based.
- Native toolbar and bridge APIs give a plausible path for iPad keyboard/touch workflows.
- The `MobileEditorAdapter` boundary keeps a native Markdown fallback realistic if TenTap fails.

Negative:

- TenTap adds a WebView and bundled editor assets to the mobile app.
- The first Expo Go validation is limited to TenTap's basic supported path; more advanced editor customization may require an Expo development build.
- TenTap currently brings a `react-dom` dependency for its bundled web editor path, which can produce package-manager peer warnings while the native app itself runs React Native.
- Markdown round-tripping, wikilinks, frontmatter exclusion, and save integration still need explicit implementation and quality gates.

Quality gates before accepting TenTap as the long-term editor:

- iPad typing latency has no visible lag on realistic notes.
- Long notes scroll smoothly inside the editor surface.
- Keyboard show/hide and hardware keyboard behavior do not break layout.
- Formatting toolbar behavior is discoverable and does not cover active text.
- Horizontal surface gestures do not conflict with text selection/editing.
- Frontmatter stays outside the rich editor body unless raw mode is explicitly entered.
- Markdown remains the source of truth; Tiptap JSON is not persisted as canonical document state.

Re-evaluate this decision if:

- TenTap fails the quality gates on iPad hardware or simulator/dev-build validation.
- The WebView editor surface causes unacceptable gesture, keyboard, or scroll conflicts.
- Markdown and wikilink round-tripping require fragile or lossy custom conversion.
- Android support proves substantially weaker than the native Markdown fallback.

## Advice

Keep all direct TenTap imports inside `MobileEditorAdapter` or narrowly-scoped editor modules. Do not leak TenTap types into vault repositories, navigation, note projection, or storage contracts.
