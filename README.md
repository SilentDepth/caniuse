# Silent Land Web Baseline

一个基于 Nuxt 4 与 Nuxt UI 构建的单页 Web 应用，用来追踪 Web Platform 特性何时在主流浏览器中跨过“可以放心采用”的时间点。

项目会从 `web-features` 数据集拉取特性信息，基于每项特性的 `baseline_low_date`，再叠加一个可配置的“观察滞后期（lag months）”，计算它何时进入可用窗口，并按时间分组展示。

## 项目在做什么

这个应用不是通用的 `Can I Use` 查询页，而是一个更聚焦的时间视图：

- 以 Chrome、Edge、Firefox、Safari 四个核心浏览器作为观察范围。
- 读取每个特性的 Baseline Low 时间。
- 在 Baseline Low 的基础上增加默认 `30` 个月的滞后期，模拟“团队何时可以把它视为稳定可用”。
- 将结果拆成两个标签页：
  - `Eligible`：最近 6 个月内刚进入可用窗口的特性
  - `Upcoming`：未来 6 个月内即将进入可用窗口的特性
- 按月份分组展示每项特性的名称、描述、规范链接、Baseline 日期、预计可用日期和浏览器支持版本。

它适合用来回答这类问题：

- 最近有哪些 Web 特性已经成熟到值得纳入基线？
- 接下来半年哪些特性可能进入团队的可用清单？
- 如果团队采用更保守或更激进的策略，结论会如何变化？

## 核心功能

- 可配置观察滞后期：用户可以在页面头部输入 `1-120` 个月之间的值。
- 参数持久化：滞后期通过 Cookie 保存，刷新后仍会保留。
- 双时间窗口视图：分别展示“最近变为可用”和“即将变为可用”的特性。
- 月度分组：按预计可用月份聚合，便于做路线图或版本规划。
- 主题切换：支持 `Auto / Light / Dark`。
- 容错拉取：优先从 `unpkg` 获取数据，失败后回退到 `jsDelivr`。
- 加载与错误状态：内置 skeleton loading 和错误提示。

## 数据来源与计算方式

数据来自远端 `web-features` 数据集：

- `https://unpkg.com/web-features@latest/data.json`
- `https://cdn.jsdelivr.net/npm/web-features@latest/data.json`

页面会筛选出：

- `kind === "feature"` 的条目
- 存在 `status.baseline_low_date` 的条目

然后按下面的方式计算：

1. 读取当前月的 UTC 月初作为参考时间。
2. 将每个特性的 `baseline_low_date` 加上用户设定的滞后月数。
3. 得到 `availableAt`，表示该特性被视为“可以放心采用”的时间。
4. 如果 `availableAt` 落在：
   - 过去 6 个月到当前月之间，则归入 `Eligible`
   - 当前月到未来 6 个月之间，则归入 `Upcoming`
5. 最后按月份分组并排序。

这套逻辑集中在 [app/composables/useCanIUseFeatures.ts](/Users/sd/Developer/silent-land--web-baseline/app/composables/useCanIUseFeatures.ts)。

## 技术栈

- Nuxt 4
- Vue 3 + `<script setup>`
- @nuxt/ui
- Tailwind CSS 4
- @nuxt/eslint
- @vueuse/nuxt
- @nuxt/a11y
- @nuxt/hints

## 项目结构

```text
app/
  app.vue                             # 应用入口，串联数据加载、SEO、状态展示
  app.config.ts                       # Nuxt UI 主题色配置
  assets/css/main.css                # 全局样式和主题变量
  composables/useCanIUseFeatures.ts  # 数据拉取、时间窗口计算、分组逻辑
  utils/url.ts                       # 规范链接域名格式化
  components/
    CanIUseHeader.vue                # 页面标题与说明
    CanIUseHeaderControls.vue        # 月份输入与主题切换
    CanIUseTabNav.vue                # Eligible / Upcoming 标签导航
    CanIUseFeatureGroups.vue         # 月份分组列表
    CanIUseFeatureCard.vue           # 单个特性卡片
```

当前仓库实现是一个前端单页界面，没有本地服务端 API、数据库或后台任务。

## 本地开发

先安装依赖：

```bash
pnpm install
```

启动开发环境：

```bash
pnpm dev
```

常用命令：

```bash
pnpm run lint      # Lint
pnpm run typecheck # 类型检查
pnpm run build     # 生产构建
pnpm run preview   # 本地预览生产构建
```

注意：

- 这个项目使用 `pnpm` 管理依赖和运行脚本。
- 数据依赖外部 CDN；如果两个数据源都不可用，页面会显示加载错误。

## 界面行为概览

- 顶部区域展示产品定位，并允许用户修改滞后月份。
- 紧随其后的是固定在顶部的标签导航，便于在两个时间窗口间切换。
- 主内容区按月份列出特性卡片。
- 每张卡片展示：
  - 特性名与 ID
  - 描述
  - 最多三个规范链接
  - Baseline Low 日期
  - 预计可用日期
  - 四个核心浏览器的支持版本

## 适合继续扩展的方向

- 增加搜索、筛选和排序能力
- 引入更多浏览器或可配置浏览器集合
- 支持 URL 查询参数分享当前视图状态
- 为特性详情增加侧边栏或独立页面
- 添加自动化测试，覆盖时间窗口计算与分组逻辑

## License

项目仓库包含 [LICENSE](/Users/sd/Developer/silent-land--web-baseline/LICENSE) 文件，具体授权条款以该文件为准。
