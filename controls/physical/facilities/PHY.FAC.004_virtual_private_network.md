---
id: "PHY.FAC.004"
category: "physical/facilities"
revision-version: 1
revision-date: "2024-01-13"
estimate-time: "4h"
necessity: "optional"
frameworks:
  - name: "soc2"
    sections: ["CC6.1", "CC6.6", "CC6.7"]
---

# Use VPNs to Secure Access for Remote Devices

## Purpose

In short, implementing a VPN will encrypt your data and ensure a safe
transmission between your employees devices and your internal network (even when
using untrusted networks like a public wifi) ⇒ it offers a layer of security for
your data.

## Implementation

> If you have doubt whether you should do it or not, ping us on Discord. <br/>
> If everything is on Google Suite/Notion/Slack with MFA and you don’t have your
> own network => no needed.

If you think you need one, you should consider deploying one and make it
mandatory when working remote => You can follow the
[Wireguard installation guide there](https://www.wireguard.com/install/).

## Evidence

- Screenshot of VPN settings page (to show active use) or log of VPN connection
  from employees device.
