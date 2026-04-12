import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto'

function getKey(): Buffer {
  const secret = process.env.CUSTODIAL_ENCRYPTION_KEY
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === 'development') {
      return scryptSync('dev-insecure-custodial-encryption-key', 'malama-custodial-v1', 32)
    }
    throw new Error('CUSTODIAL_ENCRYPTION_KEY must be set (min 16 chars) for custodial wallets')
  }
  return scryptSync(secret, 'malama-custodial-v1', 32)
}

/** Encrypt hex private key for at-rest storage (in-memory / future DB). */
export function encryptPrivateKeyHex(privateKeyHex: `0x${string}`): string {
  const key = getKey()
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const enc = Buffer.concat([cipher.update(privateKeyHex.slice(2), 'hex'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, enc]).toString('base64url')
}

export function decryptPrivateKeyHex(payload: string): `0x${string}` {
  const key = getKey()
  const buf = Buffer.from(payload, 'base64url')
  const iv = buf.subarray(0, 12)
  const tag = buf.subarray(12, 28)
  const data = buf.subarray(28)
  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)
  const dec = Buffer.concat([decipher.update(data), decipher.final()])
  return (`0x${dec.toString('hex')}`) as `0x${string}`
}
