import type P5 from "p5"

import { gameState } from "../config/gameState"

/**
 * Calculates the canvas size maintaining aspect ratio based on window dimensions
 * @param p5 The p5 instance
 */
export function calculateCanvasSize(p5: P5) {
    const windowWidth = p5.windowWidth
    const windowHeight = p5.windowHeight

    // Calculate canvas size maintaining aspect ratio
    if (windowWidth / windowHeight > gameState.canvas.aspectRatio) {
        // Window is wider than needed
        gameState.canvas.height = windowHeight
        gameState.canvas.width = windowHeight * gameState.canvas.aspectRatio
    } else {
        // Window is taller than needed
        gameState.canvas.width = windowWidth
        gameState.canvas.height = windowWidth / gameState.canvas.aspectRatio
    }
}

/**
 * Sets up DPI scaling for the p5 canvas based on device pixel ratio
 * @param p5 The p5 instance
 */
export function setupDPIScaling(p5: P5) {
    p5.pixelDensity(window.devicePixelRatio)
}
