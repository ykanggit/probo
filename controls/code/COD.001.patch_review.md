---
id: "COD-001"
category: "code"
revision-version: 1
revision-date: "2024-01-07"
estimate-time: "15m"
frameworks:
    - name: "soc2"
      sections: ["CC1.4", "CC5.2", "CC8.1"]
---

## Purpose
Requiring pull requests and code reviews ensures higher code quality
and security by allowing multiple team members to catch bugs,
inefficiencies, and potential vulnerabilities before code is
merged. It also promotes collaboration, knowledge sharing, and
accountability within the team. This process helps prevent issues in
production and maintains adherence to coding standards.

## Implementation

### Github

1. Open your GitHub repository and go to settings.
2. In "Branche"s, click "Add Rule".
3. Enter the branch name (e.g. "main") in the branch name pattern
   field.
4. Enable: "Require a pull request before merging"
5. Click Create or Save to apply the rule

## Evidence

- Screenshot of branch protection rules configuration
- Documentation of PR review process
- Sample PR showing enforced requirements
