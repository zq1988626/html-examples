module.exports = {
    title: 'Vue 组件库',
    description: 'IFP Vue 组件管理',
    lang: 'zh-Hans',
    themeConfig: {
        repo: 'vuejs/vitepress',
        docsDir: 'docs',

        editLinks: true,
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: 'Last Updated',

        nav: [
            { text: '首页', link: '/', activeMatch: '^/$|^/guide/' },
            {
                text: '配置',
                link: '/setting',
                activeMatch: '^/config/'
            },
            {
                text: '发布日志',
                link: 'https://github.com/vuejs/vitepress/releases'
            }
        ],
        
        sidebar: {
            '/': getHomeSidebar()
        }
    }
}


function getHomeSidebar(){
    return [
      {
        text: 'Introduction',
        children: [
          { text: '主页', link: '/' },
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'Asset Handling', link: '/guide/assets' },
          { text: 'Markdown Extensions', link: '/guide/markdown' },
          { text: 'Using Vue in Markdown', link: '/guide/using-vue' },
          { text: 'Deploying', link: '/guide/deploy' }
        ]
      },
      {
        text: 'Advanced',
        children: [
          { text: 'Frontmatter', link: '/guide/frontmatter' },
          { text: 'Global Computed', link: '/guide/global-computed' },
          { text: 'Global Component', link: '/guide/global-component' },
          { text: 'Customization', link: '/guide/customization' },
          {
            text: 'Differences from Vuepress',
            link: '/guide/differences-from-vuepress'
          }
        ]
      }
    ]
}