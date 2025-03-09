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

interface BackboardConfig {
    // Position (0-1, percentage of canvas dimensions)
    positionX: number
    positionY: number
    positionZ: number
    // Rotation (in radians)
    rotationX: number
    rotationY: number
    rotationZ: number
    // Rotation origin (0-1, percentage of backboard dimensions)
    originX: number
    originY: number
    originZ: number
    // Scale factor
    scale: number
    // Visibility
    visible: boolean
}

type GamePage = "main" | "playing"

interface GameState {
    fps: number
    canvas: CanvasConfig
    player: PlayerConfig
    debug: DebugConfig
    paperTexture: PaperTextureConfig
    court: CourtConfig
    backboard: BackboardConfig
    currentPage: GamePage
    isPaused: boolean
}

export const gameState: GameState = {
    fps: 60,
    canvas: {
        width: 1280,
        height: 720,
        aspectRatio: 16 / 9
    },
    player: {
        selectedPlayer: 1,
        isSelectionAnimating: false,
        selectionAnimationStartTime: 0,
        flashCount: 0
    },
    debug: {
        showFPS: true
    },
    paperTexture: {
        noiseScale: 0.015,
        grainDensity: 0.02,
        baseColor: "#f5f2e9",
        dotGap: 4,
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
    backboard: {
        positionX: 0.1, // 默认在画布左侧
        positionY: 0.71, // 默认在画布下方
        positionZ: -0.25, // 默认向后偏移
        rotationX: 0,
        rotationY: -0.43, // 默认向左旋转
        rotationZ: 0,
        originX: 0.5, // 默认在篮板中心
        originY: 0.5, // 默认在篮板中心
        originZ: 0, // 默认在篮板表面
        scale: 1,
        visible: true
    },
    currentPage: "playing",
    isPaused: false
}
