---
id: "COR.INF.005"
category: "core/infra"
revision-version: 1
revision-date: "2024-01-14"
estimate-time: "30m"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC6.3"]
---

# Manage your service accounts

## Purpose

You don’t want to use the “default” service account, it has way too many
permissions - it is a super administrator. Even GCP is asking you not to use it,
it is only here for legacy reasons. In the same idea, grant your service
accounts only what is necessary.

## Implementation

### Google Cloud Platform

1. Make sure the default service account is not used by any service - if it is
   the case, create a new service account (with only View and/or Edit
   permission) and use it.
2. Make sure all your service accounts are only Viewer or Editor - you shouldn’t
   have any admin or owner.
3. Delete the default service account if not used anymore

Note: if you have IaC, it does make sense to have a service account as Admin,
but except in this kind of specific case: no admin
