---
id: "COD-002"
category: "code"
revision-version: 1
revision-date: "2024-01-07"
estimate-time: "15m"
frameworks:
  - name: "soc2"
    sections: ["CC4.1", "CC8.1"]
---

## Purpose

It ensures that potential security flaws are detected early. This proactive
approach strengthens your security posture and helps maintain high code quality.

## Implementation

### Github

1. Go to the "Security" tab of your repository.
2. Click on "Set up code scanning".
3. Select "Set up this workflow" under "CodeQL Analysis".
4. Review the YAML file and commit it to your repository.

Code scanning will now run every time code is pushed to the repository, and
results will appear in the Security tab.

## Evidence

- Screenshot of code scanning results from Security tab
- Sample of resolved security alerts
