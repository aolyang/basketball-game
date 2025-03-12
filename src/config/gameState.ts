interface CanvasConfig {
    width: number
    height: number
    aspectRatio: number
}

interface PlayerConfig {
    selectedPlayer: number
    isSelectionAnimating?: boolean
    selectionAnimationStartTime?: number
    flashCount?: number
}

interface DebugConfig {
    showFPS: boolean
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
    // Vertical position from bottom (in pixels)
    offsetY: number
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
        selectedPlayer: 0
    },
    debug: {
        showFPS: true
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
            offsetY: 0
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
