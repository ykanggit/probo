---
id: "COM-EMAIL-001"
category: "communication-security/email-security"
revision-version: 1
revision-date: "2024-01-07"
estimate-time: "30m"
frameworks:
    - name: "soc2"
      sections: ["CC6.1", "CC6.8"]
---

## Purpose
SPF (Sender Policy Framework) prevents email spoofing by defining
which mail servers are authorized to send emails on behalf of your
domain. It helps receiving mail servers verify that incoming email
from a domain comes from a host authorized by that domain's
administrators.

## Risk Assessment

| Risk                            | Impact | Reason                                                               |
|---------------------------------|--------|----------------------------------------------------------------------|
| Phishing and Social Engineering | 8      | Reduces phishing by preventing email spoofing of company             |
| Business Email Compromise (BEC) | 8      | Prevents attackers from impersonating trusted partners or executives |

## Implementation

1. Identify all legitimate email sources:
   - Your mail servers
   - Third-party services (e.g., Google Workspace)
   - Marketing platforms
   - Any other authorized email senders
2. Create SPF record
   ```
   v=spf1 include:_spf.google.com ~all
   ```
   Where:
   - `v=spf1`: Version of SPF
   - `include:_spf.google.com`: Include Google's mail servers
   - `~all`: Soft fail for others (can be changed to -all for hard fail)
3. Add record to DNS:
   - Create TXT record at domain root
   - Publish SPF record in DNS
   - Wait for DNS propagation
   
## Evidence

- Screenshot of published SPF DNS record
- Email header samples showing SPF pass
- Documentation of authorized senders

