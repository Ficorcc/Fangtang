// 网站配置信息
export const siteConfig = {
  // 基本信息
  title: '荒野菲克', // 网站标题
  description: '探索技术与生活的交汇点', // 网站描述
  author: 'ficor', // 作者名称
  url: 'https://ficor.cc', // 网站 URL（请根据实际部署地址修改）
  
  // SEO 相关
  keywords: ['博客', 'Astro', '前端', '技术分享'], // 关键词
  ogImage: '/og-image.png', // Open Graph 图片路径
  
  // 社交媒体链接
  social: {
    github: 'https://github.com/ficorcc', // GitHub 链接
    twitter: '', // Twitter 链接（可选）
    email: 'ficor@ficor.cc', // 邮箱
  },
  
  // 其他可设置项
  postsPerPage: 10, // 每页显示的文章数量
  showReadingTime: true, // 是否显示阅读时间
  enableComments: false, // 是否启用评论（需要集成第三方服务）
  theme: 'light', // 默认主题（light/dark/auto）
  
  // Logo 设置
  logo: {
    show: 'both', // 'text' - 只显示文字, 'logo' - 只显示logo, 'both' - 文字和logo都显示
    image: '/favicon.ico', // Logo 图片路径
    alt: '荒野菲克', // Logo 替代文字
    width: 32,
    height: 32,
  },
  
  // 导航菜单
  nav: [
    { title: '首页', href: '/' },
    { title: '关于', href: '/about' },
    { title: '归档', href: '/archive' },
  ],
  
  // 页脚信息
  footer: {
    copyright: '© 2008-2026 Ficor. All rights reserved.',
    poweredBy: 'Powered by Astro',
  },
};