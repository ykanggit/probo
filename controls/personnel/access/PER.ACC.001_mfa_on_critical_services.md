---
id: "PER.ACC.001"
category: "personnel/access"
revision-version: 1
revision-date: "2024-01-14"
estimate-time: "1h"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC6.1", "CC6.8"]
---

# Enable 2FA on critical services

## Purpose

In order to minimize the threat of someone getting access to something they
should not, we follow the **secure principle:** nobody can easily get access to
data/systems.

We need to ensure that if someone has access to your password, they still cannot
log into your account. Multi-Factor Authentication (MFA) adds extra layers of
security by requiring users to provide additional authentication factors beyond
their passwords. The most standard solution is 2FA: your password + something
else.

## Implementation

Enable 2FA across all your systems. If you don’t want to activate it everywhere,
prioritize:

- System containing sensitive data
- System related to your network, infrastructure or production.

At least, you need it for the following:

- Cloud provider (GCP, AWS etc.)
- Code hosting (Github, Gitlab etc.)
- Email/SSO (Google, Microsoft etc.)

## Evidence

- Screenshot of your 2FA settings in Cloud provider.
- Screenshot of your 2FA settings in Code hosting.
- Screenshot of your 2FA settings in Email/SSO.
