"use client";

import { useOptimistic, useTransition, useState, useRef, useEffect } from "react";
import { addTodo, toggleTodo, deleteTodo, updateTodo, type ActionResponse } from "@/actions/todo";
import { toast } from "sonner";
import { Check, Trash2, Plus, Sparkles, Circle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Todo {
  id: string;
  title: string;
  is_completed: boolean;
}

export function TodoContainer({ initialTodos }: { initialTodos: Todo[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const [optimisticTodos, dispatch] = useOptimistic<Todo[], any>(
    initialTodos,
    (state, { type, payload }) => {
      switch (type) {
        case "ADD":
          return [{ id: crypto.randomUUID(), title: payload.title, is_completed: false }, ...state];
        case "TOGGLE":
          return state.map(t => t.id === payload.id ? { ...t, is_completed: !t.is_completed } : t);
        case "DELETE":
          return state.filter(t => t.id !== payload.id);
        case "UPDATE":
          return state.map(t => t.id === payload.id ? { ...t, title: payload.title } : t);
        default:
          return state;
      }
    }
  );

  const handleAdd = async (formData: FormData) => {
    const title = formData.get("title") as string;
    if (!title?.trim()) return;
    formRef.current?.reset();
    startTransition(async () => {
      dispatch({ type: "ADD", payload: { title } });
      const result: ActionResponse = await addTodo(title);
      if (!result.success) toast.error(result.error || "添加失败");
    });
  };

  const handleToggle = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      dispatch({ type: "TOGGLE", payload: { id } });
      const result = await toggleTodo(id, currentStatus);
      if (!result.success) toast.error(result.error);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      dispatch({ type: "DELETE", payload: { id } });
      const result = await deleteTodo(id);
      if (!result.success) toast.error(result.error);
    });
  };

  const handleSaveEdit = (id: string, originalTitle: string) => {
    const newTitle = editText.trim();
    if (!newTitle || newTitle === originalTitle) {
      setEditingId(null);
      return;
    }
    startTransition(async () => {
      dispatch({ type: "UPDATE", payload: { id, title: newTitle } });
      setEditingId(null);
      const result = await updateTodo(id, newTitle);
      if (!result.success) toast.error(result.error);
    });
  };

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 space-y-10">
      {/* 1. 蓝色幻彩输入中枢 */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-[22px] blur opacity-20 group-focus-within:opacity-40 transition duration-1000" />
        <form
          ref={formRef}
          action={handleAdd}
          className="relative flex items-center bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-blue-100 dark:border-blue-900/30 rounded-[20px] shadow-xl shadow-blue-500/5 p-2 transition-all"
        >
          <div className="pl-4 pr-2">
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
          </div>
          <input
            name="title"
            placeholder="捕捉一个灵感或任务..."
            required
            autoComplete="off"
            className="flex-1 bg-transparent py-3 px-2 text-[15px] text-slate-800 dark:text-blue-50 placeholder:text-slate-400 dark:placeholder:text-blue-300/30 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isPending}
            className="ml-2 p-3 bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 text-white rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </form>
      </div>

      {/* 2. 列表区域 */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {optimisticTodos.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-20 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                <div className="relative w-24 h-24 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-slate-900 rounded-[32px] border border-blue-100 dark:border-blue-800/50 flex items-center justify-center shadow-2xl">
                  <CheckCircle2 className="w-12 h-12 text-blue-500/40" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-blue-100">暂无待办事项</h3>
                <p className="text-sm text-slate-500 dark:text-blue-400/60 mt-1">享受此刻的轻松，或开启新的计划</p>
              </div>
            </motion.div>
          ) : (
            <motion.ul layout className="space-y-3">
              <AnimatePresence mode="popLayout">
                {optimisticTodos.map((todo) => (
                  <motion.li
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    className={cn(
                      "group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
                      "bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-blue-900/20",
                      "hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-200 dark:hover:border-blue-700/50",
                      todo.is_completed && "bg-slate-50/50 dark:bg-slate-900/20 opacity-75"
                    )}
                  >
                    {/* 自定义复选框 */}
                    <button
                      onClick={() => handleToggle(todo.id, todo.is_completed)}
                      className="relative flex-shrink-0 group/check"
                    >
                      {todo.is_completed ? (
                        <CheckCircle2 className="w-6 h-6 text-blue-500 dark:text-blue-400 transition-transform group-active/check:scale-90" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300 dark:text-blue-800 transition-colors group-hover/check:text-blue-400" />
                      )}
                    </button>

                    {/* 标题内容 */}
                    <div className="flex-1 min-w-0">
                      {editingId === todo.id ? (
                        <input
                          ref={editInputRef}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onBlur={() => handleSaveEdit(todo.id, todo.title)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(todo.id, todo.title);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="w-full bg-transparent text-[15px] font-medium text-blue-600 dark:text-blue-400 outline-none"
                        />
                      ) : (
                        <span
                          onClick={() => {
                            if (!todo.is_completed) {
                              setEditingId(todo.id);
                              setEditText(todo.title);
                            }
                          }}
                          className={cn(
                            "block text-[15px] font-medium transition-all duration-500 truncate cursor-text",
                            todo.is_completed
                              ? "text-slate-400 dark:text-slate-600 line-through decoration-blue-500/30"
                              : "text-slate-700 dark:text-blue-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                          )}
                        >
                          {todo.title}
                        </span>
                      )}
                    </div>

                    {/* 操作按钮组 */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* 完成时的侧边装饰线 */}
                    {todo.is_completed && (
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-500/20 rounded-full" />
                    )}
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}