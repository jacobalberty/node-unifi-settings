# node-unifi-settings
Helper objects to help with generating valid json objects for changing settings with node-unifi

Right now this is all pre-release. I needed scheduling for poe port status on my unifi switch, since no such functionality existed I
wrote an interface to it. The goal of this project is to make that interface generic enough that I can other features easily.
If you'd like to see something added that you think fits under this project then open an issue and I'll see about doing it.
I published to npmjs perhaps a bit prematurely, you should really be using the github for now.
This package generates json objects suitable for using with the latest github master of [node-unifi](https://www.npmjs.com/package/node-unifi).

## Installation
node-unifi-settings can be installed using the command

```sh
node install node-unifi-settings
```

## How to use
Functionality is still being decided on and implemented so there isn't a whole lot of documentation right now.
You can see a functionality example in the [node-unificli](https://github.com/jacobalberty/node-unificli/blob/master) tool.
