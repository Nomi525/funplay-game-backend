import moment from 'moment-timezone';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { configService } from 'src/database/configurations/database.config';
import * as CryptoJS from 'crypto-js';
import Decimal from 'decimal.js';

// const key =
//   'a6dfc106fadd4849e8b23759afea1b86c6c4c4b782c2cf08335c61dc4610fae5efe05ee361a4850f56ddb9457a96bbe01d2820d5106851db64cf210f70ec5e98';
// const secretCryptoKey: any = crypto
//   .createHash('sha256')
//   .update(String(key))
//   .digest('base64')
//   .slice(0, 32);
// const iv = crypto.randomBytes(16);

const key =
  'a6dfc106fadd4849e8b23759afea1b86c6c4c4b782c2cf08335c61dc4610fae5efe05ee361a4850f56ddb9457a96bbe01d2820d5106851db64cf210f70ec5e98';
// Compute SHA-256 hash
const secretCryptoKey = CryptoJS.SHA256(String(key))
  .toString(CryptoJS.enc.Base64)
  .slice(0, 32);
const iv: any = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);

export const helperUtil = {
  NODE_DATE_FORMAT: 'DD-MMM-YYYY',
  ZOHO_DATE_FORMAT: 'dd-MMM-yyyy',
  JwtSecretKey: String(configService.getJwtSecretKey()),

  toDisplayString: (date: Date): string => {
    const formattedDate: any = moment(date)
      .tz('Asia/Kolkata')
      .format(helperUtil.NODE_DATE_FORMAT);
    return formattedDate;
  },

  referralCode: (length: any) => {
    const codeLength = length;
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      code += chars.charAt(randomIndex);
    }
    return code;
  },

  passwordCompare: async (plainPassword: any, hashPassword: any) => {
    return await bcrypt.compare(plainPassword, hashPassword);
  },

  hashedPassword: async (password: any) => {
    console.log(typeof password);
    console.log({ password });

    const salt = await bcrypt.genSalt(10);
    console.log({ salt });

    return await bcrypt.hash(password.toString(), salt);
  },

  generateToken: ({ payload }) => {
    return jwt.sign(payload, helperUtil.JwtSecretKey, { expiresIn: '24h' });
  },

  generateAdminToken: ({ payload }) => {
    return jwt.sign(payload, helperUtil.JwtSecretKey, { expiresIn: '24h' });
  },

  generateOtp: () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
  },
  // Encryption function
  encryptObject: (object: any) => {
    // Convert the object to a string
    const objectString = JSON.stringify(object);
    // Encrypt using AES-256-CBC
    const encrypted = CryptoJS.AES.encrypt(objectString, secretCryptoKey, {
      iv: iv,
    }).toString();
    return encrypted;
  },

  // Decryption function
  decryptObject: (encryptedString: any) => {
    try {
      // Create a decryption object with AES-256-CBC
      const decrypted = CryptoJS.AES.decrypt(encryptedString, secretCryptoKey, {
        iv: iv,
      });
      // Convert the decrypted data to a UTF-8 string
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      // Parse the decrypted JSON string
      const decryptedObject = JSON.parse(decryptedString);
      return decryptedObject;
    } catch (error) {
      // Handle decryption errors
      return false;
    }
  },

  minusLargeSmallValue: (largeNumberValue: any, smallNumberValue: any) => {
    const largeNumber = new Decimal(largeNumberValue);
    const smallNumber = new Decimal(smallNumberValue);
    return largeNumber.minus(smallNumber);
  },

  plusLargeSmallValue: (largeNumberValue: any, smallNumberValue: any) => {
    const largeNumber = new Decimal(largeNumberValue);
    const smallNumber = new Decimal(smallNumberValue);
    return largeNumber.plus(smallNumber);
  },

  multiplicationLargeSmallValue: (
    largeNumberValue: any,
    smallNumberValue: any,
  ) => {
    const largeNumber = new Decimal(largeNumberValue);
    const smallNumber = new Decimal(smallNumberValue);
    return largeNumber.times(smallNumber);
  },

  checkDecimalValueGreaterThanOrEqual: (
    largeNumberValue: any,
    smallNumberValue: any,
  ) => {
    const largeNumber = new Decimal(largeNumberValue);
    const smallNumber = new Decimal(smallNumberValue);
    return largeNumber.greaterThanOrEqualTo(smallNumber);
  },

  checkLargeDecimalValueGreaterThan: (
    largeNumberValue: any,
    smallNumberValue: any,
  ) => {
    const largeNumber = new Decimal(largeNumberValue);
    const smallNumber = new Decimal(smallNumberValue);
    return largeNumber.greaterThan(smallNumber);
  },

  checkLargeDecimalValueLessThan: (
    largeNumberValue: any,
    smallNumberValue: any,
  ) => {
    const largeNumber = new Decimal(largeNumberValue);
    const smallNumber = new Decimal(smallNumberValue);
    return largeNumber.lessThan(smallNumber);
  },

  checkLargeDecimalValueEquals: (
    largeNumberValue: any,
    smallNumberValue: any,
  ) => {
    const largeNumber = new Decimal(largeNumberValue);
    const smallNumber = new Decimal(smallNumberValue);
    return largeNumber.equals(smallNumber);
  },
};
