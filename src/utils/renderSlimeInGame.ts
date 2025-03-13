import type P5 from "p5"

import { FLOOR_HEIGHT_RATIO } from "./floorTextureRenderer"
import { gameState } from "../config/gameState"
import { getSlimeHitAnimation, getSlimeJumpAnimation, getSlimeMoveAnimation } from "./slimeAnimation"

// Cache last render parameters
let lastCanvasWidth = 0
let lastCanvasHeight = 0
let lastRenderTime = 0
let lastShowFrameBorders = false
let forceRender = true // Force first render

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

    // Force update every 30 seconds
    const currentTime = Date.now()
    const timeChanged = (currentTime - lastRenderTime > 30000)

    return paramsChanged || timeChanged
}

/**
 * Update cached parameters
 */
function updateCachedParams(): void {
    const { width, height } = gameState.canvas
    const { showFrameBorders } = gameState.debug

    lastCanvasWidth = width
    lastCanvasHeight = height
    lastShowFrameBorders = showFrameBorders
    lastRenderTime = Date.now()
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

    // Scale factor for the sprite (relative to canvas width)
    const scale = 0.15

    // Get floor position from gameState (0-1 percentage of canvas height)
    const floorOffsetY = gameState.scene.floor.offsetY

    // Calculate the effective height of the slime entity within the frame
    // Consider both the scale and the entity ratio
    const effectiveSlimeHeight = slimeMoveAnimation.frameHeight * scale * slimeMoveAnimation.entityRatio

    // Calculate the offset needed to position the slime's bottom at the floor level
    // We need to account for the empty space in the frame
    const emptySpaceRatio = 1 - slimeMoveAnimation.entityRatio
    const bottomPadding = (slimeMoveAnimation.frameHeight * scale * emptySpaceRatio) / 2

    // Calculate the normalized offset (as percentage of canvas height)
    const slimeOffsetFromFloor = (effectiveSlimeHeight + bottomPadding) / height

    // Position the slime so its bottom touches the floor
    // Use current floor position from gameState
    const yPosition = floorOffsetY - slimeOffsetFromFloor

    // Render first slime (always present)
    // Position on left side for single player, or left-center for two players
    const firstSlimeX = selectedPlayer === 1 ? 0.2 : 0.3

    // Use the slime's configured position from gameState
    slimeMoveAnimation.draw(
        p5,
        firstSlimeX, // x position
        yPosition, // y position
        scale, // width
        scale, // height
        undefined, // no tint
        showFrameBorders // show borders if debug setting is enabled
    )

    // If two players are selected, render the second slime on the right side
    if (selectedPlayer === 2) {
        // Render second slime with yellow tint
        slimeMoveAnimation.draw(
            p5,
            0.7, // x position (right side)
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
