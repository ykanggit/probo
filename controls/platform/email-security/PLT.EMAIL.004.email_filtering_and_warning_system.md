---
id: "PLT-EMAIL-004"
category: "platform/email-security"
revision-version: 1
revision-date: "2024-01-07"
estimate-time: "15m"
frameworks:
  - name: "soc2"
    sections: ["CC6.8", "CC7.2"]
---

## Purpose

Implement email filtering and warning systems to reduce phishing risks and
protect employees from malicious emails. This reduces mental load on employees
and decreases company risk exposure through email-based attacks.

## Implementation

### Google Workspace

1. Access [Google Admin Console](https://admin.google.com).
2. Navigate to Settings
   ```
   Apps → Google Workspace → Gmail
   ```
3. Configure "Safety" settings:
   - Attachments Protection
   - Scan for anomalous attachment types
   - Block attachments with scripts
   - Block encrypted attachments from untrusted senders
   - Links and External Images:
   - Enable scanning of linked images
   - Identify shortened URLs
   - Display warning prompts for untrusted domains

## Evidence

- Screenshot of email security settings in Google Admin Console.
