# node-unifi-settings
Helper objects to help with generating valid json objects for changing settings with node-unifi

Right now this is all pre-release. I needed scheduling for poe port status on my unifi switch, since no such functionality existed I
wrote an interface to it. The goal of this project is to make that interface generic enough that I can other features easily.
If you'd like to see something added that you think fits under this project then open an issue and I'll see about doing it.
I published to npmjs perhaps a bit prematurely, you should really be using the github for now.
There is a dependency on [node-unifi](https://www.npmjs.com/package/node-unifi) for now as it's what I do my testing with. But when this is
finished it should generate json suitable for anything that implements the proper apis to post bask to the rest api for unifi.
Also note it currently requires the latest git master of node-unifi as it uses api calls that aren't in the current \(1.2.2\) version. Presumably 1.2.3
will contain those changes so when it is released I will change the dependency to it until this is ready for a real release.

## Installation
node-unifi-settings can be installed using the command

```sh
node install node-unifi-settings
```

## How to use
Functionality is still being decided on and implemented so there isn't a whole lot of documentation right now.
You can see an example of how to change poe port status in the [unifipoe](https://github.com/jacobalberty/node-unifi-settings/blob/master/cli/unifipoe.js) cli tool.
