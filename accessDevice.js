'use strict';
const bytes = require('bytes')
    , prettyMs = require('pretty-ms');

module.exports = class accessDevice {
    constructor(device) {
        this._poemodes = ['off', 'passv24', 'auto'];
        this._deviceTypes = ['uap', 'ugw', 'usw']
        this._dirty = [ ];
        this._usedPorts = { };

        this._device = this._dropArray(device);

        if (!this.validate())
            throw `validation failed`;

        this.id = this._device._id;
        this.type = this._device.type;
        this.name = this._device.name;
        this.ip = this._device.ip;
        this.mac = this._device.mac;
        this.model = this._device.model;
        this.version = this._device.version;

        this.human = true;
    }

    getChanges() {
        var result = { };

        for (var key in this._dirty) {
            var value = this._dirty[key]
            result[value] = this._device[value];
        }
        return result;
    }

    ports(port) {
        port = parseInt(port);

        if (this._usedPorts[port] !== undefined) {
            return this._usedPorts[port];
        }

        if (!(port-1 in this._device.port_table)) {
            throw `port '${port}' does not exist on this switch`;
        }

        var finder = function(element) {
            return element.port_idx === port;
        };

        var device = this._device;

        var tmp = new Port(this, {
            overrides: device.port_overrides.find(finder),
            table: device.port_table.find(finder)
        });
        this._usedPorts[port] = tmp;

        return tmp;
    }

    validate() {
        if (this._device === Object(this._device)) {
            if (this._deviceTypes.indexOf(this._device.type) !== -1) {
                return true;
            }
        }
        return false;
    }

    _dropArray(obj) {
        // We only ever expect to receive our device within an array containing just our object or another nested array
        // So let's just strip off the arrays to get the object
        if (Array.isArray(obj))
            return this._dropArray(obj[0]);
        else
            return obj;
    }

    _markDirty(field) {
        if (this._dirty.indexOf(field) === -1) {
            this._dirty.push(field);
        }
    }

    get uptime() { return this.human ? prettyMs(this._device.uptime*1000) : this._device.uptime; }

    get rxstat() { return this.human ? bytes(this._device.rx_bytes) : this._device.rx_bytes }

    get txstat() { return this.human ? bytes(this._device.tx_bytes) : this._device.tx_bytes }

    get channel() {
        var output = [ ];
        var dev = this._device
        if (dev.radio_table_stats) {
            // Controller 5.7.x
            for(key in dev.radio_table_stats) {
                var radio = dev.radio_table_stats[key];
                output.push(`${radio.channel} (${radio.radio})`);
            }
        } else {
            // Works with controller 5.6.x
            if (dev['ng-channel'])
                output.push(`${dev['ng-channel']} (2.4ghz)`);
            if (dev['na-channel'])
                output.push(`${dev['na-channel']} (5ghz)`);
        }
        return output.join(', ');
    }
}

class Port {
    constructor(parent, data) {
        this.parent = parent;
        this._poemodes = ['off', 'passv24', 'auto'];
        if (data.overrides === undefined) {
            data.overrides = {
                port_idx: data.table.port_idx,
                portconf_id: data.table.portconf_id
            }
            if (parent._device.port_overrides.indexOf(data.overrides) === -1)
                parent._device.port_overrides.push(data.overrides);
        }
        this._data = data;
    }
    set poe_mode(mode) {
        if (this._poemodes.indexOf(mode) === -1) {
            throw `${mode} is not a valid POE mode`;
        }

        if (this._data.table.port_poe === false) {
            throw `port '${this._data.table.port_idx}' does not support poe`;
        }

        if (this.overrides.poe_mode !== mode) {
            this.parent._markDirty('port_overrides');
            this.overrides.poe_mode = mode;
        }
    }
    get poe_mode() {
        return this._data.table.poe_mode;
    }
    get overrides() {
        return this._data.overrides;
    }
    get table() {
        return this._data.table;
    }
}
