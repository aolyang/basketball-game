## 项目目标
使用p5.js创建一个剪纸风格的篮球游戏
p1: 场景、运球、投球、记分
p2: 两人对战、断球、抢篮板
p3: 在线对战
元素：鸡哥？
技术线路：p5 typescript

## 项目结构
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
## 页面 & 游戏内容规定
1. 游戏画面 16:9，根据屏幕DPI自动缩放
2. 背景主题色：#dbd7d3
3. 所有字体采用 src/assets/font/Virgil.woff2