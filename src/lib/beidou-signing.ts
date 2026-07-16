import crypto from "crypto";

// Same secret key used for outbound requests — Beidou signs callbacks with it too.
const SECRET_KEY = process.env.BEIDOU_SECRET_KEY ?? "ef2a6df1b059f8096fdb503b3ec18d4a";

/**
 * Removes "sign" plus any null/undefined values from a params object.
 * Does NOT strip empty strings — a field that's present with value ""
 * (e.g. remark: "") must still be included in the signature as "remark=",
 * per the doc's callback examples (payment callback shows "remark=" in the
 * signed plaintext even though remark was "").
 */
export function cleanParams(params) {
  const cleaned = {};
  for (const k of Object.keys(params)) {
    if (k === "sign") continue;
    const v = params[k];
    if (v === undefined || v === null) continue;
    cleaned[k] = v;
  }
  return cleaned;
}

export function buildSign(params, secretKey = SECRET_KEY) {
  const cleaned = cleanParams(params);
  const keys = Object.keys(cleaned).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const joined = keys.map((k) => `${k}=${cleaned[k]}`).join("&");
  const plaintext = `${joined}&${secretKey}`;
  return crypto.createHash("md5").update(plaintext, "utf8").digest("hex");
}

/** Verifies an inbound callback's signature. Returns true/false. */
export function verifySign(params, secretKey = SECRET_KEY) {
  const { sign, ...rest } = params;
  if (!sign) return false;
  const expected = buildSign(rest, secretKey);
  return expected === sign;
}