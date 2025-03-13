import type P5 from "p5"

import { gameState } from "../config/gameState"

// Cache WebGL canvas
let floorCanvas: P5.Graphics | null = null
// Cache texture
let floorTexture: P5.Image | null = null

// Cache last render parameters
let lastCanvasWidth = 0
let lastCanvasHeight = 0
let lastRenderTime = 0
let lastFloorOffsetX = 0
let lastFloorOffsetY = 0
let lastContentRatio = 0
let lastShowFrameBorders = false
let forceRender = true // Force first render

export const FLOOR_HEIGHT = 240
/**
 * Preload floor texture
 * @param p5 p5 instance
 */
export function preloadFloorTexture(p5: P5): void {
    floorTexture = p5.loadImage("./src/assets/floor.png",
        () => {
            console.log("Floor texture loaded successfully")
            forceRender = true // Force render after image loads
        },
        () => console.error("Failed to load floor texture")
    )
}

/**
 * Initialize WebGL canvas
 * @param p5 p5 instance
 */
function initFloorCanvas(p5: P5): void {
    const { width, height } = gameState.canvas
    floorCanvas = p5.createGraphics(width, height, p5.WEBGL)
    forceRender = true // Force render after canvas initialization
}

/**
 * Check if parameters have changed
 * @returns true if parameters have changed
 */
function hasParamsChanged(): boolean {
    const { width, height } = gameState.canvas
    const { offsetX, offsetY, contentRatio } = gameState.scene.floor
    const { showFrameBorders } = gameState.debug

    // First render or forced render
    if (forceRender) {
        forceRender = false
        return true
    }

    // Check if parameters have changed
    const paramsChanged =
        lastCanvasWidth !== width ||
        lastCanvasHeight !== height ||
        lastFloorOffsetX !== offsetX ||
        lastFloorOffsetY !== offsetY ||
        lastContentRatio !== contentRatio ||
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
    const { offsetX, offsetY, contentRatio } = gameState.scene.floor
    const { showFrameBorders } = gameState.debug

    lastCanvasWidth = width
    lastCanvasHeight = height
    lastFloorOffsetX = offsetX
    lastFloorOffsetY = offsetY
    lastContentRatio = contentRatio
    lastShowFrameBorders = showFrameBorders
    lastRenderTime = Date.now()
}

/**
 * Force next render
 */
export function forceNextRender(): void {
    forceRender = true
}

/**
 * Render floor texture
 * Renders the texture at the specified position with horizontal tiling
 * @param p5 p5 instance
 */
export function renderFloorTexture(p5: P5): void {
    // If texture not loaded, try to load it
    if (!floorTexture) {
        preloadFloorTexture(p5)
        return
    }

    // Skip rendering if parameters haven't changed
    if (!hasParamsChanged() && floorCanvas) {
        // Use cached canvas
        p5.image(floorCanvas, 0, 0)

        // Draw the reference floor line
        drawFloorReferenceLine(p5)
        return
    }

    // Update cached parameters
    updateCachedParams()

    // Lazy initialize WebGL canvas
    if (!floorCanvas) {
        initFloorCanvas(p5)
    }

    // Update floor size if canvas size changed
    if (floorCanvas && (floorCanvas.width !== gameState.canvas.width ||
        floorCanvas.height !== gameState.canvas.height)) {
        floorCanvas.remove()
        initFloorCanvas(p5)
    }

    // Render floor texture on WebGL canvas
    if (floorCanvas && floorTexture) {
        const g = floorCanvas
        // Clear background
        g.clear()

        const { width, height } = gameState.canvas
        const { offsetX, offsetY } = gameState.scene.floor
        const { showFrameBorders } = gameState.debug

        // Fixed texture dimensions (240x240)
        const textureWidth = 240
        const textureHeight = 240

        // Calculate floor position based on canvas height percentage
        // offsetY is now a percentage (0-1) where 0 is top and 1 is bottom
        const floorY = (height * offsetY) - (height / 2)

        // Calculate floor top position (current floor position minus half texture height)
        const floorTopY = floorY - (textureHeight / 2)

        // Calculate number of tiles needed to cover the width
        const tilesNeeded = Math.ceil(width / textureWidth) + 1 // Add one extra tile to ensure smooth scrolling

        g.push()

        // Set texture properties
        g.textureMode(p5.NORMAL)
        g.textureWrap(p5.REPEAT, p5.CLAMP)

        // Apply stroke settings based on debug setting
        if (showFrameBorders) {
            g.stroke(255, 0, 0) // Red stroke for borders
            g.strokeWeight(2)
            g.noFill()
        } else {
            g.noStroke()
            g.noFill()
        }

        // Use custom rendering to avoid borders between tiles
        g.beginShape(p5.TRIANGLE_STRIP)
        g.texture(floorTexture)

        // Calculate the starting X position with offset
        const startX = -width/2 - (offsetX % textureWidth)

        // Create a continuous strip of triangles for the entire floor
        for (let i = 0; i <= tilesNeeded; i++) {
            const x = startX + i * textureWidth

            // Top-left vertex
            g.vertex(x, floorY - textureHeight/2, 0, 0, 0)
            // Bottom-left vertex
            g.vertex(x, floorY + textureHeight/2, 0, 0, 1)

            // Top-right vertex
            g.vertex(x + textureWidth, floorY - textureHeight/2, 0, 1, 0)
            // Bottom-right vertex
            g.vertex(x + textureWidth, floorY + textureHeight/2, 0, 1, 1)
        }

        g.endShape()
        // Draw WebGL canvas to main canvas
        p5.image(g, 0, 0)

        drawFloorReferenceLine(p5)
    }
}

/**
 * Draw a reference line at the floor height based on content ratio
 * and current floor position if different
 * @param p5 The p5 instance
 */
function drawFloorReferenceLine(p5: P5): void {
    const { width, height } = gameState.canvas
    const { offsetY, contentRatio } = gameState.scene.floor
    const { showFrameBorders } = gameState.debug

    // Calculate current floor position (center of texture)
    const currentFloorY = height * offsetY

    // Calculate floor top position (current floor position minus half texture height)
    const floorTopY = currentFloorY - (FLOOR_HEIGHT / 2)

    // Calculate floor real position based on contentRatio (0 = top, 1 = bottom)
    const floorRealY = floorTopY + (FLOOR_HEIGHT * contentRatio)

    p5.push()
    // Common text settings
    p5.textSize(14)
    p5.textAlign(p5.LEFT, p5.CENTER)

    // Only draw debug lines if showFrameBorders is enabled
    if (showFrameBorders) {
        // Draw the floor top edge
        p5.stroke(128, 128, 128) // Gray
        p5.strokeWeight(1)
        p5.line(0, floorTopY, width, floorTopY)
        p5.noStroke()
        p5.fill(128, 128, 128)
        p5.text("Floor Top", 10, floorTopY - 10)

        // Draw the floor real line
        p5.stroke(0, 255, 0) // Green
        p5.strokeWeight(2)
        p5.line(0, floorRealY, width, floorRealY)
        p5.noStroke()
        p5.fill(0, 255, 0)
        p5.text(`Floor Real: ${Math.round(contentRatio * 100)}%`, 10, floorRealY - 10)
    }

    // Draw a reference line at 50% height
    const halfwayY = height * 0.5
    p5.stroke(128, 128, 128) // Gray
    p5.strokeWeight(1)

    // Draw dashed line manually
    const dashLength = 5
    const gapLength = 5
    let x = 0
    while (x < width) {
        p5.line(x, halfwayY, x + dashLength, halfwayY)
        x += dashLength + gapLength
    }

    p5.noStroke()
    p5.fill(128, 128, 128)
    p5.text("50%", 10, halfwayY - 10)

    p5.pop()
}
