import { createUnplugin } from "unplugin";
import fs from "fs";
import { Encrypt } from "./server-crypt";

export type RemoteMiddlewareConfig = {
	remoteEntryFilename: string;
	containerName: string;
};

export const RemoteMiddlewarePlugin = createUnplugin(
	(options: RemoteMiddlewareConfig) => {
		const { remoteEntryFilename, containerName } = options;

		return {
			name: "modulefederation/remote-middleware",
			webpack(compiler) {
				//@ts-ignore
				compiler.hooks.afterEmit.tap("Replace", (compilation) => {
					const outputPath = compiler.options.output.path;
					const assetFileName = remoteEntryFilename;
					const { ConcatSource, RawSource, ReplaceSource } =
						compiler.webpack.sources;

					const asset = compilation.getAsset(assetFileName);

					const existingSource = new RawSource(
						fs.readFileSync(`${outputPath}/${assetFileName}`)
					);

					const digest = Encrypt(
						containerName,
						"T3sxMgCb9r1DeMgsDzRzD3zs6NhBybFM",
						"6TBsV3h0JyZo1NCR"
					);

					const replaceSource = new ReplaceSource(existingSource);
					replaceSource.replace(
						0,
						`var ${containerName};`.length,
						`var ${containerName};\nself['${containerName}_init'] = 
							(k, i) => { 
								const init = `
					);
					replaceSource.replace(
						existingSource.source().length - 4,
						existingSource.source().length - 1,
						`;\nreturn new Promise((resolve, reject) => {
								const key = makeBuffer(k);
								const iv = makeBuffer(i);
							
								window.crypto.subtle.importKey(
									"raw",
									key,
									{ name: "AES-CBC" },
									false,
									["decrypt"]
								).then(cryptoKey => {
										window.crypto.subtle.decrypt(
											{
												name: "AES-CBC",
												iv: iv,
											},
											cryptoKey,
											base64ToArrayBuffer('${digest}')
										).then(decryptedBuffer => {
											if ("remote" === new TextDecoder().decode(decryptedBuffer)) {
												init();
												resolve();
											} else {
												reject();
											}
										});
								});
							
								function makeBuffer(input) {
									const encoder = new TextEncoder();
									return encoder.encode(input);
								}
							
								function base64ToArrayBuffer(base64) {
									const binaryString = window.atob(base64);
									const bytes = new Uint8Array(binaryString.length);
									for (let i = 0; i < binaryString.length; i++) {
										bytes[i] = binaryString.charCodeAt(i);
									}
									return bytes;
								}
						\n})\n}`
					);

					compilation.updateAsset(asset.name, replaceSource);

					fs.writeFileSync(
						`${outputPath}/${assetFileName}`,
						replaceSource.source()
					);
				});
			},
		};
	}
);

export default RemoteMiddlewarePlugin;
