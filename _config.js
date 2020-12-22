// extension name
// used as identifier when adding to status area
const GLib = imports.gi.GLib;

const EXTENSION_NAME = 'Services Panel';

// keys for access to gsettings
const GSETTINGS_KNOWN = 'known';
const GSETTINGS_HIDDEN = 'hidden';
const GSETTINGS_ISINDICATORSHOWN = 'is-indicator-shown';

const PKEXEC_PATH = GLib.find_program_in_path('pkexec');

/**
 * SERVICES CONSTANT, HERE IS WHER EYOU MODIFY YOUR SERVICES
 * @type {({service: string, label: string}|{service: string, label: string}|{service: string, label: string}|{service: string, label: string}|{service: string, label: string})[]}
 */
const SERVICES_ARRAY = [
    {
        "label": "Nginx",
        "service": "nginx"
    },
    {
        "label": "PHP7.2 FPM",
        "service": "php7.2-fpm"
    },
    {
        "label": "PHP7.3 FPM",
        "service": "php7.3-fpm"
    },
    {
        "label": "PHP7.4 FPM",
        "service": "php7.4-fpm"
    },
    {
        "label": "PHP8.0 FPM",
        "service": "php8.0-fpm"
    },
    {
        "label": "MySQL",
        "service": "mysql"
    },
    {
        "label": "Redis",
        "service": "redis-server"
    },
    {
        "label": "ElasticSearch",
        "service": "elasticsearch"
    },
    {

        "label": "Varnish",
        "service": "varnish"
    }
];

