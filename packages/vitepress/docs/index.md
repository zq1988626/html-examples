---
home: false
# heroImage: /logo.png
heroAlt: Logo image
heroText: Hero Title
tagline: Hero subtitle
actionText: Get Started
actionLink: /guide/
features:
  - title: Simplicity First
    details: Minimal setup with markdown-centered project structure helps you focus on writing.
  - title: Vue-Powered
    details: Enjoy the dev experience of Vue + webpack, use Vue components in markdown, and develop custom themes with Vue.
  - title: Performant
    details: VitePress generates pre-rendered static HTML for each page, and runs as an SPA once a page is loaded.
footer: MIT Licensed | Copyright © 2019-present Evan You
---

# Vue 组件 <testC></testC>

[Home](/) <!-- sends the user to the root README.md -->
[foo](/foo/) <!-- sends the user to index.html of directory foo -->
[foo heading](./#heading) <!-- anchors user to a heading in the foo README file -->


1 + 1 = {{ 1 + 1 }}

<testC></testC>

## 访问网站和页面数据
```
{{ $page.frontmatter.heroText }}
```
{{ $page.frontmatter.heroText }}


::: v-pre
`{{ This will be displayed as-is }}`
:::

<span v-for="i in 3">{{ i }} </span>


```vue
<template>
    <h1>33333333333</h1>
</template>
```

## 插入组件

<CustomComponent />

aaaa

<script setup>
import CustomComponent from './test.vue'
</script>


## [Setting](./setting)

* [Home](/) <!-- sends the user to the root README.md -->
* [foo](/foo/) <!-- sends the user to index.html of directory foo -->
* [foo heading](./#heading) <!-- anchors user to a heading in the foo README file -->

::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a dangerous warning
:::