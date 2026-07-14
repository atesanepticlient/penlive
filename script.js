/**
 * I-GAMING SoftAPI – Pure Functions
 * --------------------------------
 * No Express
 * No HTTP server
 * Just reusable functions
 */

import crypto from "crypto";
import axios from "axios";

// ================== CONFIG ==================
const SOFTAPI_SERVER_URL = "https://igamingapis.live/api/v1";
const API_TOKEN = "3753715335206ddb72c9825777933645";
const SECRET_KEY = "dc279a27da63d49427c4de2e47d9b8c2"; // MUST be 32 chars
// ============================================

// ================== AES-256-ECB ENCRYPT ==================
function encryptPayloadECB(data, secretKey) {
  if (secretKey.length !== 32) {
    throw new Error("Secret key must be exactly 32 characters");
  }

  const json = JSON.stringify(data);

  const cipher = crypto.createCipheriv(
    "aes-256-ecb",
    Buffer.from(secretKey),
    null,
  );

  cipher.setAutoPadding(true);

  let encrypted = cipher.update(json, "utf8", "base64");
  encrypted += cipher.final("base64");

  return encrypted;
}
// ========================================================

// ================== 1️⃣ LAUNCH GAME ==================
async function launchGame({
  userId,
  balance,
  gameUid,
  returnUrl,
  callbackUrl,
  currencyCode = "BDT",
  language = "bn",
}) {
  const payload = {
    user_id: String(userId),
    balance: Number(balance),
    game_uid: String(gameUid),
    token: API_TOKEN,
    timestamp: Date.now(),
    return: returnUrl,
    callback: callbackUrl,
    currency_code: currencyCode,
    language,
  };

  console.log(payload);
  const encryptedPayload = encryptPayloadECB(payload, SECRET_KEY);

  const url =
    `${SOFTAPI_SERVER_URL}?payload=` +
    encodeURIComponent(encryptedPayload) +
    `&token=` +
    encodeURIComponent(API_TOKEN);

  const response = await axios.get(url);

  /**
   * Expected response:
   * {
   *   code: 0,
   *   msg: "Game launched successfully",
   *   data: { url: "https://igamingapis.live/launch?..." }
   * }
   */
  console.log({ data: response.data });
  return response.data;
}
// ========================================================

// ================== 2️⃣ HANDLE CALLBACK ==================
function handleGameCallback(callbackPayload, currentBalance) {
  if (!callbackPayload) {
    return {
      credit_amount: -1,
      error: "Invalid JSON",
    };
  }

  const betAmount = Number(callbackPayload.bet_amount || 0);
  const winAmount = Number(callbackPayload.win_amount || 0);

  /**
   * new_balance = old_balance - bet + win
   */
  const newBalance = currentBalance - betAmount + winAmount;

  /**
   * SoftAPI expects:
   * credit_amount = max(0, bet - win)
   */
  const creditAmount = Math.max(0, betAmount - winAmount);

  return {
    new_balance: newBalance,
    credit_amount: creditAmount,
    timestamp: Date.now(),
  };
}
// ========================================================

launchGame({
  userId: "23213",
  balance: 500,
  gameUid: 784512,
  returnUrl: "https://playzone.com/return",
  callbackUrl: "https://playzone.com/callback.php",
});
