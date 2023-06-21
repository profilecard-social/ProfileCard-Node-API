import bcrypt from "bcrypt"
import crypto from "crypto"

export function generateNewToken() {
    return binToHex(generateRandomBytes(50))
}

export function generateRandomBytes(length) {
    return crypto.randomBytes(length)
}

export function generatePasswordHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export function comparePassword(plainPasword, hash) {
    return bcrypt.compareSync(plainPasword, hash);
}

export function binToHex(bytes) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Linuxworld
    // *     example 1: bin2hex('Kev');
    // *     returns 1: '4b6576'
    // *     example 2: bin2hex(String.fromCharCode(0x00));
    // *     returns 2: '00'
    var i, f = 0,
        a = [];

    bytes += '';
    f = bytes.length;

    for (i = 0; i < f; i++) {
        a[i] = bytes.charCodeAt(i).toString(16).replace(/^([\da-f])$/, "0$1");
    }

    return a.join('');
}
