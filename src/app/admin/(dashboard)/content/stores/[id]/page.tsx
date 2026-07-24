import StoreEditor from "@/components/admin/StoreEditor";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditStorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = await prisma.store.findUnique({
    where: { id },
  });

  if (!store) {
    notFound();
  }

  return <StoreEditor initialData={store} />;
}
