import type P5 from "p5"

import { gameState } from "../config/gameState"

// Cache WebGL canvas
let netCanvas: P5.Graphics | null = null
// Cache texture
let netTexture: P5.Image | null = null

// Cache last render parameters
let lastCanvasWidth = 0
let lastCanvasHeight = 0
let lastRenderTime = 0
let lastLeftX = 0
let lastLeftY = 0.5
let lastRightX = 1
let lastRightY = 0.5
let lastScale = 1
let forceRender = true // Force first render

/**
 * Preload net texture
 * @param p5 p5 instance
 */
export function preloadNetTexture(p5: P5): void {
    netTexture = p5.loadImage("./src/assets/ball-net.png",
        () => {
            console.log("Ball net texture loaded successfully")
            forceRender = true // Force render after image loads
        },
        () => console.error("Failed to load ball net texture")
    )
}

/**
 * Initialize WebGL canvas
 * @param p5 p5 instance
 */
function initNetCanvas(p5: P5): void {
    const { width, height } = gameState.canvas
    netCanvas = p5.createGraphics(width, height, p5.WEBGL)
    forceRender = true // Force render after canvas initialization
}

/**
 * Check if parameters have changed
 * @returns true if parameters have changed
 */
function hasParamsChanged(): boolean {
    const { width, height } = gameState.canvas
    const { leftX, leftY, rightX, rightY, scale } = gameState.scene.ballNets

    // First render or forced render
    if (forceRender) {
        forceRender = false
        return true
    }

    // Check if parameters have changed
    const paramsChanged =
        lastCanvasWidth !== width ||
        lastCanvasHeight !== height ||
        lastLeftX !== leftX ||
        lastLeftY !== leftY ||
        lastRightX !== rightX ||
        lastRightY !== rightY ||
        lastScale !== scale

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
    const { leftX, leftY, rightX, rightY, scale } = gameState.scene.ballNets

    lastCanvasWidth = width
    lastCanvasHeight = height
    lastLeftX = leftX
    lastLeftY = leftY
    lastRightX = rightX
    lastRightY = rightY
    lastScale = scale
    lastRenderTime = Date.now()
}

/**
 * Force next render
 */
export function forceNextRender(): void {
    forceRender = true
}

/**
 * Render a single net at specified position
 * @param g WebGL graphics context
 * @param p5 p5 instance
 * @param xPos x position as percentage of canvas width (0-1)
 * @param yPos y position as percentage of canvas height (0-1)
 * @param scale scale factor for the net
 */
function renderSingleNet(g: P5.Graphics, p5: P5, xPos: number, yPos: number, scale: number = 1): void {
    if (!netTexture) return
    
    const { width, height } = gameState.canvas
    
    // Calculate net dimensions
    // Use a reasonable size relative to the canvas
    const netWidth = width * 0.15 * scale
    const netHeight = netWidth * (netTexture.height / netTexture.width) // Maintain aspect ratio
    
    // Calculate position in WebGL coordinates (centered at 0,0)
    const posX = xPos * width - width/2
    const posY = yPos * height - height/2
    
    g.push()
    
    // Position the net
    g.translate(posX, posY, 0)
    
    // Apply texture
    g.texture(netTexture)
    g.noStroke()
    
    // Draw the net as a plane
    g.plane(netWidth, netHeight)
    
    g.pop()
}

/**
 * Render ball nets at left and right sides of the canvas
 * @param p5 p5 instance
 */
export function renderBallNets(p5: P5): void {
    // If texture not loaded, try to load it
    if (!netTexture) {
        preloadNetTexture(p5)
        return
    }

    // Skip rendering if parameters haven't changed
    if (!hasParamsChanged() && netCanvas) {
        // Use cached canvas
        p5.image(netCanvas, 0, 0)
        return
    }

    // Update cached parameters
    updateCachedParams()

    // Lazy initialize WebGL canvas
    if (!netCanvas) {
        initNetCanvas(p5)
    }

    // Update canvas size if changed
    if (netCanvas && (netCanvas.width !== gameState.canvas.width ||
        netCanvas.height !== gameState.canvas.height)) {
        netCanvas.remove()
        initNetCanvas(p5)
    }

    // Render nets on WebGL canvas
    if (netCanvas && netTexture) {
        const g = netCanvas
        // Clear background
        g.clear()

        const { leftX, leftY, rightX, rightY, scale } = gameState.scene.ballNets
        
        // Render left net using configuration
        renderSingleNet(g, p5, leftX, leftY, scale)
        
        // Render right net using configuration
        renderSingleNet(g, p5, rightX, rightY, scale)

        // Draw WebGL canvas to main canvas
        p5.image(g, 0, 0)
    }
}