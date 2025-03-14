interface CanvasConfig {
    width: number
    height: number
    aspectRatio: number
}

interface SlimeConfig {
    x: number
    y: number
    scale: number
    score: number
    // Jump-related properties
    isJumping: boolean
    jumpVelocity: number
    jumpHeight: number
    baseY: number
}

interface PhysicsConfig {
    gravity: number
    initialJumpVelocity: number
    moveSpeed: number
}

interface PlayerConfig {
    selectedPlayer: number
    isSelectionAnimating?: boolean
    selectionAnimationStartTime?: number
    flashCount?: number
    slimes: [SlimeConfig, SlimeConfig] // Array of two slimes for two players
    physics: PhysicsConfig // Physics parameters for player movement
}

interface DebugConfig {
    showFPS: boolean
    showFrameBorders: boolean
    lowFrameRate: boolean // 低帧率模式开关
}

interface PaperTextureConfig {
    noiseScale: number
    grainDensity: number
    baseColor: string
    dotGap: number
    dotOffset: number
}

interface CourtConfig {
    // 3D rotation parameters
    rotationX: number
    rotationY: number
    rotationZ: number
    // Rotation origin (0-1, percentage of court dimensions)
    originX: number
    originY: number
    originZ: number
}

interface FloorConfig {
    // Horizontal offset for floor texture (0-1)
    offsetX: number
    // Vertical position as percentage of canvas height (0-1, 0=top, 1=bottom)
    offsetY: number
    // Slime bottom position as percentage of floor height (0=top, 1=bottom)
    contentRatio: number
}

interface BallNetConfig {
    // Left net position (0-1, percentage of canvas dimensions)
    leftX: number
    leftY: number
    // Right net position (0-1, percentage of canvas dimensions)
    rightX: number
    rightY: number
    // Scale factor for both nets
    scale: number
}

interface SceneConfig {
    // Floor configuration
    floor: FloorConfig
    // Ball nets configuration
    ballNets: BallNetConfig
}

type GamePage = "main" | "playing"

export interface GameState {
    fps: number
    canvas: CanvasConfig
    player: PlayerConfig
    debug: DebugConfig
    paperTexture: PaperTextureConfig
    court: CourtConfig
    scene: SceneConfig
    currentPage: GamePage
    isPaused: boolean
}

export const gameState: GameState = {
    fps: 60,
    currentPage: "playing",
    isPaused: false,
    canvas: {
        width: 1280,
        height: 720,
        aspectRatio: 16 / 9
    },
    player: {
        selectedPlayer: 1,
        physics: {
            gravity: 0.9,            // Gravity acceleration
            initialJumpVelocity: 0.5, // Initial upward velocity when jumping
            moveSpeed: 0.75          // Movement speed (percentage moved per frame)
        },
        slimes: [
            {
                x: 0.2, // 20% from left
                y: 0.8, // 80% from top
                scale: 1.0,
                score: 0,
                isJumping: false,
                jumpVelocity: 0,
                jumpHeight: 0,
                baseY: 0.8 // Store the base Y position for returning after jump
            },
            {
                x: 0.8, // 80% from left
                y: 0.8, // 80% from top
                scale: 1.0,
                score: 0,
                isJumping: false,
                jumpVelocity: 0,
                jumpHeight: 0,
                baseY: 0.8 // Store the base Y position for returning after jump
            }
        ]
    },
    debug: {
        showFPS: true,
        showFrameBorders: true,
        lowFrameRate: true // 默认启用低帧率模式
    },
    paperTexture: {
        noiseScale: 0.015,
        grainDensity: 0.02,
        dotGap: 4,
        baseColor: "#000000",
        dotOffset: 42
    },
    court: {
        rotationX: 0.53,
        rotationY: 0,
        rotationZ: 0,
        originX: 0, // 默认在左侧
        originY: 0.87, // 默认在底部
        originZ: 0.5
    },
    scene: {
        floor: {
            offsetX: 0,
            offsetY: 0.8,
            contentRatio: 0.34
        },
        ballNets: {
            leftX: 0.03,
            leftY: 0.4,
            rightX: 0.97,
            rightY: 0.4,
            scale: 0.5
        }
    }
}
