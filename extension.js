import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as QuickSettings from 'resource:///org/gnome/shell/ui/quickSettings.js';

const LID_ACTIONS = [
    { id: 'suspend',   label: 'Suspend' },
    { id: 'hibernate', label: 'Hibernate' },
    { id: 'nothing',   label: 'Do Nothing' },
    { id: 'blank',     label: 'Blank Screen' },
    { id: 'shutdown',  label: 'Shut Down' },
    { id: 'lock',      label: 'Lock Screen' },
    { id: 'logout',    label: 'Log Out' },
];

function labelForAction(actionId) {
    return LID_ACTIONS.find(a => a.id === actionId)?.label ?? actionId;
}

const LidHelperToggle = GObject.registerClass(
    { GTypeName: 'LidHelperToggle' },
    class LidHelperToggle extends QuickSettings.QuickMenuToggle {
        _init(settings) {
            super._init({
                title: 'Lid Helper',
                iconName: 'computer-laptop-symbolic',
                toggleMode: false,
            });

            this._settings = settings;
            this._acItems = [];
            this._batItems = [];

            this._buildMenu();
            this._syncSubtitle();

            this._settingsChangedId = this._settings.connect('changed', () => {
                this._syncSubtitle();
                this._syncOrnaments();
            });
        }

        _buildMenu() {
            this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem('On AC Power'));

            for (const action of LID_ACTIONS) {
                const item = new PopupMenu.PopupMenuItem(action.label);
                item.connect('activate', () => {
                    this._settings.set_string('lid-close-ac-action', action.id);
                });
                this._acItems.push({ id: action.id, item });
                this.menu.addMenuItem(item);
            }

            this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem('On Battery'));

            for (const action of LID_ACTIONS) {
                const item = new PopupMenu.PopupMenuItem(action.label);
                item.connect('activate', () => {
                    this._settings.set_string('lid-close-battery-action', action.id);
                });
                this._batItems.push({ id: action.id, item });
                this.menu.addMenuItem(item);
            }

            this._syncOrnaments();
        }

        _syncOrnaments() {
            const ac  = this._settings.get_string('lid-close-ac-action');
            const bat = this._settings.get_string('lid-close-battery-action');

            for (const { id, item } of this._acItems)
                item.setOrnament(id === ac  ? PopupMenu.Ornament.CHECK : PopupMenu.Ornament.NONE);

            for (const { id, item } of this._batItems)
                item.setOrnament(id === bat ? PopupMenu.Ornament.CHECK : PopupMenu.Ornament.NONE);
        }

        _syncSubtitle() {
            const ac  = this._settings.get_string('lid-close-ac-action');
            const bat = this._settings.get_string('lid-close-battery-action');
            this.subtitle = `AC: ${labelForAction(ac)} · Bat: ${labelForAction(bat)}`;
        }

        destroy() {
            if (this._settingsChangedId) {
                this._settings.disconnect(this._settingsChangedId);
                this._settingsChangedId = null;
            }
            super.destroy();
        }
    }
);

const LidHelperIndicator = GObject.registerClass(
    { GTypeName: 'LidHelperIndicator' },
    class LidHelperIndicator extends QuickSettings.SystemIndicator {
        _init(settings) {
            super._init();
            this.quickSettingsItems.push(new LidHelperToggle(settings));
        }
    }
);

export default class LidHelperExtension {
    enable() {
        this._settings = new Gio.Settings({
            schema_id: 'org.gnome.settings-daemon.plugins.power',
        });

        this._indicator = new LidHelperIndicator(this._settings);
        Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
    }

    disable() {
        this._indicator?.quickSettingsItems.forEach(item => item.destroy());
        this._indicator?.destroy();
        this._indicator = null;
        this._settings = null;
    }
}
