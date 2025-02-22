# AI 推荐的目录结构

[English](./directories.en.md)

```
# 根目录
├── src/                  # 主源代码目录
│   ├── game/             # 游戏核心逻辑
│   │   ├── entities/     # 游戏实体类（球员、篮球）
│   │   ├── scenes/       # 不同游戏场景（比赛、菜单）
│   │   ├── utils/        # 工具模块（输入处理、碰撞检测）
│   │   └── GameManager.ts# 游戏状态机
│   ├── ui/               # 用户界面系统
│   │   ├── components/   # 可复用UI组件（按钮、进度条）
│   │   ├── screens/      # 不同界面（主菜单、HUD）
│   │   └── UIManager.ts  # UI状态控制器
│   ├── assets/           # 资源管理器
│   │   ├── sprites/      # 精灵图资源
│   │   ├── fonts/        # 游戏字体
│   │   └── sounds/       # 音效文件
│   └── index.ts          # 应用入口文件
│
├── package.json          # 项目依赖配置
├── tsconfig.json         # TypeScript配置
└── README.md             # 项目文档

# 关键文件说明：
# - GameManager.ts       游戏主循环/模式切换核心
# - UIManager.ts         UI层级管理/转场控制
# - entities/Player.ts   球员行为与状态管理
# - utils/Netcode.ts     网络通信模块
# - screens/HUD.ts       游戏实时数据展示
# - components/Button.ts 交互式按钮组件
```
