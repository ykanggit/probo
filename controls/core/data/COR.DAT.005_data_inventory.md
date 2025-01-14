---
id: "COR.DAT.005"
category: "core/data"
revision-version: 1
revision-date: "2024-01-14"
estimate-time: "15m"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC2.1", "CC6.1", "CC9.2"]
---

# Data inventory

## Purpose

Having an accurate and up-to-date inventory of all your data assets (databases,
cloud storage or even file shares) enables you to be exhaustive in how you treat
your data safety.

## Implementation

Complete the following matrix - be sure to have all data assets across your
company.

| **Location** | **Description**          | **Owner** | **Sensitivity\*** | **Retention period** | **Backup frequency** |
| ------------ | ------------------------ | --------- | ----------------- | -------------------- | -------------------- |
| _BigQuery_   | _Access log to prod API_ | _Antoine_ | _confidential_    | _1 year_             | _daily_              |
|              |                          |           |                   |                      |                      |

\*Sensitivity:

- Public: Intended for public dissemination (e.g., pricing information).
- Confidential: Sensitive to business operations or personal information (e.g.,
  customer names).
- Secret: Would severely harm the business if breached (e.g., database
  credentials).

## Evidence

- If you want to use something else than this template above, just provide the
  link to the matrix you implemented on your side (or a copy)
