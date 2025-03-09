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

type GamePage = "main" | "playing"

export interface GameState {
    fps: number
    canvas: CanvasConfig
    player: PlayerConfig
    debug: DebugConfig
    paperTexture: PaperTextureConfig
    court: CourtConfig
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
        baseColor: "#f5f2e9",
        dotOffset: 42
    },
    court: {
        rotationX: 0.53,
        rotationY: 0,
        rotationZ: 0,
        originX: 0, // 默认在左侧
        originY: 0.87, // 默认在底部
        originZ: 0.5
    }
}
