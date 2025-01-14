---
id: "COR.INF.004"
category: "core/infra"
revision-version: 1
revision-date: "2024-01-14"
estimate-time: "1h"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC6.1", "CC6.3"]
---

# Plug GCP & Github

## Purpose

Having credentials to manage can become a nightmare (especially if you need to
change/rotate them often) - it quickly becomes time consuming. It is the same
with lifetime tokens - someone leaving and you need to change them.

## Implementation

### **1. Create a Workload Identity Pool in GCP**

1. In **Google Cloud Console**, go to **IAM & Admin** > **Workload Identity
   Federation**.
2. Click **Create Pool**, name it (e.g., `github-pool`), and set a
   **description**.
3. Select **Provider type:** **OIDC** (OpenID Connect).
4. Under **Provider details**, enter: **Issuer URL**:
   `https://token.actions.githubusercontent.com`
5. Click **Create** to finish setting up the pool.

### 2. **Create a Workload Identity Provider in the Pool**

1. In the pool, go to **Providers** and click **Add Provider**.
2. Name the provider (e.g., `github-provider`).
3. Set **Issuer URL** to `https://token.actions.githubusercontent.com`.
4. **Attribute mapping**: Add a mapping to verify the GitHub repository:
   1. `google.subject` → `assertion.sub`
   2. `attribute.repository` → `assertion.repository`
   3. `attribute.ref` → `assertion.ref`
   4. `attribute.owner` → `assertion.repository_owner`
5. Click **Create** to add the provider.

### 3. **Grant IAM Permissions on GCP**

1. Go to **IAM & Admin** > **IAM**.
2. Find the GCP service account you want GitHub Actions to use, or create a new
   one.
3. Click **Add Principal** and specify the **Workload Identity Pool** (in the
   format:
   `principal://iam.googleapis.com/projects/PROJECT_ID/locations/global/workloadIdentityPools/POOL_ID/attribute.repository/OWNER/REPO`).
4. Assign the necessary **roles** (e.g., `Viewer`, `Editor`) to allow access to
   resources.

### 4. **Configure GitHub Actions to Use Workload Identity**

1. In your **GitHub repository**, go to **Settings** > **Secrets and
   variables** > **Actions**.
2. Add a new secret (e.g., `GCP_WORKLOAD_IDENTITY_PROVIDER`) containing the GCP
   **Workload Identity Provider** details.

### 5. **Set Up GitHub Actions Workflow**

- In your **GitHub Actions workflow YAML file** (e.g.,
  `.github/workflows/deploy.yml`), add steps to authenticate:
  ```yaml
  jobs:
    deploy:
      runs-on: ubuntu-latest
      steps:
        - name: Configure Google Cloud authentication
          uses: google-github-actions/auth@v0
          with:
            workload_identity_provider:
              ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
            service_account: YOUR_GCP_SERVICE_ACCOUNT_EMAIL
        - name: Run GCP commands
          run: gcloud projects list
  ```

This setup enables secure, temporary access from **GitHub Actions** to **GCP**
resources without needing to store long-term credentials.

## Evidence

- Screenshot of your Github actions workflow.
