# Collaborative Lab Automation Workshop Series

Imperial College London I-X Centre for AI in Science 资助的 seminar & workshop 系列活动官网。
纯静态网页（HTML + CSS + 少量 JS），不需要任何构建步骤，可以直接部署到 GitHub Pages。

```
website/
├── index.html                 页面内容（更新讲者只需要改这个文件）
├── assets/css/style.css       样式：配色参考 imperial.ac.uk，版式参考 Imperial PPT 模板
├── assets/js/main.js          手机菜单、导航高亮、Programme 目录自动填充、首页闭环示意图动画
├── assets/img/favicon.svg     浏览器标签图标
├── assets/img/og-image.png    链接分享预览图（1200×630）
├── assets/img/speakers/       讲者照片放这里
└── .nojekyll                  让 GitHub Pages 直接发布静态文件
```

## 本地预览

```bash
python3 -m http.server 8000
```

在 `website` 文件夹里运行，然后打开 http://localhost:8000

## 部署到 GitHub Pages

> ⚠️ 只上传 `website` 文件夹里的内容。上一级 `workshop` 文件夹里的会议记录、拟邀讲者名单等是内部文件，不要推到公开仓库。

**网页上传（最简单）**

1. 在 GitHub 新建一个 Public 仓库，例如 `lab-automation-workshop`
2. 点 *Add file → Upload files*，把 `website` 里的所有文件和文件夹拖进去（包括 `.nojekyll`；Finder 里按 `Cmd + Shift + .` 可以显示隐藏文件），Commit
3. 打开仓库 *Settings → Pages*，Source 选 *Deploy from a branch*，Branch 选 `main` 和 `/ (root)`，Save
4. 一两分钟后网站地址为 `https://<你的用户名>.github.io/lab-automation-workshop/`

**命令行**

```bash
cd website
git init
git add .
git commit -m "Launch workshop website"
git branch -M main
git remote add origin https://github.com/<你的用户名>/lab-automation-workshop.git
git push -u origin main
```

然后同样在 *Settings → Pages* 里开启。

## 部署后：分享预览图

很多平台（LinkedIn、Facebook 等）要求预览图是完整网址。部署后在 `index.html` 里把

```html
<meta property="og:image" content="assets/img/og-image.png">
```

改成完整地址，例如 `https://<你的用户名>.github.io/lab-automation-workshop/assets/img/og-image.png`。

## 更新讲者信息

在 `index.html` 里搜索 `SEMINAR 1`（或 2–5），每个 seminar 是一个 `<li class="event" ...>` 区块：

1. 把 `data-status="tba"` 改成 `data-status="confirmed"`（灰色占位文字会变成正式样式）
2. 修改报告题目 `event-title`、讲者姓名 `speaker-name`、单位 `speaker-affil`，以及 Date / Time
3. 照片（可选）：把正方形照片放到 `assets/img/speakers/`，再把占位框
   `<div class="speaker-photo speaker-photo--tba">…</div>` 换成
   `<img class="speaker-photo" src="assets/img/speakers/firstname-lastname.jpg" alt="">`
4. 讲者主页链接（可选）：`<p class="speaker-name"><a href="https://...">Prof. Name</a></p>`
5. 摘要和简介（可选）：`index.html` 的注释里有 `<details class="abstract">` 的示例
6. 同一场有两位讲者：把 `<div class="speaker">…</div>` 复制一份即可

Programme 顶部的目录（1–6）会自动从下面各场的信息里读取讲者姓名和日期，不需要另外修改。

Workshop 的 panellist 占位在 `CONCLUDING WORKSHOP` 区块里，注释中有确认后的写法。

每次更新后，记得把页脚的 `Updated 13/10/2026` 改成当天日期。

## 设计说明

- 配色参考 imperial.ac.uk（I-X funding 页面）：标题和正文近黑色 `#161A1D`，Imperial Blue `#0000CD` 只用于 logo、链接、按钮和细线，浅紫 `#E6E6FA` / 浅灰 `#F1F2F4` 做底色块，标语区、Workshop 和页脚用黑底
- 版式参考 Imperial PPT 模板：左对齐大标题 + 彩色副标题、Agenda 式编号目录、"Get in touch" 收尾
- Imperial 的品牌字体不对外提供，网页用 Google Fonts 的 Inter Tight / Inter 近似，标签用 IBM Plex Mono 呼应 IMPERIAL 字标
- 首页示意图：AI agents 规划 → Robots 执行 → Experiments 的结果反馈给 AI，三个环节依次高亮；系统开启"减少动态效果"时显示静态图
