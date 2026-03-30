"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface UserAvatarProps {
  avatarUrl?: string | null;
  name?: string;
  email?: string;
  onSignOut: () => void;
}

export default function UserAvatar({
  avatarUrl,
  name,
  email,
  onSignOut,
}: UserAvatarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const themeBtnRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDetailsElement>(null);

  // 点击外部自动关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const button = themeBtnRef.current;
      if (!button || !document.startViewTransition) {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        return;
      }

      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => {
        flushSync(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"));
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 450,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    },
    [resolvedTheme, setTheme]
  );

  const isDark = resolvedTheme === "dark";

  return (
    <details
      ref={containerRef}
      className="relative list-none select-none"
      open={isOpen}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="list-none outline-none cursor-pointer [&::-webkit-details-marker]:hidden">
        <div className="relative p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 active:scale-95">
          <div className="h-9 w-9 rounded-full overflow-hidden ring-1 ring-black/[0.08] dark:ring-white/[0.12] shadow-sm">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name || ""}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                <User className="h-4 w-4 text-slate-400" />
              </div>
            )}
          </div>
        </div>
      </summary>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 5 }}
            transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className={cn(
              "absolute right-0 mt-3 z-50 w-72 overflow-hidden rounded-[1.75rem] origin-top-right",
              "bg-white dark:bg-slate-900", // 不透明背景
              "border border-slate-200 dark:border-white/[0.08]",
              "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)]"
            )}
          >
            {/* 1. Header Section */}
            <div className="relative px-6 pt-8 pb-6 flex flex-col items-center">
              <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-slate-50 dark:from-white/[0.02] to-transparent pointer-events-none" />
              
              <div className="relative mb-4">
                <div className="h-20 w-20 rounded-full p-1 bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-white/10">
                  <div className="h-full w-full rounded-full overflow-hidden ring-1 ring-black/5">
                    {avatarUrl ? (
                      <img src={avatarUrl} className="h-full w-full object-cover" alt="avatar" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-50 dark:bg-slate-700">
                        <User className="h-10 w-10 text-slate-300" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center space-y-0.5 z-10">
                <h3 className="text-[17px] font-semibold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {name || "User Name"}
                </h3>
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400/80 break-all">
                  {email || "example@google.com"}
                </p>
              </div>
            </div>

            {/* 2. Menu Section */}
            <div className="px-3 pb-3 space-y-1">
              <div className="h-px bg-slate-200/50 dark:bg-white/[0.05] mx-4 mb-2" />
              
              {/* Theme Toggle Button */}
              <button
                ref={themeBtnRef}
                onClick={toggleTheme}
                className="group flex w-full items-center justify-between px-3.5 py-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-all duration-200 active:scale-[0.97]"
              >
                <div className="flex items-center gap-3.5">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300 shadow-sm ring-1 ring-black/5",
                    isDark ? "bg-blue-500 text-white" : "bg-orange-400 text-white"
                  )}>
                    {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  </div>
                  <span className="text-[14px] font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
                    外观模式
                  </span>
                </div>

                {/* 代替 ChevronRight 的微型开关 */}
                <div className={cn(
                  "relative w-9 h-5 rounded-full transition-colors duration-300 flex items-center px-1",
                  isDark ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                )}>
                  <motion.div
                    layout
                    className="h-3.5 w-3.5 bg-white rounded-full shadow-sm"
                    animate={{ x: isDark ? 16 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>

              {/* Sign Out Button */}
              <button
                onClick={onSignOut}
                className="group flex w-full items-center gap-3.5 px-3.5 py-2.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 active:scale-[0.97]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-red-100 dark:group-hover:bg-red-500/20 shadow-sm ring-1 ring-black/5 transition-colors">
                  <LogOut className="h-4 w-4 text-slate-500 group-hover:text-red-600 transition-colors" />
                </div>
                <span className="text-[14px] font-semibold text-slate-700 dark:text-slate-200 group-hover:text-red-600 transition-colors tracking-tight">
                  退出登录
                </span>
              </button>
            </div>

            {/* 3. Footer Branding */}
            <div className="py-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.02]">
              <span className="text-[9px] font-bold tracking-[0.25em] text-slate-400 dark:text-slate-600 uppercase">
                Google Workspace
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </details>
  );
}