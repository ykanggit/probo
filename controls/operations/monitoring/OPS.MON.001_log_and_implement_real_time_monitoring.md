---
id: "OPS.MON.001"
category: "operations/monitoring"
revision-version: 1
revision-date: "2024-01-14"
estimate-time: "1h"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC2.1", "CC6.1", "CC6.6", "CC6.8", "CC7.1", "CC7.2", "CC7.3"]
---

# Configure logs and implement real-time monitoring

## Purpose

It allows you to detect and respond to potential security incidents or system
failures immediately, minimizing downtime and reducing the risk of data
breaches. It maintain visibility into system performance and security events.

## Implementation

If you are only relying on GCP for everything, you can use the GCP solution:

- Leverage GCP solution

  1. **Install the Monitoring Agent** on your VMs: SSH into your VM and install
     the agent.

     ```bash
     curl -sSO https://dl.google.com/cloudagents/add-monitoring-agent-repo.sh
     sudo bash add-monitoring-agent-repo.sh
     sudo apt-get update
     sudo apt-get install stackdriver-agent
     ```

  2. In Google Cloud Console, go to **Monitoring** > **Dashboards** and enable
     **Google Cloud Operations Suite** (formerly Stackdriver).
  3. Use **Cloud Monitoring** to set up **dashboards**, track key metrics (CPU,
     memory, latency), and create **alerting policies** for real-time
     notifications on critical events.

Else, we recommend either Grafana or Datadog:

### Implement Datadog with GCP

1. Go to the [Datadog website](https://www.datadoghq.com/) and sign up for an
   account.
2. **Install the Datadog Agent** on your GCP VMs:

   - **SSH** into your VM.
   - Run the installation command for the Datadog agent. For Debian/Ubuntu:

   ```bash
   DD_API_KEY=<YOUR_API_KEY> bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script.sh)"
   ```

   ⇒ Replace `<YOUR_API_KEY>` with your Datadog API key (found in the Datadog
   dashboard under **Integrations** > **APIs**).

3. **Enable Google Cloud Logging**:
   - In the **Google Cloud Console**, navigate to **Logging** > **Logs Router**.
   - Click **Create Sink** and name it **Datadog Logs**.
   - Set **destination** to **Pub/Sub** and create a new Pub/Sub topic (e.g.,
     `datadog-logs`).
4. **Connect Pub/Sub to Datadog**:
   - In **Datadog**, go to **Integrations** > **Google Cloud**.
   - Enable the **Pub/Sub** integration and follow the steps to link it to your
     GCP project.
   - Create a service account with the appropriate permissions
     (`pubsub.subscriber`) and add it to the Pub/Sub topic created.
5. **Send Logs to Datadog**:
   - Configure the Pub/Sub topic to export logs from Google Cloud to Datadog.
   - Ensure logs from GCP services like Compute Engine, Cloud Functions, etc.,
     are routed to this topic.
6. **Monitor Logs in Datadog**:
   - In Datadog, navigate to **Logs** to see real-time logs from your GCP
     infrastructure.
   - Set up **alerts** or **dashboards** for monitoring specific log patterns or
     critical events.

### Implement Grafana with GCP

- **Create a Grafana Cloud Account**: Sign up at
  [Grafana Cloud](https://grafana.com/).
- **Install the Grafana Agent** on GCP VMs:
  - **SSH** into your VM.
  - Download and install the Grafana Agent:
  ```bash
  sudo curl -O -L https://raw.githubusercontent.com/grafana/agent/main/install-agent.sh
  sudo bash install-agent.sh
  ```
  - Configure it with your **Grafana Cloud credentials**.
- **Enable Google Cloud Logging**:
  - In **Google Cloud Console**, go to **Logging** > **Logs Router**.
  - Create a **Sink** and select **Pub/Sub** as the destination.
  - Set up a **Pub/Sub topic** for Grafana logs.
- **Configure Pub/Sub for Grafana**:
  - In **Grafana Cloud**, set up **Loki** (for log aggregation).
  - Configure **Pub/Sub** to forward logs to **Loki** by creating a service
    account with `pubsub.subscriber` permissions.
- **Monitor Logs in Grafana**:
  - Go to **Explore** in Grafana to view and search logs.
  - Set up **dashboards** or **alerts** for important log data.

Once the chosen solution is installed, you need to implement your first
dashboard (if not already the case). At least, we think you should be able to
follow:

- Availability:
  - Resource usage (CPU, memory, storage)
  - System downtime event
  - Optional:
    - Uptime
    - Latency
- Access:
  - Failed log attemps, unauthorized access, MFA usage
- Integrity:
  - Error rate (eg. rate of 500s)
  - Data loss or corruption (inc. transaction failures)

## Evidence

- Screenshot of the metrics you are tracking.
