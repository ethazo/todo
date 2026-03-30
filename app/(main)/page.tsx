import { createClient } from "@/lib/supabase/server";
import { TodoContainer } from "@/components/todo/todo-container";
import { Target, CalendarDays, Zap } from "lucide-react";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: todos } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  const todoList = todos || [];
  const completedCount = todoList.filter((t) => t.is_completed).length;
  const progress = todoList.length > 0 ? Math.round((completedCount / todoList.length) * 100) : 0;

  const hour = new Date().getHours();
  const greeting = hour < 5 ? "夜深了" : hour < 12 ? "早上好" : hour < 14 ? "中午好" : hour < 18 ? "下午好" : "晚上好";
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "朋友";
  
  const today = new Date().toLocaleDateString('zh-CN', { 
    month: 'short', 
    day: 'numeric', 
    weekday: 'short' 
  });

  // --- 增强版玻璃拟态样式 ---
  const cardBase = "backdrop-blur-md border transition-all duration-300";
  const glassCard = `${cardBase} bg-white/80 border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:bg-slate-900/80 dark:border-slate-800/50`;

  return (
    // 增加一个极淡的背景装饰
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 max-w-4xl mx-auto px-6 py-12 space-y-10">
      
      {/* --- 欢迎头部：Hero Section --- */}
      <section className={`${glassCard} p-8 rounded-[2.5rem] relative overflow-hidden group`}>
        {/* 右上角光晕装饰 */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-700" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                <Target className="w-10 h-10 text-white" />
              </div>
              {/* 状态小红点或徽章 */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full animate-pulse" />
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                <CalendarDays className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{today}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tighter">
                {greeting}，<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500">{firstName}</span>
              </h1>
            </div>
          </div>

          {/* 进度简报 */}
          <div className="flex flex-col items-end gap-2">
             <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Today's Progress</p>
                <p className="text-2xl font-black text-slate-700 dark:text-slate-200">{progress}%</p>
             </div>
             <div className="w-48 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
             </div>
          </div>
        </div>
      </section>

      {/* --- 主任务区域：沉浸式容器 --- */}
      <section className={`${glassCard} rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none`}>
        {/* 顶部工具栏 */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100/50 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
              <Zap className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Focus List
            </h2>
          </div>
        </div>

        <div className="p-4 sm:p-8">
          <TodoContainer initialTodos={todoList} />
        </div>
      </section>
    
    </main>
  );
}