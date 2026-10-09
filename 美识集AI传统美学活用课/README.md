# 美识集·传统美学AI创作工具

面向AI绘画师、平面设计师、文创从业者和设计类学生的传统美学创作工具。

## 项目内容

- 15组中国传统、西方经典和东方其他主题色板
- 19个核心纹样与SVG线稿索引
- 3组中外风格对比
- 10节互动课程，覆盖色彩、纹样、建筑、绘画、材质与创作实战，每课含操作练习和深度思考
- 6个文化扩展专题
- 第一类课程补充资料包，包含21个补充点和可复制提示词模板
- 纯HTML、CSS和原生JavaScript实现，无构建步骤与第三方运行依赖

## 本地预览

可以直接打开 `index.html`，也可以在当前目录启动静态服务器：

```powershell
python -m http.server 4173
```

然后访问 `http://localhost:4173/`。

## 部署上线

### GitHub Pages

1. 在GitHub创建仓库。
2. 将当前目录内容提交到仓库默认分支。
3. 在仓库 `Settings -> Pages` 中选择 `Deploy from a branch`。
4. 选择默认分支和根目录 `/`。

### Vercel

1. 在Vercel导入包含当前目录的Git仓库。
2. Framework Preset选择 `Other`。
3. Build Command留空。
4. Output Directory设置为当前目录。

### Netlify

1. 在Netlify选择 `Add new site`。
2. 导入Git仓库，或直接拖入当前文件夹。
3. Build Command留空。
4. Publish Directory设置为当前目录。

## 项目信息

- 项目实践者：韩佳雪
- 公开作品集：https://315-h.github.io/315-h/
- 联系邮箱：3415703993@qq.com

## 资料与版权

课程只使用公开可查的博物馆、艺术史、官方非遗与公共文化资料。传统色值均标注为屏幕参考值，不代表文物测色结果。页面不生成或复刻受版权保护艺术作品的完整图像。
