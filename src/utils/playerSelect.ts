import type P5 from "p5"

import { gameState } from "../config/gameState"
import { renderSVGPath } from "./svgPath"

const basketballSvgPath = "M1.333 2.89A6.97 6.97 0 0 0 0 7a6.97 6.97 0 0 0 1.333 4.11A4.55 4.55 0 0 0 2.87 9.355A5.2 5.2 0 0 0 3.423 7a5.24 5.24 0 0 0-.553-2.355A4.55 4.55 0 0 0 1.333 2.89m.826-.947a5.8 5.8 0 0 1 1.826 2.138c.453.895.688 1.9.688 2.919a6.5 6.5 0 0 1-.688 2.92a5.8 5.8 0 0 1-1.826 2.137a6.98 6.98 0 0 0 4.216 1.915V.028c-1.63.144-3.1.847-4.216 1.915m5.466 12.03a6.98 6.98 0 0 0 4.216-1.916a5.8 5.8 0 0 1-1.826-2.138A6.5 6.5 0 0 1 9.327 7c0-1.02.235-2.024.688-2.92a5.8 5.8 0 0 1 1.825-2.137A6.98 6.98 0 0 0 7.626.028v13.944ZM14 7a6.97 6.97 0 0 1-1.333 4.11a4.55 4.55 0 0 1-1.537-1.755A5.2 5.2 0 0 1 10.577 7c0-.828.191-1.64.553-2.355a4.55 4.55 0 0 1 1.537-1.755A6.97 6.97 0 0 1 14 7"

// Helper function to render a player option
function renderPlayerOption(p5: P5, text: string, x: number, y: number, fontSize: number) {
    p5.textSize(fontSize)
    p5.fill(255, 255, 255)
    p5.text(text, x, y)
}

// Helper function to render the basketball icon
function renderBasketballIcon(p5: P5, x: number, y: number, iconSize: number) {
    p5.push()
    p5.translate(x, y)
    p5.scale(iconSize / 14) // Scale SVG path (original SVG viewBox is 14x14)
    renderSVGPath(p5, basketballSvgPath, {
        fill: { r: 255, g: 165, b: 0 }
    })
    p5.pop()
}

export function renderPlayerSelect(p5: P5) {
    const { width, height } = gameState.canvas
    const baseYRatio = 0.73,
        spacing = 0.11 * height,
        fontSize = 0.09 * height,
        iconSize = fontSize * 0.8 // Basketball icon size relative to font size

    const { selectedPlayer, isSelectionAnimating, selectionAnimationStartTime, flashCount } = gameState.player
    const baseY = height * baseYRatio * 0.9

    // Handle animation timing and page transition
    if (isSelectionAnimating) {
        const currentTime = p5.millis()
        const elapsedTime = currentTime - selectionAnimationStartTime
        
        // Flash every 250ms (4 times per second)
        const shouldShow = Math.floor(elapsedTime / 250) % 2 === 0
        
        // Update flash count
        const newFlashCount = Math.floor(elapsedTime / 250)
        if (newFlashCount > flashCount) {
            gameState.player.flashCount = newFlashCount
        }
        
        // After 2 seconds (8 flashes), transition to game page
        if (elapsedTime >= 2000) {
            gameState.currentPage = "playing"
            gameState.player.isSelectionAnimating = false
            gameState.player.flashCount = 0
            return
        }
        
        // If we shouldn't show during this flash cycle, return early
        if (!shouldShow) {
            // Draw player selection title
            renderPlayerOption(p5, "player select", width / 4, baseY, fontSize)
            
            // Draw only the non-selected option
            if (selectedPlayer === 1) {
                renderPlayerOption(p5, "2 players", width / 3.22, baseY + spacing * 2, fontSize)
            } else {
                renderPlayerOption(p5, "1 player", width / 3.1, baseY + spacing, fontSize)
            }
            
            return
        }
    }

    // Draw player selection title and options
    renderPlayerOption(p5, "player select", width / 4, baseY, fontSize)
    renderPlayerOption(p5, "1 player", width / 3.1, baseY + spacing, fontSize)
    renderPlayerOption(p5, "2 players", width / 3.22, baseY + spacing * 2, fontSize)

    // Calculate icon position based on selected player
    const iconX = width / 3.1 - iconSize * 1.5
    const iconY = baseY + (selectedPlayer === 1 ? spacing * 0.78 : spacing * 1.76) - iconSize / 2

    // Render the basketball icon
    renderBasketballIcon(p5, iconX, iconY, iconSize)
}
