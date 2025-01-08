---
id: "PLT-EMAIL-002"
category: "platform/email-security"
revision-version: 1
revision-date: "2024-01-07"
estimate-time: "30m"
frameworks:
    - name: "soc2"
      sections: ["CC6.1", "CC6.8"]
---

## Purpose
DKIM (DomainKeys Identified Mail) helps prevent email spoofing by
adding a digital signature to outgoing messages, allowing receiving
mail systems to verify that emails genuinely came from your domain and
weren't modified in transit.

## Implementation

### Google Workspace

1. Go to [Google Admin console](admin.google.com).
2. Navigate to Apps > Google Workspace > Gmail > Authenticate Email.
3. Select your domain and click "Generate new record".
4. Copy the DKIM TXT record provided by Google.
5. Add this TXT record to your DNS.
6. After DNS propagation, return to Admin console and click "Start authentication".

## Evidence

- Screenshot of published DKIM DNS record
- Sample email headers showing DKIM pass
