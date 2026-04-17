<p align="center">
  <img src="logo.svg" width="96" alt="Lid Helper logo"/>
</p>

<h1 align="center">Lid Helper</h1>

<p align="center">
  <a href="https://github.com/andremmfaria/lid-helper/actions/workflows/ci.yml">
    <img src="https://github.com/andremmfaria/lid-helper/actions/workflows/ci.yml/badge.svg" alt="CI"/>
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"/>
  </a>
  <img src="https://img.shields.io/badge/GNOME Shell-45%20%7C%2046%20%7C%2047-4A86CF" alt="GNOME Shell 45 | 46 | 47"/>
</p>

<p align="center">
  A GNOME Shell extension that lets you control what happens when you close your laptop lid — separately for AC power and battery — directly from the Quick Settings panel or the extension preferences window.
</p>

## Features

- **Quick Settings menu** — flip lid-close behaviour on the fly without opening any settings app
- **Preferences window** — clean Adwaita UI with dropdowns for AC and battery actions
- Reads and writes `org.gnome.settings-daemon.plugins.power` GSettings keys directly
- Subtitle in the Quick Settings toggle always shows the current active actions at a glance

### Supported actions

| Value | Label |
|---|---|
| `suspend` | Suspend |
| `hibernate` | Hibernate |
| `nothing` | Do Nothing |
| `blank` | Blank Screen |
| `shutdown` | Shut Down |
| `lock` | Lock Screen |
| `logout` | Log Out |

## Requirements

- GNOME Shell **45**, **46**, or **47**
- `gnome-settings-daemon` (present by default on most GNOME distros)

## Installation

```bash
EXT_DIR=~/.local/share/gnome-shell/extensions/lid-helper@lid-helper
mkdir -p "$EXT_DIR/schemas"
cp metadata.json extension.js prefs.js "$EXT_DIR"
cp schemas/org.gnome.shell.extensions.lid-helper.gschema.xml "$EXT_DIR/schemas/"
glib-compile-schemas "$EXT_DIR/schemas/"
```

Then restart GNOME Shell:

- **X11** — press `Alt+F2`, type `r`, press Enter
- **Wayland** — log out and back in

Finally, enable the extension:

```bash
gnome-extensions enable lid-helper@lid-helper
```

## Usage

### Quick Settings

Click the **Lid Helper** entry in the Quick Settings panel (top-right system menu). Two sections appear — *On AC Power* and *On Battery* — each listing all available actions. A checkmark indicates the currently active one.

### Preferences

```bash
gnome-extensions prefs lid-helper@lid-helper
```

Or open **GNOME Extensions** app → Lid Helper → Settings.

## Development

### Testing in a nested session (recommended)

Avoids affecting your live desktop:

```bash
dbus-run-session -- gnome-shell --nested --wayland
```

Install and enable the extension inside the nested session as described above.

### Watching logs

```bash
journalctl -f -o cat /usr/bin/gnome-shell
```

### Verifying GSettings changes

```bash
gsettings get org.gnome.settings-daemon.plugins.power lid-close-ac-action
gsettings get org.gnome.settings-daemon.plugins.power lid-close-battery-action
```

### Reloading after edits

```bash
cp metadata.json extension.js prefs.js "$EXT_DIR"
cp schemas/org.gnome.shell.extensions.lid-helper.gschema.xml "$EXT_DIR/schemas/"
glib-compile-schemas "$EXT_DIR/schemas/"
gnome-extensions disable lid-helper@lid-helper
gnome-extensions enable  lid-helper@lid-helper
```

## Project structure

```
lid-helper/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml          # Validate and package on every push/PR
│   │   └── release.yml     # Build zip and publish GitHub Release on tag
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── pull_request_template.md
├── schemas/
│   └── org.gnome.shell.extensions.lid-helper.gschema.xml  # GSettings schema (required by EGO)
├── metadata.json           # Extension manifest (UUID, name, supported shell versions)
├── extension.js            # Quick Settings toggle + submenu
├── prefs.js                # GTK4/Adwaita preferences window
├── logo.svg                # Extension logo
├── LICENSE
└── README.md
```

## License

MIT
