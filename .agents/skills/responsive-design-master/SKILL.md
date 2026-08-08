---
name: responsive-design-master
description: |
  Fluid mobile-first responsive design, flexbox/grid layout systems, container queries, breakpoint management, and touch target accessibility.
  Use when crafting responsive web layouts across mobile, tablet, desktop, and ultra-wide displays.
---

# Responsive Design Master Guide

## Breakpoint Strategy & Layout Grid
- Mobile First: Base styles target `<640px`.
- Tablet: `sm: (640px)`, `md: (768px)`.
- Desktop: `lg: (1024px)`, `xl: (1280px)`, `2xl: (1536px)`.
- Container Queries: Use `@container` queries for micro-layouts inside dynamic sidebar panels.
- Touch Targets: Minimum 44x44px hit areas on mobile touch displays.
