---
id: "COR.INF.007"
category: "core/infra"
revision-version: 1
revision-date: "2024-01-14"
estimate-time: "1h"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC2.1", "CC6.8"]
---

# Remove unauthorized assets

## Purpose

Outdated/unmonitored/etc.. assets (VMs, Buckets, etc..) pose a significant risk:

- They can be used for malicious activities
- You don’t manage them, they could lack proper security measures.

## Implementation

Review the list of authorized asset you created
[List of your assets](./COR.INF.001_list_your_assets.md) , identify the ones
that should not be there, and select the proper action:

- Disconnect the asset from your network
- Scan for security updates on the asset and ensure proper access control
