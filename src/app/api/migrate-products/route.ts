import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Obehörig (Unauthorized)' }, { status: 401 });
    }

    const dataPath = path.join(process.cwd(), "products_data.json");
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

    for (const product of data) {
      // Upsert to avoid duplicates if run multiple times
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: product,
        create: product,
      });
    }

    return NextResponse.json({ success: true, count: data.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
