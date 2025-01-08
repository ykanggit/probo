---
id: "PLT-EMAIL-003"
category: "platform/email-security"
revision-version: 1
revision-date: "2024-01-07"
estimate-time: "30m"
related:
    - id: "COM-EMAIL-001"
	  required: true
	- id: "COM-EMAIL-002"
	  required: true
frameworks:
    - name: "soc2"
      sections: ["CC6.1", "CC6.8"]
---

## Purpose
DMARC (Domain-based Message Authentication, Reporting, and
Conformance) is a policy framework that builds upon SPF and DKIM. It
tells receiving servers what to do when emails fail SPF or DKIM
checks, and provides reporting on authentication results.

## Implementation

### Google Workspace

1. Create a Google Group named `dmarc-report@example.com` which is assecible from external users.
2. Create DMARC record in monitoring mode:
   ```
   Record: _dmarc.example.com
   Value: v=DMARC1; p=none; rua=mailto:dmarc-reports@example.com
   ```
   Where:
   - `v=DMARC1`: Protocol version
   - `p=none`: Policy for failed checks
   - `rua=`: Address for aggregate reports
3. Check the reports sent to the rua email address to ensure proper
   authentication of emails.

## Evidence
- Screenshot of DMARC DNS record
- Sample aggregate reports
