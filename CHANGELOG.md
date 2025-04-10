# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Fixed

- Fix cannot create vendor when the name is too similar to suggested one
- Fix UI show double button to close evidence preview modal.

## [0.5.0] - 2025-04-10

### Added

- Add vendor compliance reports UI
- Controls can now be linked to policies, enabling better organization of compliance documentation and clearer traceability between policies and security controls
- New UI for viewing and managing policies related to a specific control

## [0.4.2] - 2025-04-09

### Changed

- Simplified policy data model by removing version field and optimistic concurrency
- Refactored policy update flow to load-modify-save pattern

### Fixed

- Added user-friendly error messages when importing frameworks that already exist

## [0.4.1] - 2025-04-09

### Changed

- Update ISO 27001 and SOC2 framework definition.

## [0.4.0] - 2025-04-09

### BREAKING CHANGES

- **BREAKING:** Renamed GraphQL mutations for control-mitigation mappings:
  - `createControlMapping` → `createControlMitigationMapping`
  - `deleteControlMapping` → `deleteControlMitigationMapping`
  - Input and payload types have been updated accordingly

### Added

- Add import control <> mitigation mapping.
- Add mitigation tasks import.
- Add auto-scroll to opened category.
- Added support for mapping controls to policies:
  - New GraphQL mutations `createControlPolicyMapping` and `deleteControlPolicyMapping`
  - Controls can now be associated with both mitigations and policies
  - New bidirectional relationships:
    - Control objects now expose a `policies` field to list associated policies
    - Policy objects now expose a `controls` field to list associated controls
- Added vendor compliance reports:
  - New GraphQL types `VendorComplianceReport` and related connection types
  - New GraphQL mutations `uploadVendorComplianceReport` and `deleteVendorComplianceReport`
  - New `complianceReports` field on the Vendor type
  - Support for uploading, viewing, and managing vendor compliance documentation
- Added pre-configured frameworks:
  - Added ISO/IEC 27001:2022 and SOC 2 framework templates
  - Improved framework import interface with dropdown menu for template selection
  - Support for one-click import of standard compliance frameworks

### Changed

- Evidence can now be requested.

### Fixed

- Fix unfoldable mitigation category when open via the URI fragment.
- Fix ctrl+click on mitigation does not open new tab.
- Fix error handling in framework view when no controls are available.

## [0.3.0] - 2025-04-01

### Added

- Add sidebar to show a task.
- Add task estimate edition.
- Add control+framework auditor views.
- Add import mitigations support.
- Add import framework support.
- Add risk object management.
- Add risk template.
- Add mapping between control and risk.

### Changed

- Rename control in mitigation.
- Home page is now mitigations page.

### Fixed

- Fix panic in GraphQL resolver are not reported.
- Fix otal trace never started.
- Fix React.lazy chunck error.
- Fix login page show `unauthorized` error.
- Fix cannot delete task with evidences.
- Fix cannot download file with non-ASCII filename.

## [0.2.0] - 2025-03-24

### Added

- Add forget password.
- Allow evidence to be a link.
- Add task import support.
- Allow to create vendor when it not exist in the auto-complete.
- Add service account people kind.

### Changed

- Make task time estimate optional.
- Set invitation token to 12 hours.
- Order people by fullname.
- Order vendor by name.
- Allow to edit control state without going to edit page.
- Redirect on people list after people creation.
- New UI for the framework overview page.

### Fixed

- Fix flickering on hover on categories.
- Fix control order under a category.
- Fix UI does not refresh after importing a framework.
- Fix cannot create control.
- Fix missing include cookie on confirmation invit.
- Fix sign-in does not include cookie.
- Fix missing version when create task.
- Fix random order on framework overview.
- Fix change task state not visible on UI.
- Fix control card items alignement.
- Fix cannot delete task.
- Fix password managers misidentifying token fields as usernames in reset password and invitation confirmation forms.

## [0.1.0] - 2025-03-14

Initial release.
