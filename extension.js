// extension root object
const Me = imports.misc.extensionUtils.getCurrentExtension();

// import internal modules
const _config = Me.imports._config;

// aliases for used modules
const St = imports.gi.St;
const Lang = imports.lang;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;
const GLib = imports.gi.GLib;
const Util = imports.misc.util;

// StatusIcon manager
let statusIcon;
let trayIcon = 'icon-services';

// My PopupSwitchMenu
let menuItems = [];
let toggleFunctions = [];


/*
 * Indicator class.
 *
 * Creates an actor in the StatusArea panel. Provides menu for manipulating
 * visiblity of other icons.
 */
const Indicator = new Lang.Class({
    Name: 'Indicator',
    Extends: PanelMenu.Button,

    /**
     * Creates an actor object, which can be added to the status area,
     * Creates an actor object, which can be added to the status area,
     *
     * @constructor
     * @this {Indicator}
     * @param {string} icon an icon name
     */
    _init: function (icon) {

        this.parent(0.0, _config.EXTENSION_NAME);

        statusIcon = new St.Icon({
            icon_name: icon,
            style_class: trayIcon
        });

        this.actor.add_actor(statusIcon);

        //this._settings = Convenience.getSettings();
        this._createMenu();
    },

    /**
     * Creates menu for the Indicator. It will be popuped on RMB click.
     *
     * @private
     * @this {Indicator}
     */
    _createMenu: function () {
        for (let i in _config.SERVICES_ARRAY) {

            let code = _config.SERVICES_ARRAY[i].service;
            let label = _config.SERVICES_ARRAY[i].label;

            toggleFunctions[i] = function () {
                return toggleService(code);
            };

            menuItems[i] = new PopupMenu.PopupSwitchMenuItem(label, isServiceActive(code));
            menuItems[i].code = code;
            menuItems[i].statusAreaKey = label;
            menuItems[i].connect('toggled', toggleFunctions[i]);

        }

        for (let m in menuItems) {
            this.menu.addMenuItem(menuItems[m]);
        }
    },

});


/*
 * Extension definition.
 */

function Extension() {
    this._init();
}

Extension.prototype = {
    _init: function () {
        this._indicator = null;
    },

    enable: function () {
        this._indicator = new Indicator('');
        Main.panel.addToStatusArea(_config.EXTENSION_NAME, this._indicator);
    },


    disable: function () {
        this._indicator.destroy();
        this._indicator = null;
    }

};


/**
 * Entry point.
 *
 * Should return an object with callable `enable` and `disable` properties.
 */

// A JSON Object that keeps strings -
//Useful for creating settings


function init() {
    return new Extension();
}


function isServiceActive(code) {
    // Get current status of apache service
    let [resApache, out] = GLib.spawn_command_line_sync("systemctl is-active " + code);
    let outString = out.toString().replace(/(\r\n|\n|\r)/gm, "");
    return outString === "active";
}

let toggleService = function (code) {

    let action = "start";
    if (isServiceActive(code)) {
        action = "stop";
    }

    let cmd = _config.PKEXEC_PATH + ' systemctl ' + action + ' ' + code;

    Util.trySpawnCommandLine(cmd);

    if (action === "start") {
        if (isServiceActive(code)) {
            Main.notify("Service " + code + " is now on");
        } else {
            Main.notify("Service " + code + " couldn't be activated");
        }
    } else {
        if (!isServiceActive(code)) {
            Main.notify("Service " + code + " is now off");
        } else {
            Main.notify("Service " + code + " couldn't be deactivated");
        }
    }

    refreshUI();

}


function refreshUI() {
    refreshStatusIcon();
    refreshSwitchButton();
}

function refreshStatusIcon() {
   // statusIcon.set_property("style_class", trayIcon);
}

function refreshSwitchButton() {
    for (let i in _config.SERVICES_ARRAY) {
        menuItems[i].setToggleState(isServiceActive(_config.SERVICES_ARRAY[i].service));
    }
}
