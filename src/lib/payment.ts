import crypto from "crypto";
import CryptoJS from "crypto-js";
import axios from "axios";

// === CONFIG ===
const AES_KEY = process.env.AES_KEY!; // Your AES key
const SIGN_KEY = process.env.SIGN_KEY!; // Your signature key
const MCH_NO = process.env.MCH_NO!; // Your merchant number

// === BUSINESS PAYLOAD (customize as needed) ===

// === Encrypt payload ===
function aesEncrypt(data: any, key: string) {
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
  const iv = CryptoJS.enc.Utf8.parse("0102030405060708");
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), keyUtf8, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString(); // Base64
}

export function decryptPayload(encryptedPayload: string) {
  if (!encryptedPayload) {
    console.error("❌ encryptedPayload is undefined or empty.");
    return null;
  }

  try {
    const keyUtf8 = CryptoJS.enc.Utf8.parse(AES_KEY);
    const iv = CryptoJS.enc.Utf8.parse("0102030405060708");

    // Parse Base64
    const encryptedHexStr = CryptoJS.enc.Base64.parse(encryptedPayload);
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: encryptedHexStr,
    });

    const decrypted = CryptoJS.AES.decrypt(cipherParams, keyUtf8, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      console.error(
        "❌ Decryption returned empty string. Possibly wrong key or corrupted payload."
      );
      return null;
    }

    return JSON.parse(decryptedText);
  } catch (err: any) {
    console.error("❌ Decryption failed:", err.message);
    return null;
  }
}

export function verifySign(payload: any, sign: string) {
  const md5 = crypto
    .createHash("md5")
    .update(payload + SIGN_KEY)
    .digest("hex")
    .toUpperCase();
  return md5 === sign;
}

// === Sign the encrypted payload ===
function generateSign(encryptedPayload: string, signKey: string) {
  return crypto
    .createHash("md5")
    .update(encryptedPayload + signKey)
    .digest("hex")
    .toUpperCase();
}

// === Main function ===
export async function makePayinTransaction(businessPayload: any) {
  try {
    const encryptedPayload = aesEncrypt(businessPayload, AES_KEY);
    const sign = generateSign(encryptedPayload, SIGN_KEY);

    const requestData = {
      mchNo: MCH_NO,
      payload: encryptedPayload,
      sign: sign,
    };

    const response = await axios.post(
      "https://phpay.ipayment.vip/dgateway/ws/trans/nocard/makeOrder",
      requestData,
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("Deposit response : ", response)
    if (response.data.state == "Failed") {
      throw Error;
    }
    const payload = decryptPayload(response.data.payload);
    return payload;
  } catch {
    throw new Error("Deposit Failed! Try again");
  }
}

export async function queryPayinTransaction(tradeNo: string) {
  const businessPayload = {
    versionNo: 1,
    mchNo: MCH_NO,
    tradeNo: tradeNo,
  };

  const encryptedPayload = aesEncrypt(businessPayload, AES_KEY);
  const sign = generateSign(encryptedPayload, SIGN_KEY);

  const requestData = {
    mchNo: MCH_NO,
    payload: encryptedPayload,
    sign: sign,
  };

  try {
    const response = await axios.post(
      "https://phpay.ipayment.vip/dgateway/ws/trans/nocard/orderQuery",
      requestData,
      { headers: { "Content-Type": "application/json" } }
    );

    const payload = decryptPayload(response.data.payload);
    return payload;
  } catch  {
    throw new Error("Fetching Failed!");
  }
}

export async function makePayoutTransaction(businessPayload: any) {
 

  const encryptedPayload = aesEncrypt(businessPayload, AES_KEY);
  const sign = generateSign(encryptedPayload, SIGN_KEY);

  const requestData = {
    mchNo: MCH_NO,
    payload: encryptedPayload,
    sign: sign,
  };

  try {
    const response = await axios.post(
      "https://phpay.ipayment.vip/dgateway/ws/trans/nocard/transferApply",
      requestData,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.state === "Successful" && response.data.payload) {
      const decrypted = decryptPayload(response.data.payload);
      return decrypted;
    } else {
      return Error;
    }
  } catch  {
    throw new Error("Withdrawal Failed! Try again");
  }
}
export async function queryPayoutTransaction(tradeNo: string) {
  const businessPayload = {
    versionNo: 1,
    mchNo: MCH_NO,
    tradeNo: tradeNo,
  };

  const encryptedPayload = aesEncrypt(businessPayload, AES_KEY);
  const sign = generateSign(encryptedPayload, SIGN_KEY);

  const requestData = {
    mchNo: MCH_NO,
    payload: encryptedPayload,
    sign: sign,
  };

  try {
    const response = await axios.post(
      "https://phpay.ipayment.vip/dgateway/ws/trans/nocard/transferQuery",
      requestData,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.state === "Successful" && response.data.payload) {
      const decrypted = decryptPayload(response.data.payload);
      return decrypted;
    } else {
      throw Error;
    }
  } catch  {
    throw new Error("Fatching Failed!");
  }
}

// === Method 5: Institution Account Balance Inquiry ===
export async function inquireAccountBalance() {
  const businessPayload = {
    versionNo: 1,
    mchNo: MCH_NO,
  };

  const encryptedPayload = aesEncrypt(businessPayload, AES_KEY);
  const sign = generateSign(encryptedPayload, SIGN_KEY);

  const requestData = {
    mchNo: MCH_NO,
    payload: encryptedPayload,
    sign: sign,
  };

  try {
    const response = await axios.post(
      "https://phpay.ipayment.vip/dgateway/ws/trans/nocard/accBalQuery",
      requestData,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log(
      "🏦 Account Balance Inquiry Response:\n",
      JSON.stringify(response.data, null, 2)
    );

    if (response.data.state === "Successful" && response.data.payload) {
      const decrypted = decryptPayload(response.data.payload);
      console.log(
        "🔓 Decrypted Account Info:\n",
        JSON.stringify(decrypted, null, 2)
      );
    }
  } catch (error : any) {
    if (error.response) {
      console.error(
        "❌ Account Inquiry API Error:\n",
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.error("❌ Network Error:", error.message);
    }
  }
}
