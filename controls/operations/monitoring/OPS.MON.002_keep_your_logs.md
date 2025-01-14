---
id: "OPS.MON.002"
category: "operations/monitoring"
revision-version: 1
revision-date: "2024-01-14"
estimate-time: "15m"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC7.3"]
---

# Keep your logs

## Purpose

Logs help you to detect and investigate security incidents and troubleshoot
operational issues. They provide an audit trail.

## Implementation

You should consider a retention period of at least 90 days, and up to 1 year.

- **If you are using Grafana ⇒ Grafana Loki**: Configure the retention period in
  `loki-config.yaml`.
- **If you rely on GCP**: In **Cloud Logging**, navigate to **Logs Router** and
  adjust log sink retention settings.

If you are using Datadog:

1.  Go to **Logs Management**
2.  Set the retention period (3 to 15 days depending on your plan).
3.  As you are limited in time, also set up the configuration in GCP.

## Evidence

- Screenshot of your configuration in GPC or Grafana
