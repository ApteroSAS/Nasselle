import { generateKeyPair, sign, verifySignature } from "./KeyLib";

// Usage example
(async () => {
    const { pub, priv } = await generateKeyPair();

    const message = "Hello, world!";
    const signature = await sign(priv, message);

    const isValid = await verifySignature(pub, signature, message);
    console.log("Is valid:", isValid);

    const key2 = await generateKeyPair();
    const isValid2 = await verifySignature(key2.pub, signature, message);
    console.log("Is valid:", isValid2);
})();