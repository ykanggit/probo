# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Add import control <> mitigation mapping.
- Add mitigation tasks import.

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
