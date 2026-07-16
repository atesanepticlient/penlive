import { verifySign } from "@/lib/beidou-signing";

/**
 * Collection (deposit / pay-in) callback.
 * Beidou POSTs here when a deposit order's status changes.
 *
 * Fields per the doc:
 *   merchantId, orderId, transAmt, createTime, merchantOrderId,
 *   orderStatus (1 pending / 3 completed / 4 refunded / 5 failed),
 *   payTime, payType, standbyObject, remark, signType, sign
 *
 * IMPORTANT:
 * - Must respond with the literal text "success" (not JSON) or Beidou
 *   will retry up to 8 times (10s, 30s, 1m, 5m, 10m, 30m, 1h, 4h).
 * - Must be idempotent — the same callback can legitimately arrive more
 *   than once (retries, or Beidou re-sending), so re-processing an
 *   already-completed order should be a safe no-op.
 * - "The callback amount may differ from the order amount" for some
 *   channels — always trust transAmt from the callback as the actual
 *   amount paid, not the amount you originally requested.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    // Malformed body — nothing useful to do, don't say "success".
    return new Response("bad request", { status: 400 });
  }

  if (!verifySign (body)) {
    console.error(
      "Beidou collection callback: signature verification failed",
      body,
    );
    return new Response("invalid signature", { status: 400 });
  }

  const {
    merchantId,
    orderId,
    merchantOrderId,
    orderStatus,
    transAmt,
  
  } = body;

  try {
    // TODO: replace with your real order lookup/update.
    // Look the order up by merchantOrderId (the ID you generated when
    // calling createCollectionOrder), not orderId (Beidou's own ID),
    // since merchantOrderId is what your system already knows about.
    //
    // await markDepositOrder({
    //   merchantOrderId,
    //   beidouOrderId: orderId,
    //   status: Number(orderStatus), // 1 pending, 3 completed, 4 refunded, 5 failed
    //   amount: transAmt,            // trust this over the originally requested amount
    //   payType: Number(payType),
    //   payTime,
    //   remark,
    // });

    console.log("Collection callback processed", {
      merchantId,
      merchantOrderId,
      orderId,
      orderStatus,
      transAmt,
    });
  } catch (err) {
    // Processing failed on our end — don't return "success", so Beidou
    // retries and gives us another chance once whatever broke is fixed.
    console.error("Failed to process collection callback", err);
    return new Response("processing error", { status: 500 });
  }

  // Beidou requires this exact literal response body to stop retrying.
  return new Response("success", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
