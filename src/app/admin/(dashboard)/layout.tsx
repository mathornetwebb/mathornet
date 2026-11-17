import { Sidebar } from "@/components/admin/Sidebar";
import DirtyStateTracker from "@/components/admin/DirtyStateTracker";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DirtyStateTracker />
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 min-w-0 pt-20 md:pt-8">
        <div className="w-full h-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
