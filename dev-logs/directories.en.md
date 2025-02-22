# AI suggested directories

[简体中文](./directories.md)

```
# root directory
├── src/                  # Main source code directory
│   ├── game/             # Core game logic
│   │   ├── entities/     # Game entities (players, basketball)
│   │   ├── scenes/       # Different game scenes (match, menu)
│   │   ├── utils/        # Utility modules (input handling, collision detection)
│   │   └── GameManager.ts# Game state machine
│   ├── ui/               # User interface system
│   │   ├── components/   # Reusable UI components (buttons, progress bars)
│   │   ├── screens/      # Different screens (main menu, HUD)
│   │   └── UIManager.ts  # UI state controller
│   ├── assets/           # Asset manager
│   │   ├── sprites/      # Sprite resources
│   │   ├── fonts/        # Game fonts
│   │   └── sounds/       # Sound files
│   └── index.ts          # Application entry file
│
├── package.json          # Project dependencies configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation

# Key files description:
# - GameManager.ts       Core of the game loop/mode switching
# - UIManager.ts         UI layer management/transition control
# - entities/Player.ts   Player behavior and state management
# - utils/Netcode.ts     Network communication module
# - screens/HUD.ts       Real-time game data display
# - components/Button.ts Interactive button component
```
