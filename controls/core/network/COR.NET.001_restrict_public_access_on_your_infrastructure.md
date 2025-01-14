---
id: "COR.NET.001"
category: "core/network"
revision-version: 1
revision-date: "2024-01-12"
estimate-time: "30m"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC6.1", "CC6.6", "CC6.7"]
---

# Restrict public access on your infrastructure

## Purpose

Public access to your company's infrastructure is a serious security risk. By
configuring your cloud provider to restrict public access, you can reduce the
risk of unauthorized access to your sensitive data and systems.

## Implementation

- Ensure your cloud storage buckets are private (it should be the case by
  default)
  1. **Go to the Google Cloud Console,** navigate to **Cloud Storage**.
  2. In **Permissions**, enable **Uniform Bucket-Level Access** to enforce
     bucket-level permissions (and not individual object level).
  3. Remove any **AllUsers** or **allAuthenticatedUsers** roles, as these allow
     public access.
  4. Assign only required roles (e.g., `Storage Admin` or
     `Storage Object Viewer`) to specific users or groups. If you need a bucket
     to have public access for its purpose (e.g. CDN buckets) :
  5. Document why this bucket needs to be public in the evidence section
  6. Disable **Uniform Bucket-Level Access** and proceed at the bucket level.
     For each:
     1. Select your bucket
     2. Under **Bucket Permissions**, remove any **AllUsers** or
        **allAuthenticatedUsers** roles
- Remove the default network The default network in GCP rely on a set of
  rules/access that can’t be disabled and are “unsafe”. That is why it is better
  to create your own network.
    <aside>
    🚨
    
    First, replace the default network with a network that allows access only to the services you have enabled.
    
    </aside>
    
    1. Once the default network is no longer used, go to [VPC networks](https://console.cloud.google.com/networking/networks/list) on your Google Cloud Console
    2. Click the network named `default`.
    3. Click DELETE VPC NETWORK at the top of the page.
- Restrict public SSH access If you need to enable access to your system,
  leverage **Google Cloud Identity-Aware Proxy (IAP)** as a secure alternative
  to direct SSH. IAP will let you access your VMs via SSH without exposing them
  publicly, it eliminates the need for public IPS or open SSH ports.
  1. In **GCP Console**, go to **Identity-Aware Proxy** and enable it for the
     project.
  2. Grant the user or group with **IAP-secured Tunnel User** (network access)
     and **Compute Instance Admin** (SSH permissions) roles.
     1. It works even for external users as long as they have a google account.
        To access the VMs, user need to run a command locally via the **gcloud
        CLI** to tunnel SSH traffic through IAP:
  ```bash
  gcloud compute ssh <INSTANCE_NAME> --tunnel-through-iap
  ```

## Evidence

- Screenshot showing your storage bucket configuration.
- Screenshot showing your networks.
