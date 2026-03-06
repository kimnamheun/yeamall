import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 1) {
    return NextResponse.json([]);
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { origin: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      thumbnailUrl: true,
      price: true,
      salePrice: true,
    },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
