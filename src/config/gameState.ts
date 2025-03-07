interface CanvasConfig {
    width: number
    height: number
    aspectRatio: number
}

interface PlayerConfig {
    selectedPlayer: number
}

interface DebugConfig {
    showFPS: boolean
    showColliders: boolean
}

interface GameState {
    canvas: CanvasConfig
    player: PlayerConfig
    debug: DebugConfig
}

export const gameState: GameState = {
    canvas: {
        width: 1280,
        height: 720,
        aspectRatio: 16 / 9
    },
    player: {
        selectedPlayer: 0
    },
    debug: {
        showFPS: false,
        showColliders: false
    }
}