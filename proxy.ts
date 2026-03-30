import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  // 所有的请求都会先经过 updateSession 来刷新 Auth Session
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，但排除以下内容：
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (图标)
     * - 常见的公共文件扩展名 (如 .svg, .png 等)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}