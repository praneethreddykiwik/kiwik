---
name: sec-test
description: |
  Automated security testing, vulnerability verification, boundary condition checks, and automated security regression testing.
  Use when validating security fixes or performing regression testing.
---

# Automated Security Test & Verification Protocol

## Security Test Checklist
1. **Unauthenticated Route Protection**: Verify that unauthenticated requests to protected endpoints return 401 Unauthorized.
2. **Privilege Escalation Assertion**: Verify that normal users attempting admin mutations receive 403 Forbidden.
3. **Payload Limit Rejection**: Assert that oversized payloads (> 1MB) return 413 Payload Too Large.
