---
id: "PHY.HW.003"
category: "physical/hardware"
revision-version: 1
revision-date: "2024-01-08"
estimate-time: "30m"
necessity: "mandatory"
frameworks:
  - name: "soc2"
    sections: ["CC2.1", "CC6.1", "CC6.6", "CC6.7", "CC6.8", "CC7.1", "CC7.2"]
---

# Configure Disk Encryption and Firewall on Employee Devices

## Purpose

Ensure all employee devices have disk encryption and firewall
protection enabled to secure data at rest and protect network
communications from unauthorized access.

## Implementation

### MacOS

1. Enable FileVault
   - System Settings → Privacy & Security

### Windows

1. Enable BitLocker
   - Control Panel → System and Security

## Evidence

**Option 1**: MDM Solution

- Encryption status report
- Device inventory status

**Option 2**: Manual Documentation

- Screenshots of encryption status
- Device inventory with status
