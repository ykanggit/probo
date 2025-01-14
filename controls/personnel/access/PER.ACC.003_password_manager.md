---
id: "PER.ACC.003"
category: "personnel/access"
revision-version: 1
revision-date: "2024-01-14"
estimate-time: "15m"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC6.1", "CC6.8"]
---

# Setup a password manager

## Purpose

In order to minimize the threat of someone getting access to something they
should not, we want to ensure a few things:

1. The password used in your company are complex enough
2. They are stored encrypted
3. They are shared safely when needed (not openly, on slack or by text)
4. They are not compromised

The easiest way to implement those is to use a password manager.

## Implementation

### Choose your provider

There are a few options on the market regarding password manager. We will guide
you through [1password](https://1password.com/) setup.

You can also use [Dashlane](https://www.dashlane.com/) or a free open source
solution such as https://github.com/passbolt/passbolt_api.

### Confirm the policy you want

The main thing you need to decide on is the complexity of password you require.
Below, you will find a suggestion of something you can implement in 1password.

<aside>
🔒

Employees secret must meet the following requirements:

a. min 12 characters in length b. A mix of uppercase and lowercase characters c.
At least one non-alphanumeric character d. At least one number

</aside>

> If you change from this suggestion, please edit the suggestion - this rule
> will be added to a policy later.
