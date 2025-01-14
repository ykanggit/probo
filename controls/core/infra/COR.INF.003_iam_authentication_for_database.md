---
id: "COR.INF.003"
category: "core/infra"
revision-version: 1
revision-date: "2024-01-08"
estimate-time: "1h"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC6.1"]
---

# IAM for database authentication

## Purpose

You want to ensure that only the proper people can access your production
database. You also want to avoid the burden of managing another list of users or
rotating credentials.

## Implementation

### **Set Up Custom IAM Roles for Database Access**

1. In **Google Cloud Console**, go to **IAM & Admin** > **Roles**.
2. Click **Create Role** and define a custom role with only the necessary
   permissions for your database (for a read-only role:
   `cloudsql.instances.connect`, `cloudsql.instances.get`)
3. Save the role.

### **Assign Least Privilege Roles to Users or Service Accounts**

1. Go to **IAM & Admin** > **IAM**
2. Click **Add** to assign the custom role to specific users or service accounts
   that require production database access.
3. In the **New principals** field, enter the email of the user or service
   account.
4. Under **Role**, choose the custom role you created.
5. **Save**

### **Enable IAM Database Authentication (Cloud SQL Only)**

1. Go to **Cloud SQL** > **Instances**
2. Select your production database instance.
3. Under **Connections**, find the **Database Authentication** section and
   enable **IAM database authentication** (allows users with the necessary IAM
   roles to authenticate with their IAM credentials).

### Test access

1. In **Cloud Audit Logs** (under **Logging** > **Logs Explorer**), search for
   `cloudsql.googleapis.com` to view access logs.
2. Verify that access is limited to authorized users.

## Evidence

- Screenshot showing IAM is active on your Cloud SQL
