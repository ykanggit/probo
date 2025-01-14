---
id: "COR.INF.002"
category: "core/infra"
revision-version: 1
revision-date: "2024-01-08"
estimate-time: "1h"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC4.1", "CC6.8", "CC7.1"]
---

# Scan for security updates

## Purpose

An automated security scanning software on your infrastructure components
enables you to fix potential vulnerabilities as soon as they are uncovered.

## Implementation

### 1/2 - Enable GCP security

1. Log in to your **Google Cloud Platform** account and navigate to the
   **Security Command Center**.
2. Click **Enable** to activate the Security Command Center for your project or
   organization.
3. If other members of your team need access, go to **IAM & Admin** > **IAM**
   and assign to them the appropriate roles (**Security Center Admin** or
   **Viewer**)
4. In the **Security Command Center dashboard**, look for **Security sources**
   and click **Configure** or **Manage Sources**:
   - **Asset Inventory**: Enables continuous tracking of assets within your GCP
     project or organization.
   - **Security Health Analytics**: Automatically scans your resources for
     common vulnerabilities and misconfigurations.
   - **Event Threat Detection**: Monitors your logs for suspicious activity and
     potential threats.
   - **Web Security Scanner**: Scans your public-facing web applications for
     known vulnerabilities.
5. For each service you want to enable, click on it and follow the prompts to
   activate it. Configure any necessary settings, such as defining which
   resources should be scanned or monitored.
6. Integrate with other GCP services, such as **Cloud Logging** and **Cloud
   Monitoring,** to collect detailed logs and metrics.
7. Save to update your settings. Verify that each service is active on the
   Security Sources page.

### 2/3 - Enable Artifact registry

<aside>
ℹ️

If you are already using Artifact Registry, make sure **Continuous scanning** is
enabled

</aside>

1. Log in to your **Google Cloud Platform** account and navigate to **Artifact
   Registry** under **Storage**.
2. Click **Enable API**
3. If other team members need access, go to **IAM & Admin** > **IAM** and assign
   them appropriate roles:
   - **Artifact Registry Admin**: Full access to manage repositories and
     artifacts.
   - **Artifact Registry Writer**: Permission to push artifacts to repositories.
   - **Artifact Registry Reader**: Read-only access to repositories.
4. In **Artifact Registry**, click **Create Repository** and configure the
   repository:
   - **Name**: Set a name for your repository.
   - **Location**: Choose a region or multi-region where the artifacts will be
     stored.
   - **Format**: Select the artifact type (e.g., Docker, npm, Maven).
   - Enable **Continuous Scanning** to automatically scan for known
     vulnerabilities in container images.
5. Click **Create**
6. For Docker images, run the following command to configure Docker
   authentication with `gcloud`: (For other formats like **npm** or **Maven**,
   follow the instructions in the **Setup instructions** section of your
   repository).

   ```bash
   gcloud auth configure-docker
   ```

7. Push artifacts to your repository:
   - For Docker:
     ```bash
     docker tag IMAGE_NAME LOCATION-docker.pkg.dev/PROJECT_ID/REPOSITORY_NAME/IMAGE_NAME
     docker push LOCATION-docker.pkg.dev/PROJECT_ID/REPOSITORY_NAME/IMAGE_NAME
     ```
   - For other formats, use the respective package manager (e.g., `npm publish`,
     `mvn deploy`).
8. Verify your repository by navigating to **Artifact Registry > Repositories**,
   and confirm that the uploaded artifacts appear in the repository.

### 3/3 - Implement alerts in Slack

1. Navigate to **Pub/Sub, c**lick **Create Topic**, give it a name (e.g.,
   `security-artifact-alerts`) and click **Create**
2. On the topic you created, click **Create Subscription**, choose a name for
   the subscription (e.g., `security-artifact-alerts-subscription`), and choose
   **Pull** as the delivery type..
3. Go to the **Security Command Center**, click on **Settings** or
   **Notifications**, choose **Create Notification**, provide a name for the
   notification (e.g., `critical-findings-notification`) and select the
   **resource type** (**Project** or **Organization**) to scope the
   notification.
4. Define conditions for sending notifications, such as:

   - **Severity** (e.g., only send alerts for high or critical severity
     findings).
   - **Finding types** (e.g., vulnerability detection, unauthorized access
     attempts).

   Use filters like:

   ```json
   severity="CRITICAL"
   ```

5. Choose the **Pub/Sub topic** you created (`security-artifact alerts`) and
   confirm the connection by allowing **Security Command Center** to publish to
   this topic.
6. Go to **Artifact Registry** > **Repositories** and select a repository.
   Navigate to **Settings** > **Notifications**.
7. Click **Add Notification** and select relevant event types:
   - **Vulnerability Findings**
   - **Failed Artifact Uploads**
   - **Unauthorized Access**
8. Link this notification to the same **Pub/Sub topic**
   (`security-artifact-alerts`).
9. Go to Slack API and click **Create New App**. Choose **From scratch**, name
   the app and select your workspace.
10. In the app settings, go to **Incoming Webhooks** and toggle the switch to
    **Activate Incoming Webhooks**. Click **Add New Webhook to Workspace** and
    choose the channel where you want to post alerts. Copy the **Webhook URL**
    provided after adding it - you will use it on GCP.
11. Go to **OAuth & Permissions** in the app settings and add the required
    scope: `chat:write` and `incoming-webhook`
12. Send a test message to the channel using the **Webhook URL**:

```bash
curl -X POST -H 'Content-type: application/json' --data '{"text":"Test alert from GCP Security and Artifact"}' YOUR_SLACK_WEBHOOK_URL
```

1. Go to **Cloud Functions** in **Google Cloud Console**, click **Create
   Function** and provide a name (e.g., `send-alerts-to-slack`), choose
   **Trigger type** as **Pub/Sub** and select your topic
   (`security-artifact-alerts`). Set the runtime environment to **Python.**
2. Use the following example code to forward alerts to Slack: (replace
   `YOUR_SLACK_WEBHOOK_URL` with your Slack incoming webhook URL)

```python
import base64
import json
import requests

def send_alert_to_slack(event, context):
    # Decode the Pub/Sub message
    pubsub_message = base64.b64decode(event['data']).decode('utf-8')
    alert = json.loads(pubsub_message)

    # Prepare the Slack webhook URL and message format
    slack_webhook_url = 'YOUR_SLACK_WEBHOOK_URL' # <= To replace
    message = {
        'text': f"New Alert: {alert.get('finding', 'No details')} - Severity: {alert.get('severity', 'Unknown')} - Type: {alert.get('eventType', 'Unknown')}"
    }

    # Send the alert to Slack
    response = requests.post(slack_webhook_url, json=message)

    if response.status_code != 200:
        raise ValueError(f"Request to Slack returned an error {response.status_code}, the response is: {response.text}")
```

1. Set the entry point to `send_alert_to_slack` and deploy the function (wait
   for it to activate).
2. Generate a test alert or monitor new alerts in **Security Command Center** to
   verify that alerts are sent to your Slack channel.
   - For Security Command Center: Simulate a high-severity finding.
   - For Artifact Registry: Upload a vulnerable artifact or simulate
     unauthorized access.

## Evidence

- Screenshot of GCP Security enabled on your project
- Screenshot of GCP Security enabled on your registry
- Screenshot of Artifact Registry enabled on your registry
- Screenshot of an alert received OR of its configuration
