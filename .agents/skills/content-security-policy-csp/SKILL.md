---
name: content-security-policy-csp
description: |
  Configuring strict Content Security Policies (CSP), nonces, SRI (Subresource Integrity), and XSS defense headers in Next.js/Express.
  Use when hardening HTTP security headers.
---

# Content Security Policy (CSP) & Header Hardening

## Strict CSP Header Specification
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-$NONCE'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' https: data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;
```
Enforce additional security headers:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
