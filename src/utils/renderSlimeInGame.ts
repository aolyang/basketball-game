import type P5 from "p5"

import { gameState } from "../config/gameState"
import { getSlimeHitAnimation, getSlimeJumpAnimation,getSlimeMoveAnimation } from "./slimeAnimation"
import { FLOOR_HEIGHT_RATIO } from "./floorTextureRenderer"

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
    // Use FLOOR_HEIGHT_RATIO for consistent positioning
    const yPosition = FLOOR_HEIGHT_RATIO - slimeOffsetFromFloor

    // Draw all guide lines
    p5.push()

    // Common text settings
    p5.textSize(14)
    p5.textAlign(p5.LEFT, p5.CENTER)

    // Always draw the floor line
    p5.stroke(0, 0, 255)
    p5.strokeWeight(3)
    p5.line(0, FLOOR_HEIGHT_RATIO * height, width, FLOOR_HEIGHT_RATIO * height)
    p5.noStroke()
    p5.fill(0, 0, 255)
    p5.text("Floor", 10, FLOOR_HEIGHT_RATIO * height - 10)

    // Calculate positions for all lines
    const slimeTopY = yPosition * height
    const slimeBottomY = yPosition * height + (slimeMoveAnimation.frameHeight * scale)
    const entityBottomY = yPosition * height + 
        (slimeMoveAnimation.frameHeight * scale * slimeMoveAnimation.entityRatio) + 
        bottomPadding

    // Draw additional debug visualization if borders are enabled
    if (showFrameBorders) {
        // Slime top line (green)
        p5.stroke(0, 255, 0)
        p5.strokeWeight(2)
        p5.line(0, slimeTopY, width, slimeTopY)
        p5.noStroke()
        p5.fill(0, 255, 0)
        p5.text("Slime Top", 10, slimeTopY - 10)
        
        // Frame bottom line (magenta)
        p5.stroke(255, 0, 255)
        p5.strokeWeight(2)
        p5.line(0, slimeBottomY, width, slimeBottomY)
        p5.noStroke()
        p5.fill(255, 0, 255)
        p5.text("Frame Bottom", 10, slimeBottomY + 10)
        
        // Entity bottom line (yellow)
        p5.stroke(255, 255, 0)
        p5.strokeWeight(2)
        p5.line(0, entityBottomY, width, entityBottomY)
        p5.noStroke()
        p5.fill(255, 255, 0)
        p5.text("Entity Bottom", 10, entityBottomY + 10)
        
        // Current floor position (if different from FLOOR_HEIGHT_RATIO)
        if (Math.abs(floorOffsetY - FLOOR_HEIGHT_RATIO) > 0.001) {
            p5.stroke(255, 165, 0) // Orange
            p5.strokeWeight(1)
            p5.line(0, floorOffsetY * height, width, floorOffsetY * height)
            p5.noStroke()
            p5.fill(255, 165, 0)
            p5.text(`Current Floor: ${Math.round(floorOffsetY * 100)}%`, 10, floorOffsetY * height - 10)
        }
    } else {
        // When debug borders are disabled, still show minimal indicators on the left edge
        const indicatorWidth = 20 // Width of the indicator marks
        
        // Slime top indicator (green)
        p5.stroke(0, 255, 0)
        p5.strokeWeight(2)
        p5.line(0, slimeTopY, indicatorWidth, slimeTopY)
        p5.noStroke()
        p5.fill(0, 255, 0)
        p5.text("ST", 5, slimeTopY - 10)
        
        // Entity bottom indicator (yellow)
        p5.stroke(255, 255, 0)
        p5.strokeWeight(2)
        p5.line(0, entityBottomY, indicatorWidth, entityBottomY)
        p5.noStroke()
        p5.fill(255, 255, 0)
        p5.text("EB", 5, entityBottomY + 10)
    }
    
    p5.pop()

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
