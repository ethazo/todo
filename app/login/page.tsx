import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Lock, Sparkles, Target } from "lucide-react";
import { GoogleSignInButton } from "@/components/auth/google-button";
import { AuthMotionWrapper } from "@/components/auth/auth-motion-wrapper";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/");

  async function signInWithGoogle() {
    "use server";
    const supabase = await createClient();
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const origin = `${protocol}://${host}`;

    const { data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback` },
    });

    if (data.url) redirect(data.url);
  }

  return (
    <div className="relative min-h-dvh w-full flex items-center justify-center bg-[#FAFAFA] dark:bg-slate-950 p-6 overflow-hidden selection:bg-blue-100 dark:selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-200 transition-colors duration-500">
      
      {/* --- Background design --- */}
      {/* 调整网格线颜色：dark: 下使用白色线条+极低透明度 */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />

      {/* 光晕在深色模式下稍微调暗一点点 */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-400/10 dark:bg-blue-500/5 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-400/10 dark:bg-indigo-500/5 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <main className="relative w-full max-w-[440px]">
        <AuthMotionWrapper>
          {/* 卡片：dark:bg-slate-900/80 dark:border-slate-800 */}
          <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white/60 dark:border-slate-800 rounded-[2rem] p-8 sm:p-10 transition-all">
            
            {/* Header / Custom branding */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative w-16 h-16 mb-6 group">
                <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-300 opacity-20 blur-md" />
                <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:-translate-y-1 transition-all duration-300">
                  <Sparkles className="text-white w-8 h-8" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                Todo
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase mb-4">
                个人任务管理平台
              </p>
              
              {/* Private environment alert */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full">
                <Lock className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 tracking-wide">
                  私有化部署环境
                </span>
              </div>
            </div>

            {/* System status indicator */}
            <div className="mb-8 relative group cursor-default">
              {/* 背景渐变适配 */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:to-blue-900/20 rounded-2xl transform transition-transform group-hover:scale-[1.02]" />
              <div className="relative p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  {/* Left-side Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-center shadow-sm">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  {/* Right-side status */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        系统就绪
                      </span>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      环境准备完毕，准备开始任务了吗？
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="space-y-6 mt-2">
              <form action={signInWithGoogle}>
                <GoogleSignInButton />
              </form>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-normal leading-relaxed">
                  👋 欢迎回来，管理员。
                  <br />
                  使用您的专属账号登陆以继续任务管理。
                </p>
              </div>
            </div>
          </div>
        </AuthMotionWrapper>

        {/* Footer */}
        <div className="mt-8 flex justify-center items-center gap-4 text-slate-400 dark:text-slate-600">
          <span className="text-[10px] font-medium tracking-widest uppercase">
            保持专注
          </span>
          <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="text-[10px] font-medium tracking-widest uppercase font-mono">
            v0.1.0
          </span>
        </div>
      </main>
    </div>
  );
}