# 方糖博客 Astro 复刻项目

## 目标
复刻 https://fangtang.net/，使用 Astro 框架实现同样风格和功能的静态博客。

## 完成情况
- ✅ 三套主题切换（light 明亮 / dark 暗黑 / sugar 糖金），localStorage 持久化
- ✅ Sticky 毛玻璃导航栏 + Logo
- ✅ 分类/更多下拉菜单
- ✅ 顶部滚动进度条
- ✅ 最新动态卡片（从 Memos JSON API 拉取，支持相对时间显示）
- ✅ 8 篇示例文章列表
- ✅ 文章卡片（标题/日期/标签/4行摘要截断）
- ✅ 分页组件
- ✅ Spotlight 搜索弹窗（Ctrl+K / Cmd+K 唤起）
- ✅ 回到顶部按钮
- ✅ 页脚（版权/备案/托管信息）
- ✅ 移动端响应式菜单
- ✅ CSS 变量驱动三主题自动切换

## 技术栈
- Astro 5.18（Content Collections + 静态生成）
- 纯 CSS（~18KB），CSS 变量控制主题
- 原生 JS（滚动进度/搜索/主题切换）

## 项目路径
~/Desktop/fangtang-blog/

## 运行
- `npm run dev` → http://localhost:4321
- `npm run build` → dist/ 静态输出

## 自定义
- `src/layouts/Layout.astro` 顶部的 siteName / logo URL
- `src/pages/index.astro` 里的 MEMOS_SOURCE 换成你的 memos JSON 端点
- `src/content/posts/` 添加 .md 发新文章

## 已知限制
- Memos API 为演示用（memos.057000.xyz），实际使用需替换为你的源
- 文章内页（/say/xxx.html 等）为静态占位，未实现动态路由
- 友链/标签/归档等页面为占位导航
