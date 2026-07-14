import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { findCurrentUser } from "@/data/user";

const PAGE_SIZE = 10;

export async function GET(req: Request) {
  try {
    const currentUser = await findCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") ?? undefined;
    const search = searchParams.get("search") ?? "";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Default: last 3 days
    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() - 3);
    defaultStart.setHours(0, 0, 0, 0);

    const from = startDate ? new Date(startDate) : defaultStart;
    const to = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : new Date();

    const where: Prisma.BettingRecordWhereInput = {
      userId: currentUser.id,
      createdAt: { gte: from, lte: to },
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    };

    // Fetch one extra to know if there's a next page
    const records = await db.bettingRecord.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: {
        id: true,
        createdAt: true,
        name: true,
        category: true,
        betAmount: true,
        profit: true,
        loss: true,
        status: true,
        orderNo: true,
      },
    });

    const hasMore = records.length > PAGE_SIZE;
    const data = hasMore ? records.slice(0, PAGE_SIZE) : records;
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    // Aggregates for the summary bar (across full date range, no pagination)
    const agg = await db.bettingRecord.aggregate({
      where,
      _sum: { betAmount: true, profit: true, loss: true },
      _count: { id: true },
    });

    const totalBet = Number(agg._sum.betAmount ?? 0);
    const totalProfit = Number(agg._sum.profit ?? 0);
    const totalLoss = Number(agg._sum.loss ?? 0);
    const totalRecords = agg._count.id;
    // Valid bet = total bet (adjust if your schema tracks valid bet separately)
    const validBet = totalBet;
    const profitAndLoss = totalProfit - totalLoss;

    return NextResponse.json({
      records: data.map((r) => ({
        ...r,
        betAmount: Number(r.betAmount),
        profit: r.profit != null ? Number(r.profit) : null,
        loss: r.loss != null ? Number(r.loss) : null,
      })),
      nextCursor,
      hasMore,
      summary: {
        totalBet,
        validBet,
        totalProfit,
        totalLoss,
        profitAndLoss,
        totalRecords,
      },
    });
  } catch (error) {
    console.error("[BETTING_RECORDS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
