interface CanvasConfig {
    width: number
    height: number
    aspectRatio: number
}

interface PlayerConfig {
    selectedPlayer: number
    isSelectionAnimating: boolean
    selectionAnimationStartTime: number
    flashCount: number
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

type GamePage = "main" | "playing"

interface GameState {
    fps: number
    canvas: CanvasConfig
    player: PlayerConfig
    debug: DebugConfig
    paperTexture: PaperTextureConfig
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
        baseColor: "#000000",
        dotGap: 4,
        dotOffset: 420
    },
    currentPage: "playing",
    isPaused: false
}
