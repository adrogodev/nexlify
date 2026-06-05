import crypto from "node:crypto"

export const getObfuscatedCookie = (key: string): string => {
    const hash = crypto.createHash("sha256").update(key).digest("hex");
    return `_${hash.substring(0, 16)}`
}