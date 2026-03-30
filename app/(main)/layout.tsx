import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import UserAvatar from "@/components/auth/user-avatar";
import { Sparkles } from "lucide-react";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  const name = user.user_metadata?.full_name;
  const avatar = user.user_metadata?.avatar_url;
  const email = user.user_metadata?.email;

  return (
    <div className="min-h-dvh relative flex flex-col font-sans bg-slate-50 dark:bg-slate-900">
      
      {/* ✅ 底色（稳定视觉） */}
      <div className="fixed inset-0 -z-30 bg-slate-50 dark:bg-slate-900" />

      {/* ✅ 超淡网格（几乎不可察觉） */}
      <div className="fixed inset-0 -z-20 opacity-[0.15] pointer-events-none 
        bg-[linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)] 
        bg-[size:3rem_3rem] dark:bg-[linear-gradient(to_right,#4b5563_1px,transparent_1px),linear-gradient(to_bottom,#4b5563_1px,transparent_1px)]" 
      />

      {/* ✅ 柔和光斑（范围更小 + 更透明） */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-[30vw] h-[30vw] 
          bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[15%] w-[30vw] h-[30vw] 
          bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="
            flex items-center justify-between h-14 px-5
            rounded-2xl
            bg-white/80 dark:bg-slate-800/80
            backdrop-blur-md
            border border-slate-200/60 dark:border-slate-700/60
            shadow-sm
          ">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="
                w-8 h-8 rounded-lg flex items-center justify-center
                bg-gradient-to-br from-blue-500 to-indigo-600
                shadow-sm
                transition-all duration-200
                group-hover:scale-105
              ">
                <Sparkles className="text-white w-4 h-4" />
              </div>

              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
                Todo
              </span>
            </Link>

            {/* 用户 */}
            <UserAvatar avatarUrl={avatar} name={name} email={email} onSignOut={signOut} />
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        {children}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 py-6">
        <div className="flex justify-center items-center gap-4 text-slate-400 dark:text-slate-500">
          <span className="text-[10px] font-medium tracking-widest uppercase">
            保持专注
          </span>
          <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="text-[10px] font-medium tracking-widest uppercase font-mono">
            v0.1.0
          </span>
        </div>
      </footer>
    </div>
  );
}