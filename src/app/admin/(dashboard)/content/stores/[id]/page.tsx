import StoreEditor from "@/components/admin/StoreEditor";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EditStorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = await prisma.store.findUnique({
    where: { id },
  });

  if (!store) {
    redirect('/admin/content/stores');
  }

  return <StoreEditor initialData={store} />;
}
