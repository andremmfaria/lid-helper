# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-04-16

### Added
- Quick Settings toggle in the GNOME Shell system menu to control lid-close behavior
- Separate actions for AC power and battery modes
- Supported actions: suspend, hibernate, lock screen, shut down, do nothing
- Preferences window (`gnome-extensions prefs`) with `Adw.ComboRow` selectors for each power mode
- GSettings integration via `org.gnome.settings-daemon.plugins.power`
- Extension scaffold with `metadata.json` targeting GNOME Shell 45, 46, 47
