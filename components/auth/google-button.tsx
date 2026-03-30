"use client";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function GoogleSignInButton() {
  const { pending } = useFormStatus();

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={pending}
      className="
        group relative flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-xl font-medium transition-all duration-300
        /* 浅色模式样式 */
        bg-white border border-slate-200/80 text-slate-700 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] 
        hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] hover:border-slate-300 hover:-translate-y-0.5
        /* 深色模式样式 (Dark Mode) */
        dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-200 dark:shadow-none
        dark:hover:bg-slate-800 dark:hover:border-slate-600 dark:hover:text-white
        /* 禁用状态 */
        disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:hover:translate-y-0 disabled:cursor-not-allowed
      "
    >
      {pending ? (
        <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
      ) : (
        <div className="relative flex items-center justify-center">
           {/* Google Icon: 在深色模式下可以给个微弱的背景光，防止彩色图标在深色下太突兀 */}
           <div className="absolute inset-0 bg-white rounded-full scale-125 opacity-0 dark:group-hover:opacity-20 blur-md transition-opacity" />
           <img 
            src="https://www.google.com/favicon.ico" 
            className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" 
            alt="Google Logo" 
          />
        </div>
      )}
      
      <span className="text-[15px] tracking-wide relative z-10">
        {pending ? "正在连接到 Google..." : "通过 Google 快速登录"}
      </span>
    </motion.button>
  );
}