const threshold = require('shamirs-secret-sharing')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')
const ecies = require('eciesjs')

const keyPair = ec.genKeyPair()
console.log(keyPair.getPublic().encode('hex'));
console.log(keyPair.priv.toString('hex'));

let privateKey = keyPair.priv.toBuffer();
// Split the private key into 5 shares with a threshold of 3
const shares = threshold.split(privateKey, { shares: 5, threshold: 3 })
console.log('Shares:')
shares.forEach((share, i) => console.log(`Share ${i + 1}:`, share.toString('hex')))

// Combine 3 shares to recover the private key
const recoveredPrivateKey = threshold.combine(shares.slice(0, 3))
console.log('Recovered private key:', recoveredPrivateKey.toString('hex'))

// Generate a public/private key pair from the recovered private key
const publicKey = ec.keyFromPrivate(recoveredPrivateKey).getPublic().encode('hex')
console.log(publicKey)
const message = Buffer.from(["1"])
const encryptedMessage = ecies.encrypt(publicKey, message)

const decryptedMessage = ecies.decrypt(recoveredPrivateKey, encryptedMessage)
console.log(decryptedMessage.toString('hex'));

