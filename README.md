# 📝 Todo App (Next.js + Supabase)

这是一个基于最新的技术栈构建的现代化、响应式待办事项管理应用。项目集成了 **Supabase** 作为后端（身份验证与数据库），并利用 **Tailwind CSS 4** 和 **Framer Motion** 提供了流畅的用户体验。

## ✨ 技术栈

- **框架**: [Next.js 16 (App Router)](https://nextjs.org/)
- **前端核心**: [React 19](https://react.dev/)
- **后端服务**: [Supabase](https://supabase.com/) (Auth, Database, SSR)
- **样式方案**: [Tailwind CSS 4](https://tailwindcss.com/) + `lucide-react` (图标)
- **动画效果**: [Framer Motion 12](https://www.framer.com/motion/)
- **通知系统**: [Sonner](https://www.google.com/search?q=https://sonner.emilkowal.ski/)
- **类型检查**: TypeScript

------

## 🚀 快速开始

### 1. 克隆项目

Bash

```
git clone <your-repo-url>
cd todo
```

### 2. 安装依赖

Bash

```
npm install
# 或者
yarn install
```

### 3. 环境配置

在项目根目录创建 `.env.local` 文件，并填入你的 Supabase 配置信息：

Code snippet

```
NEXT_PUBLIC_SUPABASE_URL=你的_SUPABASE_项目_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_SUPABASE_匿名_KEY
```

### 4. 启动开发服务器

Bash

```
npm run dev
```

打开浏览器访问 [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) 即可查看效果。

------

## 🛠️ 脚本说明

- `npm run dev`: 启动本地开发服务器。
- `npm run build`: 构建生产环境版本。
- `npm run start`: 运行构建后的生产环境应用。
- `npm run lint`: 运行 ESLint 进行代码规范检查。

------

## 📦 主要特性

- **实时同步**: 利用 Supabase 实现多端数据实时同步。
- **身份验证**: 完整的用户注册、登录及会话管理。
- **极致视觉**:
  - 使用 **Tailwind CSS 4** 带来的原生性能级样式。
  - **Framer Motion 12** 实现的流畅卡片过渡和交互动画。
- **响应式设计**: 完美适配手机、平板及桌面端。
- **暗黑模式**: 内置 `next-themes` 支持。
