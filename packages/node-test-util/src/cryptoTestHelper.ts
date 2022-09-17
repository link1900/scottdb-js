import { generateKeyPairSync } from "crypto";

let privateKey: string | undefined;
let publicKey: string | undefined;

export function generateRSA256KeyPair() {
  return generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem"
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: "test"
    }
  });
}

export function getTestRSAPrivateKey() {
  if (!privateKey) {
    const keys = generateRSA256KeyPair();
    privateKey = keys.privateKey;
    publicKey = keys.publicKey;
  }
  return privateKey;
}

export function getTestRSAPublicKey() {
  if (!publicKey) {
    const keys = generateRSA256KeyPair();
    privateKey = keys.privateKey;
    publicKey = keys.publicKey;
  }
  return publicKey;
}
