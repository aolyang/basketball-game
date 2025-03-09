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
let lastSceneType = ""
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
    const sceneType = gameState.scene.type

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
        lastSceneType !== sceneType

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
    const sceneType = gameState.scene.type

    lastCanvasWidth = width
    lastCanvasHeight = height
    lastFloorOffsetX = offsetX
    lastFloorOffsetY = offsetY
    lastSceneType = sceneType
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
 * Renders the texture at the bottom of the screen with horizontal tiling
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

        // Fixed texture dimensions (240x240)
        const textureWidth = 240
        const textureHeight = 240
        
        // Calculate floor position
        // Position from bottom of screen, with offsetY adjustment
        const floorY = height / 2 - textureHeight / 2 - offsetY
        
        // Calculate number of tiles needed to cover the width
        const tilesNeeded = Math.ceil(width / textureWidth)
        
        g.push()
        
        // Set texture properties
        g.textureMode(p5.NORMAL)
        g.textureWrap(p5.REPEAT, p5.CLAMP)
        
        // Draw the floor as a series of quads with the texture
        for (let i = 0; i < tilesNeeded; i++) {
            const x = -width/2 + i * textureWidth + offsetX % textureWidth
            
            g.push()
            g.translate(x, floorY, 0)
            g.texture(floorTexture)
            g.plane(textureWidth, textureHeight)
            g.pop()
        }
        
        g.pop()

        // Draw WebGL canvas to main canvas
        p5.image(g, 0, 0)
    }
}
