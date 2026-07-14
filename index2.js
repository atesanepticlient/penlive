import axios from "axios";
import crypto from "crypto";

const BASE_URL = "https://staging-api.paydirectconnect.com/fund"; // Test
// const BASE_URL = "https://api.paydirectconnect.com/fund"; // Prod

const COMPANY_CODE = "BETON001";
const MERCHANT_CODE = "4gab9tms5h";
const USERNAME = "BETONGAMEBDT";
const PASSWORD = "Oc(1@zya"; //Prod
const SECRET_KEY = "op5qqu5ev8fhpgpnuec8"; 

function md5(s) {
  return crypto.createHash("md5").update(s, "utf8").digest("hex");
}

function genReference() {
  return `REF-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function nowYYYYmmddHHMMss() {
  const d = new Date();
  const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const findName = async () => {
  const response = (await axios.get("https://randomuser.me/api/")).data;
  const fullName =
    response.results[0].name.first + " " + response.results[0].name.last;
  return fullName;
};
/**
 * Deposit request
 * @param {object} opts
 * @param {'json'|'form'} [opts.encoding='json'] - switch to 'form' if server ignores JSON body
 */
export async function depositRequest() {
  // Generate values required by API (spec requires yyyy-MM-dd HH:mm:ss)
  const reference = genReference();
  const transactionTime = nowYYYYmmddHHMMss();

  // Basic validations (fast fail if anything is missing)
  const required = {
    merchantCode: MERCHANT_CODE,
    username: USERNAME,
    ipAddress: "103.185.25.210",
    currencyCode: "BDT",
    amount: 2000,
    reference,
    transactionTime,
    returnUrl: "https://betongame-8856.top/",
    notifyUrl: "https://betongame-8856.top/notify",
    paymentMethod: 1,
    paymentCode: "bkash",
    secretKey: SECRET_KEY,
  };
  for (const [k, v] of Object.entries(required)) {
    if (v === undefined || v === null || v === "") {
      console.log(k, v);
      throw new Error(`Missing required field: ${k}`);
    }
  }

  // MD5 per spec: merchantCode + username + ipAddress + currencyCode + amount + reference + transactionTime + returnUrl + notifyUrl + paymentMethod + paymentCode + secretKey
  const securityString =
    `${MERCHANT_CODE}${USERNAME}${ipAddress}${currencyCode}${amount}` +
    `${reference}${transactionTime}${returnUrl}${notifyUrl}` +
    `${paymentMethod}${paymentCode}${SECRET_KEY}`;
  const securityToken = md5(securityString);

  const payload = required;

  try {
    console.log({ md5 });
    const url = `${BASE_URL}/deposit`;

    // Try JSON (what the doc implies), or switch to form if the server is dropping fields.
    const config =
      encoding === "form"
        ? {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json",
            },
            transformRequest: [(data) => new URLSearchParams(data).toString()],
          }
        : {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          };

    // Helpful debug: log keys & encoding (but NOT secretKey)

    const { data } = await axios.post(url, payload, config);
    console.log({ data });
    return data;
  } catch (error) {
    // Show server payload if available; also surface our reference so you can trace on their side.
    const server = error.response?.data;
    console.error(
      "Deposit API Error (ref:",
      reference,
      "):",
      server || error.message
    );
    throw error;
  }
}

// depositRequest();

export async function getMerchantBalance() {
  const securityToken = md5(`${MERCHANT_CODE}${SECRET_KEY}`);

  const url = `${BASE_URL}/get-merchant-balance`;
  try {
    const {data} = await axios.get(url, {
      params: {merchantCode : MERCHANT_CODE, securityToken },
      // If your edge/network mungs GET bodies, keep it strictly as query params.
    });
    console.log({data})
    // Expected on success: { currentBalance: <Decimal> }
    return data;
  } catch (error) {
    console.log("ERROR : ", error.message)
    // console.error(
    //   "Get Merchant Balance error:",
    //   error.response?.data || error.message
    // );
    // throw error;
  }
}

getMerchantBalance()


/**
 * Withdraw API Request
 * @param {Object} opts
 * @param {string} opts.merchantCode
 * @param {string} opts.currencyCode
 * @param {number|string} opts.amount
 * @param {number} opts.paymentMethod - 1 = Ewallet
 * @param {string} opts.paymentCode - e.g., "bkash", "nagad"
 * @param {string} opts.recipientName
 * @param {string} opts.recipientAccount
 * @param {string} opts.notifyUrl
 * @param {string} opts.secretKey
 * @param {string} [opts.remarks]
 */
export async function withdrawRequest() {
  const reference = genReference();
  const transactionTime = nowYYYYmmddHHMMss();

  const currencyCode = "BDT";
  const amount = 25000;
  const paymentMethod = 1;
  const paymentCode = "bkash";
  const recipientName = await findName();
  const recipientAccount = "01735156550";
  const notifyUrl = "https://treadongame-8856.top/notify-withdraw";

  // Create MD5 security token per API spec
  const securityString = `${MERCHANT_CODE}${currencyCode}${amount}${reference}${transactionTime}${paymentMethod}${paymentCode}${recipientName}${recipientAccount}${notifyUrl}${SECRET_KEY}`;
  const securityToken = md5(securityString);

  const payload = {
    merchantCode: MERCHANT_CODE,
    currencyCode,
    amount,
    reference,
    transactionTime,
    paymentMethod,
    paymentCode,
    recipientName,
    recipientAccount,
    notifyUrl,
    remarks: "User Payout",
    securityToken,
  };

  try {
    const { data } = await axios.post(`${BASE_URL}/withdraw`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    return data;
  } catch (error) {
    console.error("Withdraw API Error:", error.response?.data || error.message);
    throw error;
  }
}

// (async () => {
//   try {
//     const res = await withdrawRequest();

//     console.log("Withdraw Result:", res);
//   } catch (e) {
//     console.error("Withdraw Failed:", e.message);
//   }
// })();
