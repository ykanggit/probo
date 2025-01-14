---
id: "COR.NET.002"
category: "core/network"
revision-version: 1
revision-date: "2024-01-12"
estimate-time: "30m"
necessity: "optional"
frameworks:
  - name: "soc2"
    sections: ["CC6.1", "CC6.6"]
---

# Set-up a WAF

## Purpose

A web application protection service acts as a security shield that:

Filters malicious traffic (SQL injections, XSS attacks) Masks your server's real
IP address Blocks DDoS attacks and malicious bots Controls request rates to
prevent abuse

This ensures your applications stay secure and available while legitimate
traffic flows normally.

## Implementation

### Cloudflare

1. **Sign up for Cloudflare**: Go to [Cloudflare](https://www.cloudflare.com/)
   and create an account.
2. **Add your domain**: Enter your website’s domain and let Cloudflare scan
   existing DNS records.
3. **Update your DNS**: Change your domain's nameservers to Cloudflare’s
   nameservers as provided in your Cloudflare dashboard.
4. **Configure your security settings**:
   - **Enable the Web Application Firewall (WAF)**: Set up rules to block
     threats like SQL injections and XSS attacks.
   - **Enable DDoS Protection**: Configure DDoS settings to prevent service
     interruptions.
5. **Optional - Set up Access controls**:
   - Use **IP Access Rules** to allow or block specific IPs.
   - Configure **Rate Limiting** to prevent excessive requests that could signal
     attacks.
6. **Review and Test**: Ensure that your website operates smoothly, and verify
   that rules are correctly blocking or allowing traffic.

## Evidence

- Screenshot of your WAF configuration.
