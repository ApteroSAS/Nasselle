import { generateKeyPair, sign, verifySignature } from "./KeyLib";

describe("KeyLib", () => {
    it("should generate a valid key pair and verify the signature", async () => {
        const { pub, priv } = await generateKeyPair();
        const message = "Hello, world!";
        const signature = await sign(priv, message);
        const isValid = await verifySignature(pub, signature, message);
        expect(isValid).toBe(true);
    });

    it("should not verify a signature with a different public key", async () => {
        const { pub, priv } = await generateKeyPair();
        const message = "Hello, world!";
        const signature = await sign(priv, message);
        const key2 = await generateKeyPair();
        const isValid2 = await verifySignature(key2.pub, signature, message);
        expect(isValid2).toBe(false);
    });
});
