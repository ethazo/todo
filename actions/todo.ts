"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// 统一的返回类型
export type ActionResponse = { success: boolean; error?: string };

export async function addTodo(title: string): Promise<ActionResponse> {
  if (!title?.trim()) return { success: false, error: "任务内容不能为空" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "请先登录" };

  const { error } = await supabase.from("todos").insert({
    title: title.trim(),
    user_id: user.id,
  });

  if (error) return { success: false, error: "添加任务失败，请重试" };
  
  revalidatePath("/");
  return { success: true };
}

export async function updateTodo(id: string, newTitle: string): Promise<ActionResponse> {
  if (!newTitle?.trim()) return { success: false, error: "任务内容不能为空" };

  const supabase = await createClient();
  
  const { error } = await supabase
    .from("todos")
    .update({ 
      title: newTitle.trim(), 
      updated_at: new Date().toISOString() 
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: "修改任务失败，请重试" };
  }
  
  revalidatePath("/");
  return { success: true };
}

export async function toggleTodo(id: string, currentStatus: boolean): Promise<ActionResponse> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("todos")
    .update({ is_completed: !currentStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { success: false, error: "更新状态失败" };
  
  revalidatePath("/");
  return { success: true };
}

export async function deleteTodo(id: string): Promise<ActionResponse> {
  const supabase = await createClient();
  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) return { success: false, error: "删除任务失败" };
  
  revalidatePath("/");
  return { success: true };
}