---
id: "PHY-HW-002"
category: "physical/hardware"
revision-version: 1
revision-date: "2024-01-08"
estimate-time: "30m"
frameworks:
  - name: "soc2"
    sections: ["CC2.1", "CC6.1", "CC6.6", "CC6.7", "CC6.8", "CC7.1", "CC7.2"]
---

## Purpose

Implement automatic screen lock on all employee devices to prevent unauthorized
access when devices are unattended, protecting against physical access to
company data and resources.

## Implementation

### All Devices

1. Configure automatic screen lock:
   - Maximum 5-minute timeout
   - Require password/biometrics to unlock
   - Disable bypass options

### MacOS

1. Apple menu → System Settings → Lock Screen
2. Enable "Require password after screen saver begins"

### Windows

1. Settings → Personalization → Lock screen
2. Enable "Require sign-in when PC wakes"

## Evidence

**Option 1**: MDM Solution

- Screen lock policy compliance report
- Configuration status dashboard

**Option 2**: Manual Documentation

- Screenshots of screen lock settings
- Device compliance checklist
