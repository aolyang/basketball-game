import type P5 from "p5"

import { gameState } from "../config/gameState"
import { FLOOR_HEIGHT } from "./floorTextureRenderer"
import { getSlimeHitAnimation, getSlimeJumpAnimation, getSlimeMoveAnimation } from "./slimeAnimation"

// Cache last render parameters
let lastCanvasWidth = 0
let lastCanvasHeight = 0
let lastRenderTime = 0
let lastShowFrameBorders = false
let forceRender = true // Force first render

// Cache last slime positions
let lastSlimePositions = [
    { x: 0, y: 0 },
    { x: 0, y: 0 }
]

/**
 * Force next render
 */
export function forceNextRender(): void {
    forceRender = true
}

/**
 * Check if parameters have changed
 * @returns true if parameters have changed
 */
function hasParamsChanged(): boolean {
    const { width, height } = gameState.canvas
    const { showFrameBorders } = gameState.debug
    const { slimes } = gameState.player

    // First render or forced render
    if (forceRender) {
        forceRender = false
        return true
    }

    // Check if canvas size has changed
    const paramsChanged =
        lastCanvasWidth !== width ||
        lastCanvasHeight !== height ||
        lastShowFrameBorders !== showFrameBorders

    // Check if slime positions have changed
    const slimePositionsChanged = 
        lastSlimePositions[0].x !== slimes[0].x ||
        lastSlimePositions[0].y !== slimes[0].y ||
        lastSlimePositions[1].x !== slimes[1].x ||
        lastSlimePositions[1].y !== slimes[1].y

    // Force update every 30 seconds
    const currentTime = Date.now()
    const timeChanged = (currentTime - lastRenderTime > 30000)

    return paramsChanged || slimePositionsChanged || timeChanged
}

/**
 * Update cached parameters
 */
function updateCachedParams(): void {
    const { width, height } = gameState.canvas
    const { showFrameBorders } = gameState.debug
    const { slimes } = gameState.player

    lastCanvasWidth = width
    lastCanvasHeight = height
    lastShowFrameBorders = showFrameBorders
    lastRenderTime = Date.now()
    
    // Update cached slime positions
    lastSlimePositions[0].x = slimes[0].x
    lastSlimePositions[0].y = slimes[0].y
    lastSlimePositions[1].x = slimes[1].x
    lastSlimePositions[1].y = slimes[1].y
}

/**
 * Render slimes in the game page based on player selection
 * @param p5 The p5 instance
 */
export function renderSlimesInGame(p5: P5): void {
    // Get the slime animation
    const slimeMoveAnimation = getSlimeJumpAnimation()
    // const slimeHitAnimation = getSlimeHitAnimation()
    // const slimeJumpAnimation = getSlimeJumpAnimation()

    if (!slimeMoveAnimation) return

    slimeMoveAnimation.update(p5)

    // Update cached parameters if needed
    if (hasParamsChanged()) {
        updateCachedParams()
    }

    const { selectedPlayer } = gameState.player
    const { showFrameBorders } = gameState.debug
    const { width, height } = gameState.canvas
    const { contentRatio, offsetY: floorOffsetY } = gameState.scene.floor

    // Scale factor for the sprite (relative to canvas width)
    const scale = 0.15

    const currentFloorY = height * floorOffsetY
    const floorTopY = currentFloorY - (FLOOR_HEIGHT / 2)

    const floorRealYPercent = floorTopY + (FLOOR_HEIGHT * contentRatio)

    const yPosition = floorRealYPercent / height - 0.15 + (slimeMoveAnimation.entityOffsetBottom * scale)

    // Use the slime's configured position from gameState for player 1
    const player1Slime = gameState.player.slimes[0]
    
    // Draw player 1 slime at its current position
    slimeMoveAnimation.draw(
        p5,
        player1Slime.x, // x position from gameState
        yPosition, // y position
        scale, // width
        scale, // height
        undefined, // no tint
        showFrameBorders // show borders if debug setting is enabled
    )

    // If two players are selected, render the second slime
    if (selectedPlayer === 2) {
        // Get player 2 slime position from gameState
        const player2Slime = gameState.player.slimes[1]
        
        // Render second slime with yellow tint at its current position
        slimeMoveAnimation.draw(
            p5,
            player2Slime.x, // x position from gameState
            yPosition, // y position
            scale, // width
            scale, // height
            {
                r: 255,
                g: 220,
                b: 0
            },
            showFrameBorders // show borders if debug setting is enabled
        )
    }
}
