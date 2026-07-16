import { verifySign } from "@/lib/beidou-signing";

/**
 * Payment (withdrawal / payout) callback.
 * Beidou POSTs here when a withdrawal order's status changes.
 *
 * Fields per the doc:
 *   merchantId, orderId, transAmt (actual withdrawal amount), merchantOrderId,
 *   orderStatus (1 pending / 2 frozen / 3 completed / 4 refunded / 5 failed),
 *   payType, standbyObject (JSON string, e.g. {"refNo":"..."}), remark,
 *   signType, sign
 *
 * Same rules as the collection callback:
 * - Respond with the literal text "success" or Beidou retries up to 8 times.
 * - Must be idempotent.
 * - transAmt here is the *actual* withdrawal amount — trust it over what
 *   you originally requested.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("bad request", { status: 400 });
  }

  if (!verifySign(body)) {
    console.error(
      "Beidou payment callback: signature verification failed",
      body,
    );
    return new Response("invalid signature", { status: 400 });
  }

  // const {
 
  //   standbyObject,

  // } = body;

  // standbyObject is a JSON string (e.g. '{"refNo":"4022805544324"}').
  // Parse it defensively — it may be "{}" or empty.
  // let standby = {};
  // try {
  //   standby = standbyObject ? JSON.parse(standbyObject) : {};
  // } catch {
  //   standby = {};
  // }

  try {
    // TODO: replace with your real order lookup/update.
    // Look the order up by merchantOrderId (the ID you generated when
    // calling createPaymentOrder), not orderId (Beidou's own ID).
    //
    // await markWithdrawalOrder({
    //   merchantOrderId,
    //   beidouOrderId: orderId,
    //   status: Number(orderStatus), // 1 pending, 2 frozen, 3 completed, 4 refunded, 5 failed
    //   amount: transAmt,            // actual withdrawal amount, trust this
    //   payType: Number(payType),
    //   refNo: standby.refNo,
    //   remark,
    // });

  
  } catch (err) {
    console.error("Failed to process payment callback", err);
    return new Response("processing error", { status: 500 });
  }

  return new Response("success", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
