'use strict';

module.exports = class accessDevice {
    constructor(device) {
        this._poemodes = ['off', 'passv24', 'auto'];
        this._dirty = [ ];
        this._usedPorts = { };

        this._device = this._dropArray(device);
        this.id = this._device._id;

        if (!this.validate())
            throw `validation failed`;
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
            if (this._device.type === "usw") {
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
