import crypto from "crypto";

//32 bit key
//16 bit IV
export const Encrypt = (input: string, key: string, iv: string) => {
	const algorithm = "aes-256-cbc";
	const cipher = crypto.createCipheriv(
		algorithm,
		Buffer.from(key, "utf8"),
		iv
	);
	let encrypted = cipher.update(input, "utf8", "base64");
	encrypted += cipher.final("base64");
	return encrypted;
};
