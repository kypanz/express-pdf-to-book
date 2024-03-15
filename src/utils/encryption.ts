const cryp = require('crypto');

function generateAsymmetricKeys() {
    const { publicKey, privateKey } = cryp.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });
    return { publicKey, privateKey };
}

function generateSymmetricKeys(custom_key: string) {
    const sharedPassword = custom_key;
    const key = cryp.scryptSync(sharedPassword, 'salt', 32); // 32 bytes AES-256
    const iv = cryp.randomBytes(16); // 16 bytes
    return { key, iv };
}

function decryptAsymmetricMessage(privateKey: string, encryptedMessage: string) {
    const bufferMessage = Buffer.from(encryptedMessage, 'base64');
    return cryp.privateDecrypt(privateKey, bufferMessage);
}

function decryptSymmetricMessage(key: string, iv: string, encryptedMessage: string) {
    const decipher = cryp.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let decryptedData = decipher.update(encryptedMessage, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
}

function encryptAsymmetricMessage(publicKey: string, message: string) {
    const encryptedMessage = cryp.publicEncrypt(publicKey, Buffer.from(message));
    return encryptedMessage.toString('base64');
}

function encryptSymmetricMessage(key: string, iv: string, message: string) {
    const cipher = cryp.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let encryptedData = cipher.update(message, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
}

// MasterKey
export function generatePassword(length = 30) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
    }

    return password;
}

export default {
    generateAsymmetricKeys,
    generateSymmetricKeys,
    decryptAsymmetricMessage,
    decryptSymmetricMessage,
    encryptAsymmetricMessage,
    encryptSymmetricMessage
};
