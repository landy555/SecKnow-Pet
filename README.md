# 速知 SecKnow · 小宠物学习陪伴

> **仓库说明**：本仓库只包含前端应用代码，仓库根目录即原项目的 `app/` 目录。因此下文的 `app/src/…`、`app/dist/` 等路径，在本仓库中对应 `src/…`、`dist/…`；`验收截图/` 位于本仓库根目录下。

一款面向中小学生的 AI+教育学习陪伴产品。在复刻 Kizupi（kizupi.com）视觉体系的基础上，把内容与业务替换为「速知」的宠物学习陪伴闭环：学生认真学习，像素风橘猫小伙伴就会成长、变开心；很久没回来，它会想念你，并在回来时给予温暖欢迎。宠物是学习伙伴，不是制造压力的工具——没有死亡、退化或惩罚机制。

项目分为两部分：

- **产品介绍首页（Landing）**：复刻 Kizupi 的 Hero、半透明导航、内容区块与像素装饰。
- **可交互宠物应用（Pet App）**：成长 / 状态 / 互动 / 学习闭环 / 持久化 / 调试面板。

## 启动说明

```bash
npm install        # 首次安装依赖（在仓库根目录执行）
npm run dev        # 开发服务器，默认 http://localhost:5173
```

构建与预览：

```bash
npm run build      # tsc -b 类型检查 + vite build，产物输出到 app/dist/
npm run preview    # 本地预览构建产物
```

> 交接时 `npm run build` 已通过（tsc -b 无错误，vite build 约 400 modules），dev server 已在 5173 端口运行。

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | React 18 |
| 语言 | TypeScript |
| 构建 | Vite 5 |
| 样式 | Tailwind CSS 3 |
| 动画 | Framer Motion 11 |
| 持久化 | localStorage |

## 目录结构与模块职责

```
app/src/
├── main.tsx                       应用入口，挂载 React 根节点
├── App.tsx                        顶层：首页 ↔ 宠物应用切换
├── index.css                      Tailwind 与全局样式、设计变量
├── config/
│   └── config.ts                  所有关键数值集中配置 + 成长阶段计算函数
├── data/
│   └── lessons.ts                 示例知识点（探究/阅读/测试）与学科列表
├── lib/
│   ├── types.ts                   宠物状态、学习记录等类型定义
│   ├── logic.ts                   业务规则：经验、成长、状态衰减、奖励结算
│   ├── dialogue.ts                按状态生成宠物对话文案
│   └── persistence.ts             localStorage 读写与数据迁移
├── hooks/
│   └── usePet.ts                  宠物状态中枢：聚合逻辑、互动、持久化
├── components/
│   ├── character/
│   │   └── Character.tsx          像素风橘猫角色（首页与应用共用，随阶段/状态变化）
│   ├── landing/
│   │   ├── Nav.tsx                半透明毛玻璃导航栏 + 移动端汉堡菜单
│   │   ├── Landing.tsx            首页各区块（Hero / 介绍 / 流程 / 特色 / CTA / Footer）
│   │   └── PixelDecor.tsx         像素风背景装饰元素
│   └── app/
│       ├── PetApp.tsx             宠物应用主界面：状态、成长、互动入口
│       ├── Learning.tsx           学习闭环：探究 → 阅读 → 测试 → 提交 → 奖励
│       └── DebugPanel.tsx         开发者调试面板
```

设计原则：业务规则（`lib/`、`config/`）与视觉组件（`components/`）分离，关键数值全部集中在 `config/config.ts`，不散落在组件中。

## 功能清单（对照需求第三节）

### 宠物成长系统
- 三个成长阶段：**蛋 → 幼年 → 成年**，由经验值阈值驱动（0 / 120 / 400 XP），阶段附带尺寸缩放。
- 经验值与成长进度条：`stageProgress` 计算当前阶段到下一阶段的百分比。
- 学习奖励差异化：完成基础奖励、答对较多经验、答错较少经验但仍有鼓励、连续学习里程碑额外奖励。

### 宠物状态系统
- **心情**与**饱腹度**两项状态，随真实时间按小时衰减。
- 衰减有下限（floor），不会归零，**无死亡 / 退化 / 惩罚**。
- 状态影响角色表情、动作与对话：开心 / 饥饿 / 想念 / 欢迎回来等不同文案，不使用负罪感或恐惧语言。

### 互动系统
- **抚摸**：提升心情。
- **喂食**：恢复饱腹度并小幅提升心情。
- **查看状态 / 成长进度 / 学习记录 / 宠物对话**：均有真实数据反馈，非空按钮。

### 学习模拟闭环
进入知识点 → **探究 → 阅读 → 测试（选择题）→ 提交答案 → 获得奖励 → 宠物成长**。
提供 5 个示例知识点（数学·分数、语文·比喻、科学·水的三态、财商·需要vs想要、逻辑·事实与观点），每科约 10 分钟、含 3 道选择题。

### 数据持久化
关闭页面后重新打开，宠物状态、经验、成长阶段与学习记录通过 localStorage（键 `secknow:v1`）保留；重开时按真实经过时间结算状态衰减与「想念 / 欢迎回来」。

### 调试面板（`DebugPanel.tsx`）
默认不展开，供测试与迭代使用：
- 查看当前经验值、成长阶段、心情与饱腹度
- 手动增加经验
- 修改宠物状态
- 模拟离开 **24 小时 / 72 小时**
- 模拟答对 / 答错
- 重置数据

## 配置化数值说明

全部关键数值集中在 **`app/src/config/config.ts`** 的 `CONFIG` 对象，实际存在的配置项如下：

| 分组 | 配置项 | 值 | 含义 |
| --- | --- | --- | --- |
| `stages` | `egg / baby / adult` 的 `minXP` | 0 / 120 / 400 | 三阶段经验阈值 |
| `stages` | `scale` | 0.72 / 0.9 / 1.12 | 各阶段角色尺寸缩放 |
| `rewards` | `complete` | 12 | 完成一次学习的基础奖励 |
| `rewards` | `correct` | 22 | 答对单题经验 |
| `rewards` | `wrong` | 6 | 答错单题经验（仍给鼓励） |
| `rewards` | `streakBonus` | 8 | 连续学习额外奖励 |
| `rewards` | `streakStep` | 3 | 每连续 3 次触发一次额外奖励 |
| `decay` | `moodPerHour` | 2.2 | 心情每小时下降 |
| `decay` | `fullnessPerHour` | 3.4 | 饱腹度每小时下降 |
| `decay` | `floor` | 12 | 状态最低值（不归零、不惩罚） |
| `interactions` | `feedFullness` | 26 | 喂食恢复饱腹度 |
| `interactions` | `feedMood` | 6 | 喂食提升心情 |
| `interactions` | `petMood` | 10 | 抚摸提升心情 |
| `interactions` | `studyMood` | 14 | 学习完成提升心情 |
| `interactions` | `studyFullness` | -4 | 学习消耗少量饱腹度 |
| `absence` | `missingAfterHours` | 20 | 超过则显示「想念」 |
| `absence` | `welcomeBackAfterHours` | 8 | 回来时的温暖欢迎阈值 |
| 顶层 | `maxStat` | 100 | 状态上限 |
| 顶层 | `storageKey` | `secknow:v1` | localStorage 存储键 |

辅助函数：`stageForXP(xp)`、`nextStage(xp)`、`stageProgress(xp)`。

## 验收截图索引

截图位于 `验收截图/`，共 4 张：

| 文件 | 尺寸 | 内容 |
| --- | --- | --- |
| `验收截图/desktop-landing-1440.png` | 1440px 宽 | 桌面端首页（Hero / 导航 / 内容区块） |
| `验收截图/desktop-petapp-1440.png` | 1440px 宽 | 桌面端宠物应用（角色 / 状态 / 互动 / 学习入口） |
| `验收截图/mobile-landing-390.png` | 390px 宽 | 移动端首页（汉堡菜单折叠、无横向溢出） |
| `验收截图/mobile-petapp-390.png` | 390px 宽 | 移动端宠物应用 |

## 已知限制

- **角色为代码重建**：像素风橘猫由 `Character.tsx` 以代码绘制，非直接复用 Kizupi 原始素材，属尽力重建而非像素级一致。
- **课程为示例数据**：`data/lessons.ts` 仅 5 个演示知识点，非完整课程平台。
- **未做像素级逐区块对照**：视觉验收基于多轮浏览器截图肉眼确认，未与原站做逐像素叠加比对。
- **未做长时间跨天实测**：时间衰减 / 想念 / 欢迎回来通过调试面板「模拟离开」验证，未做真实跨天挂机实测。
- **持久化仅限本机 localStorage**：无账号与云端同步，换设备 / 清缓存会丢失数据。