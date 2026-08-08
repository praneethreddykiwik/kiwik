---
name: system-design-architect
description: |
  High-availability system design, microservices, distributed data caching, message brokers, load balancing, and database partitioning.
  Use when architecting large-scale distributed systems or cloud backends.
---

# Distributed System Design Architect Guide

## Core Architectural Principles
- **Scalability**: Horizontal scaling over vertical scaling; stateless API layers.
- **Resilience**: Circuit breakers, exponential backoff retries, and graceful degradation.
- **Data Flow**: Multi-region read replicas, edge caching (Vercel Edge / Cloudflare Workers), and async background processing queues (BullMQ / Redis).
