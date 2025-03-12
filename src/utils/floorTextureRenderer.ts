import type P5 from "p5"

import { gameState } from "../config/gameState"

// Static constants
export const FLOOR_HEIGHT_RATIO = 0.76 // Floor height is 76% of canvas height

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
let lastShowFrameBorders = false
let forceRender = true // Force first render

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
    const { offsetX, offsetY } = gameState.scene.floor
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
    const { offsetX, offsetY } = gameState.scene.floor
    const { showFrameBorders } = gameState.debug

    lastCanvasWidth = width
    lastCanvasHeight = height
    lastFloorOffsetX = offsetX
    lastFloorOffsetY = offsetY
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
 * Draw a reference line at the default floor height (FLOOR_HEIGHT_RATIO)
 * @param p5 The p5 instance
 */
function drawFloorReferenceLine(p5: P5): void {
    const { width, height } = gameState.canvas
    const defaultFloorY = height * FLOOR_HEIGHT_RATIO

    p5.push()
    // Draw a green line at the default floor height
    p5.stroke(0, 200, 0)
    p5.strokeWeight(1)
    p5.line(0, defaultFloorY, width, defaultFloorY)

    // Add a small label
    p5.noStroke()
    p5.fill(0, 200, 0)
    p5.textSize(12)
    p5.textAlign(p5.LEFT, p5.CENTER)
    p5.text(`${Math.round(FLOOR_HEIGHT_RATIO * 100)}%`, 5, defaultFloorY - 8)
    p5.pop()
}
