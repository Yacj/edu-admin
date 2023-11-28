import CryptoJS from 'crypto-js'

// 用于描述encryptParam对象形状的接口
interface EncryptParam {
  k: string
  iv: string
}

// 加密参数的配置
export const encryptParam: EncryptParam = {
  k: 'w3N3QpJHz2QrM19T',
  iv: 'DkZGisiQPmtwq5uX',
}

/**
 * 包含加密和解密方法的对象。
 * @namespace cryptoData
 */
const cryptoData = {
  /**
   * 使用AES加密算法加密给定的密文。
   *
   * @param {string} cipher - 要加密的字符串。
   * @returns {string} 加密后的字符串。
   */
  encrypt: (cipher: string): string => {
    const key = CryptoJS.enc.Latin1.parse(encryptParam.k)
    const iv = CryptoJS.enc.Latin1.parse(encryptParam.iv)
    const srcs = CryptoJS.enc.Utf8.parse(cipher)
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    return encrypted.toString()
  },

  /**
   * 使用AES解密算法解密给定的密文。
   *
   * @param {string} cipher - 要解密的字符串。
   * @returns {string} 解密后的字符串。
   */
  decrypt: (cipher: string): string => {
    const result = CryptoJS.AES.decrypt(cipher, CryptoJS.enc.Utf8.parse(encryptParam.k), {
      iv: CryptoJS.enc.Utf8.parse(encryptParam.iv || ''),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    return CryptoJS.enc.Utf8.stringify(result)
  },
}
export default cryptoData
