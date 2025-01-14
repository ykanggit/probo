---
id: "OPS.MON.003"
category: "operations/monitoring"
revision-version: 1
revision-date: "2024-01-14"
estimate-time: "15m"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC6.1", "CC6.6", "CC6.8", "CC7.1", "CC7.2", "CC7.3"]
---

# Be automatically notified of issues

## Purpose

Setting up alerting allows you to respond quickly and minimize downtime or
potential data breaches. It ensures that important events, such as unauthorized
access or system failures, are addressed promptly.

## Implementation

You should implement alerts for critical events (if you have alerts on
everything, its not alerting anymore). You should consider:

- **Resource Utilization**: Monitor high CPU, memory, or disk usage to prevent
  downtime or system crashes.
- **System Downtime**: Set alerts for system unavailability or critical services
  going offline.
- **Network Traffic Anomalies**: Monitor for unusual spikes or patterns in
  network traffic that could indicate a potential attack.
- Optional:
  - **Unauthorized Access Attempts:** Track and alert on failed logins, unusual
    login locations, or excessive login attempts.

To set up an alert:

### In Cloud Monitoring for GCP:

1. Navigate to **Monitoring** > **Alerting**.
2. Click **Create Policy**.
3. Select **Add Condition**, then choose the metric you want to monitor (e.g.,
   CPU usage).
4. Define the alert conditions (e.g., CPU > 80% for 5 minutes).
5. Choose how to be notified (email, SMS, **Slack**).
6. Name your alert and click **Save** to activate it.

### In Grafana

1. Log into your Grafana instance, go to the **Dashboards** section and select
   the relevant dashboard.
2. In the dashboard, add a **panel** that visualizes the metric you want to
   monitor.
3. In the panel settings, go to the **Alert** tab.
4. Click **Create Alert** and set conditions (e.g., CPU > 80% for 5 minutes).
5. Define the notification channels (e.g., email, Slack) in the **Contact
   Points** section.
6. Save the panel and dashboard. The alert is now active and will notify you
   when the conditions are met.

### In Datadog

1. Go to your Datadog dashboard.
2. On the left-hand menu, click on **Monitors** > **New Monitor**.
3. Choose the type of monitor (e.g., metric) and select the metric you want to
   track.
4. Define the conditions (e.g., CPU > 80% for 5 minutes).
5. Set up notification methods (e.g., email, Slack).
6. Name the alert and click **Create Monitor** to activate it.

## Evidence

- Screenshot of alerts received on the slack channel/email created for that OR
  of the alerts created in your solution
