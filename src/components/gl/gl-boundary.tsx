"use client";

import React from "react";

/** A 3D effect that fails leaves the plain version underneath, never a broken page. */
export class GLBoundary extends React.Component<{ children: React.ReactNode; fallback?: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback ?? null : this.props.children;
  }
}
