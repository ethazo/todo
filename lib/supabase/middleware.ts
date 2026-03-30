import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // 更新请求中的 cookies，确保后续逻辑能读取到最新 session
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // 创建包含更新后 cookies 的响应对象
          supabaseResponse = NextResponse.next({
            request,
          })
          
          // 将新的 cookies 写入响应头，同步给浏览器
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 这里的 getUser() 是关键：它会触发 supabase-js 内部的 token 刷新机制
  // 注意：不要在调用 getUser() 之前返回响应
  await supabase.auth.getUser()

  return supabaseResponse
}