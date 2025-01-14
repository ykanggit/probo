---
id: "PER.ACC.004"
category: "personnel/access"
revision-version: 1
revision-date: "2024-01-14"
estimate-time: "30m"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC6.8", "CC7.2"]
---

# Setup Role Based Access Control (RBAC)

## Purpose

In order to minimize the threat of someone getting access to something they
should not, we follow the least privilege principle: access is limited to what's
necessary for job duties. We need to define which function should have access to
which tool in your company to serve as a reference when providing access to
people (password manager vaults etc.).

## Implementation

Define who should have access to what in a role-based matrix in the template
below:

1. Edit and add columns for the main tool categories you are using
2. Edit and add lines for the different functions / teams in your organization
3. Edit and add ticks `x` in the right box for access
4. In the last line, make sure to fill the right admin team

| **Role**      | **Email** | **Google Workspace** | **Expense Tool** | **CRM**    | **App**      | **Infrastructure** | **Version Control** | **Build System** | **Vuln Scanner** |
| ------------- | --------- | -------------------- | ---------------- | ---------- | ------------ | ------------------ | ------------------- | ---------------- | ---------------- |
| **Everyone**  | x         | x                    | x                |            | x            |                    |                     |                  |                  |
| **Engineers** | x         | x                    | x                |            | x            | x                  | x                   | x                | x                |
| **Sales**     | x         | x                    | x                | x          | x            |                    |                     |                  |                  |
|               |           |                      |                  |            |              |                    |                     |                  |                  |
| **Admin**     | HR        | HR                   | Finance          | Sales lead | Product lead | Eng lead           | Eng lead            | Eng lead         | Eng lead         |

## Evidence

- Provide the link to the matrix you implemented on your side
