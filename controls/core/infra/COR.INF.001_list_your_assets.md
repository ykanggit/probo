---
id: "COR.INF.001"
category: "core/infra"
revision-version: 1
revision-date: "2024-01-14"
estimate-time: "1h"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC2.1", "CC4.1"]
---

# List of your Assets

## Purpose

The assets that are storing or processing data are potential vulnerabilities
that could be exploited. ⇒ You need to know which assets your company has in
order to be able to properly manage and secure them.

## Implementation

If you don’t have one, create an inventory of all your assets that have the
potential to store or process data. This inventory should include:

- description of the device
- location
- owner
- operating status

### Google Cloud Platform

GCP Asset inventory can fulfil this for you if you implement it with systematic
tracking and monitoring:

1. Go to the **GCP console** and enable **Cloud Asset Inventory API**
2. Navigate to **API & Services** section, and enable **Cloud Asset API** for
   the relevant projects
3. Identify which assets you want to monitor. You should include (if relevant):
   1. Compute instances (e.g., VMs)
   2. Storage (e.g., Cloud Storage Buckets)
   3. Networking components (e.g., firewalls)
   4. IAM policies and permissions
   5. Encryption keys (Cloud KMS)
   6. Logging (Cloud Audit Logs)
4. Set up **automatic collection** of assets using **GCP Cloud Scheduler** or
   **GCP Cloud Functions** to regularly query and capture inventory snapshots
   (that way you can maintain a record of changes) OR use glcoud commands/API
   calls: `gcloud asset search-all-resources --scope=projects/your-project-id`

## Evidence

- Screenshot of your GCP asset inventory list
