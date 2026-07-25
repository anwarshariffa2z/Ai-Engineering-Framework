---
id: STD-0006
title: Security Standard
version: 1.0.0
status: Approved
owner: Framework Maintainers
created: 2026-07-25
last_updated: 2026-07-25
review_cycle: Annual
category: Development
tags: [security, privacy, threat-modeling]
related: [data-governance-standard.md, ../06-governance/incident-management.md]
---

# Security Standard

AI systems follow the organization’s security baseline and add controls for model-mediated behavior.

## Requirements

1. Authenticate users and services; authorize every data read, tool call, and high-impact action at the relevant boundary.
2. Store credentials in an approved secret-management system. Never include secrets in source control, prompts, client applications, or logs.
3. Treat model output, retrieved content, uploaded files, and tool responses as untrusted. Validate structure and authorization before executing an action.
4. Constrain tools with least privilege, allowlists, parameter validation, execution timeouts, and approval requirements proportional to impact.
5. Defend against prompt injection by separating instructions from untrusted content, limiting tool authority, and testing attempted instruction overrides.
6. Maintain dependency, model-provider, and integration inventories; assess material supplier changes before adoption.
7. Preserve security-relevant events without recording unnecessary sensitive content.

Threat modeling is required before production for systems that access confidential data, invoke external tools, perform autonomous actions, or affect people materially. Revisit the model when trust boundaries or capabilities change.
