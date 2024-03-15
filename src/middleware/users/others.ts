export function removeUnecesaryProperties(dataUser: object) {
    if (dataUser) {
        delete (dataUser as any).hash;
        delete (dataUser as any).salt;
        delete (dataUser as any).encrypted_private_key_wallet;
        delete (dataUser as any).rsa_priv_key;
    }
    return dataUser;
}
