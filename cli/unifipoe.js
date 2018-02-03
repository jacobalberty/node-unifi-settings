const fs = require("fs")
    , unifi = require("node-unifi")
    , accessDevice = require("../accessDevice");


try {
    var config = JSON.parse(fs.readFileSync("config.json", "utf-8"));
}
catch (err) {
    if (err.code = 'ENOENT') {
        console.log(err);
        console.log('config.json');
        return;
    } else {
        throw err;
    }
}

var called = process.argv.splice(0, process.execArgv.length + 2).join(' ');
var args = process.argv
if (args.length !== 3) {
    console.log (`usage: ${called} <switch mac> <switch port> <poe mode>`);
    return;
}
var mac = args[0];
var port = args[1];
var mode = args[2];

var controller = new unifi.Controller(config.addr, config.port);

function updateAccessDevice(controller, sites, accessDevice) {
    var changes = accessDevice.getChanges();
    if (Object.keys(changes).length > 0) {
        controller.setDeviceSettingsBase(sites, accessDevice.id, changes);
    }
}

controller.login(config.username, config.password, function(error) {
    controller.getAccessDevices('default', function(error, data) {
        var ad = new accessDevice(data);
        ad.setPoe(port, mode);

        updateAccessDevice(controller, config.site, ad);
    }, mac);
});
