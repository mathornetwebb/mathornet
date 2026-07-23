import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const store = await prisma.store.findUnique({
      where: { id },
    });
    if (!store) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(store);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch store" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const store = await prisma.store.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng),
        published: data.published,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update store" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.store.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete store" }, { status: 500 });
  }
}
