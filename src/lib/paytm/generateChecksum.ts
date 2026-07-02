import crypto from 'crypto';

const IV = '@@@@&&&&####$$$$';

export class PaytmChecksum {
  static encrypt(input: string, key: string): string {
    const cipher = crypto.createCipheriv('aes-128-cbc', key, IV);
    let encrypted = cipher.update(input, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  static decrypt(encrypted: string, key: string): string {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, IV);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  static generateSignature(params: Record<string, string>, key: string): string {
    const data = PaytmChecksum.getStringByParams(params);
    return PaytmChecksum.calculateChecksum(data, key);
  }

  static verifySignature(params: Record<string, string>, key: string, checksum: string): boolean {
    const paytmParams = { ...params };
    
    if (paytmParams.CHECKSUMHASH) {
      delete paytmParams.CHECKSUMHASH;
    }
    
    const data = PaytmChecksum.getStringByParams(paytmParams);
    return PaytmChecksum.verifySignatureByString(data, key, checksum);
  }

  static async generateSignatureByString(params: string, key: string): Promise<string> {
    return PaytmChecksum.calculateChecksum(params, key);
  }

  static verifySignatureByString(params: string, key: string, checksum: string): boolean {
    const paytmHash = PaytmChecksum.decrypt(checksum, key);
    const salt = paytmHash.substring(paytmHash.length - 4, paytmHash.length);
    return paytmHash === PaytmChecksum.calculateHash(params, salt);
  }

  private static generateRandomString(length: number): string {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  }

  private static getStringByParams(params: Record<string, string>): string {
    const keys = Object.keys(params).sort();
    let data = '';
    
    keys.forEach((key) => {
      const value = params[key] ? params[key].toString() : '';
      if (value.toLowerCase() !== 'null') {
        data += value + '|';
      } else {
        data += '|';
      }
    });
    
    return data;
  }

  private static calculateHash(params: string, salt: string): string {
    const finalString = params + '|' + salt;
    return crypto.createHash('sha256').update(finalString).digest('hex') + salt;
  }

  private static calculateChecksum(params: string, key: string): string {
    const salt = PaytmChecksum.generateRandomString(4);
    const hashString = PaytmChecksum.calculateHash(params, salt);
    return PaytmChecksum.encrypt(hashString, key);
  }
}
