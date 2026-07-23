import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const store = await prisma.store.create({
      data: {
        name: data.name,
        address: data.address,
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng),
        googlePlaceId: data.googlePlaceId,
        openingHours: data.openingHours,
        published: data.published,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.error("Store POST error:", error);
    return NextResponse.json({ error: "Failed to create store", details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(stores);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 });
  }
}
