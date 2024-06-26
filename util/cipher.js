const CryptoJS = require("crypto-js");
const crypto = require('crypto');

function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return Buffer.from(binary, 'binary').toString('base64');
};

function base64toHEX(base64) {
    var raw = Buffer.from(base64, 'base64').toString('binary');
    var HEX = '';
    for (i = 0; i < raw.length; i++) {
        var _hex = raw.charCodeAt(i).toString(16)
        HEX += (_hex.length == 2 ? _hex : '0' + _hex);
    }
    return HEX.toUpperCase();
};


function decifrarAES(cadena_cifrada, key) {
    var key = CryptoJS.enc.Hex.parse(key);
    var first = CryptoJS.enc.Base64.parse(cadena_cifrada); //cadena_cifrada.clone();
    var second = CryptoJS.enc.Base64.parse(cadena_cifrada); //cadena_cifrada;
    first.words = first.words.slice(0, 4);
    second.words = second.words.slice(4, second.length);
    first.sigBytes = 16;
    second.sigBytes = second.sigBytes - 16;
    second = CryptoJS.enc.Base64.stringify(second);
    var cipherParams = {
        iv: first,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }
    var decrypted = CryptoJS.AES.decrypt(second, key, cipherParams);
    decrypted = decrypted.toString(CryptoJS.enc.Utf8);
    return decrypted;
};


function cifrarAES(data, key) {
    try {
        let buf = crypto.randomBytes(16);
        let buffer_b64 = _arrayBufferToBase64(buf);
        let iv = CryptoJS.enc.Hex.parse(base64toHEX(buffer_b64));

        var key = CryptoJS.enc.Hex.parse(key);

        let cipherParams = {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }

        let encrypted = CryptoJS.AES.encrypt(data, key, cipherParams);

        let merge = encrypted.iv.clone();
        merge.concat(encrypted.ciphertext);
        merge = CryptoJS.enc.Base64.stringify(merge);

        return merge;
    } catch (error) {
        return 'Tu llave es incorrecta: ' + error;
    }
};

module.exports.cifrarAES = cifrarAES;
module.exports.decifrarAES = decifrarAES;