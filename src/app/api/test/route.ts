import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const products = await prisma.product.findMany();
  const news = await prisma.news.findMany();
  return NextResponse.json({ products, news });
}
