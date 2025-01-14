---
id: "COR.DAT.003"
category: "core/data"
revision-version: 1
revision-date: "2024-01-14"
estimate-time: "15m"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC6.1", "CC6.6", "CC6.7"]
---

# Encrypt your data storage

## Purpose

By encrypting data, you ensure that loss or theft of a device won’t result in a
data breach. It also protects sensitive information from unauthorized access.

## Implementation

You need to ensure that all sensitive data stored is encrypted:

⇒ Cloudflare R2 buckets are encrypted (with AES-256) at rest by default ✅

⇒ Google Cloud SQL data is encrypted (with AES-256) at rest by default ✅

⇒ GCP buckets are encrypted (with AES-256) at rest by default ✅

If you have any other data storage, you need to make sure they are encrypted:

## Evidence

- All good if your data at rest is only on GCP & Cloudflare, else a screenshot
  of your encrypted database
