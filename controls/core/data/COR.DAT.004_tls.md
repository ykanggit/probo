---
id: "COR.DAT.004"
category: "core/data"
revision-version: 1
revision-date: "2024-01-14"
estimate-time: "15m"
necessity: "optional"
frameworks:
  - name: "soc2"
    sections: ["CC6.1", "CC6.6", "CC6.7"]
---

# Encrypt your data in transit

## Purpose

Data sent over networks can be intercepted and read - the encryption ensure it
won’t be intelligible. It secure it from potential threats.

## Implementation

If you don’t have your own network or are not using FTP (if you do, ping
Antoine), you only need to focus on web traffic.

It means:

GCP load balancers have TLS by defaults ✅

### Configure Cloudflare

- Activate DNSSEC
  1. **Log into Cloudflare** and select your domain.
  2. Go to the **DNS** tab, scroll to **DNSSEC**, and click **Enable DNSSEC**.
  3. **Copy the DS record** provided by Cloudflare.
  4. Go to your **domain registrar**, and paste the DS record in the DNSSEC
     settings.
  5. **Verify** back in Cloudflare; DNSSEC will show "Active" once propagation
     is complete.
- Ensure you have at least TLS version 1.2 with 1.3 on your zones
  1. **Log into Cloudflare** and select your domain.
  2. Go to **SSL/TLS** > **Edge Certificates**.
  3. Set **Minimum TLS Version** to **1.2**.
  4. Ensure **TLS 1.3** is enabled.
- Require a full or strict encryption
  1. **Log into Cloudflare** and select your domain.
  2. Go to **SSL/TLS** in the left-hand menu.
  3. Under **SSL/TLS Encryption Mode**, select **Full** or **Full (Strict)**.
  - **Full**: Encrypts end-to-end, but does not validate the origin certificate.
  - **Full (Strict)**: Encrypts end-to-end and validates the origin certificate.

Cloudflare ensure HTTPS where possible & R2 bucket data is encrypted in transit.
✅

## Evidence

- Screenshot of your Cloudflare configuration
