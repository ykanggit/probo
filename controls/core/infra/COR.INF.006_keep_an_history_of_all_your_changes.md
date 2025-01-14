---
id: "COR.INF.006"
category: "core/infra"
revision-version: 1
revision-date: "2024-01-14"
estimate-time: "1h"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC5.3", "CC7.1", "CC7.2", "CC8.1"]
---

# Keep an history of all your changes

## Purpose

Infrastructure as Code (IaC) makes sure all your infrastructure changes are done
in a standardized and repeatable process - the chance of human error is lower.
Moreover, IaC enables version control and peer reviews. When growing, you will
have to do it - the earlier the better (later, it can become really painful).

## Implementation

**Option 1:** If you don’t want an IaC, in the evidence section, provide a
screenshot of some log of your infrastructure changes

**Option 2:** If you already have an IaC, go directly to the evidence section,
we only need a screenshot.

**Option 3:** If you don’t have one, we recommend Terraform - the documentation
is available [here](https://developer.hashicorp.com/terraform/tutorials).

## Evidence

- Screenshot showing some logs
- Screenshot of the query you are performing in GCP to see your logs
