---
id: "COR.DAT.001"
category: "core/data"
revision-version: 1
revision-date: "2024-01-14"
estimate-time: "30m"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC7.5", "CC9.1"]
---

# Automated backup

## Purpose

Automated backups ensure that your data - one of your company’s most important
assets - is regularly and securely saved, reducing the risk of data loss. The
back-up keep it safe and available, the automated and regular allows for a
restoration just before any disruption, minimizing loss.

## Implementation

### Google Cloud Platform

- When creating an instance:
  1. **Google Cloud Console**, go to the **Backups** section.
  2. Enable **Automated Backups**.
  3. Set a **Backup Window** to specify when daily backups should occur
     (especially during off-peak hours).
- On existing instance:
  1. In **Google Cloud Console**, navigate to **SQL** > **Instances**.
  2. Select your instance and go to **Edit**.
  3. Scroll down to **Backups** and check the **Automated Backups** box.
  4. Set a **Backup Window** and **Backup Retention** settings (e.g., how many
     days’ worth of backups to retain).
- Enable Point-in-Time Recovery
  1. Go to **Cloud SQL** in the **Google Cloud Console** and select the **SQL
     instance** you want to enable PITR for.
  2. Click on **Edit** at the top of the instance details page.
  3. Scroll to the **Backups** section.
  4. Ensure **Automated Backups** is enabled (PITR depends on automatic backups)
     and enable **Point-in-Time Recovery.**
  5. Set a **backup retention period** that suits your needs. PITR allows
     recovery to any point within this retention period.
  6. Scroll down and click **Save** to apply your changes.

## Evidence

- Screenshot of back-up for your database.
