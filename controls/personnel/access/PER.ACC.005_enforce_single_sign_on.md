---
id: "PER.ACC.005"
category: "personnel/access"
revision-version: 1
revision-date: "2024-01-14"
estimate-time: "30m"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC6.8", "CC7.2"]
---

# Enforce SSO when possible

## Purpose

To minimize the risk of unauthorized access, it's important to centralize and
secure authentication across your organization. Single Sign-On (SSO) enhances
security by enabling better control over account access, enforcing consistent
security policies (e.g., 2FA), and making it easier to revoke access when
someone leaves the organization.

## Implementation

## Google Workspace

1. Log in to the [Google Admin Console](https://admin.google.com/) with an admin
   account.
2. Go to **Apps** > **Web and Mobile Apps** > **Add App** > **Add Custom SAML
   App**.
3. Name the app and upload a logo (optional).
4. **Generate SSO details**:
   - Google provides the **SSO URL**, **Entity ID**, and **Certificate** for the
     app.
5. **Configure the Third-Party App**:
   - In the app’s admin console, input the **SSO URL**, **Entity ID**, and
     upload the **Certificate**.
6. Return to Google Admin Console and configure attribute mapping (e.g., email,
   first name).
7. Test the connection, enable the app, and assign it to users or groups.

## Evidence

- Screenshot of SSO activation for Google Workplace + your cloud
  provider + code hosting tool
