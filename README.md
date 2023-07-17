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
