---
name: ui-component-library-templates
description: |
  Building reusable UI component libraries (modals, data tables, carousels, tabs, accordions, command palettes, file uploaders).
  Use when expanding component libraries or implementing UI design systems.
---

# UI Component Library & Templates Guide

## Component Blueprint Rules
- Modular, accessible, and unstyled base primitives (Radix UI / Headless UI).
- Class name merging using `cn()` utility (`clsx` + `tailwind-merge`).
- Accessible keyboard navigation (`Tab`, `Escape`, `ArrowKeys`) built-in by default.
