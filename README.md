# Module Federation Remote Middleware Plugin

This plugin is compatible with "var" (default) type remotes. It allows you to establish a function that runs before the remote is bootstrapped. In this case, the default functionality is to allow the consumer to pass it an encryption key and IV, if it matches what was used at build time, the remote will initialize otherwise it will throw.

## How to use

### Add to webpack

```javascript
const {
	RemoteMiddlewarePlugin,
} = require("@practicaljs/modulefederation-remote-middleware");

RemoteMiddlewarePlugin({
			remoteEntryFilename: "remoteEntry.js",
			containerName: "remote",
			encryptionKey: "T3sxMgCb9r1DeMgsDzRzD3zs6NhBybFM",
			encryptionIV: "6TBsV3h0JyZo1NCR"
		}),
```

```javascript
Using the [webpack advanced-api](https://github.com/module-federation/module-federation-examples/blob/679e278076ce335ba9e0b882df09818831eaf21a/advanced-api/dynamic-remotes/app1/src/App.js#L3), call this method before the factory is called:

//use whatever encryption key and IV you set for building the remote.
		await self["remote_init"](
			"T3sxMgCb9r1DeMgsDzRzD3zs6NhBybFM",
			"6TBsV3h0JyZo1NCR"
		);
```
