import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

const LID_ACTIONS = [
    'suspend',
    'hibernate',
    'nothing',
    'blank',
    'shutdown',
    'lock',
    'logout',
];

const LID_ACTION_LABELS = [
    'Suspend',
    'Hibernate',
    'Do Nothing',
    'Blank Screen',
    'Shut Down',
    'Lock Screen',
    'Log Out',
];

export default class LidHelperPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const powerSettings = new Gio.Settings({
            schema_id: 'org.gnome.settings-daemon.plugins.power',
        });

        const labelModel = new Gtk.StringList();
        for (const label of LID_ACTION_LABELS)
            labelModel.append(label);

        const acRow = new Adw.ComboRow({
            title: 'Lid Close on AC',
            subtitle: 'Action when closing the lid while on AC power',
            model: labelModel,
        });

        const batRow = new Adw.ComboRow({
            title: 'Lid Close on Battery',
            subtitle: 'Action when closing the lid while on battery',
            model: labelModel,
        });

        acRow.selected = Math.max(0, LID_ACTIONS.indexOf(
            powerSettings.get_string('lid-close-ac-action')
        ));
        batRow.selected = Math.max(0, LID_ACTIONS.indexOf(
            powerSettings.get_string('lid-close-battery-action')
        ));

        acRow.connect('notify::selected', () => {
            const idx = acRow.selected;
            if (idx >= 0 && idx < LID_ACTIONS.length)
                powerSettings.set_string('lid-close-ac-action', LID_ACTIONS[idx]);
        });

        batRow.connect('notify::selected', () => {
            const idx = batRow.selected;
            if (idx >= 0 && idx < LID_ACTIONS.length)
                powerSettings.set_string('lid-close-battery-action', LID_ACTIONS[idx]);
        });

        const group = new Adw.PreferencesGroup({ title: 'Lid Close Actions' });
        group.add(acRow);
        group.add(batRow);

        const page = new Adw.PreferencesPage({ title: 'General', icon_name: 'preferences-system-symbolic' });
        page.add(group);

        window.add(page);
    }
}
