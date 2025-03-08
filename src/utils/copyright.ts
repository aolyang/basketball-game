import type P5 from "p5"

import { gameState } from "../config/gameState"

/**
 * Renders copyright information at the bottom of the screen
 * Automatically adjusts font size based on canvas dimensions
 * @param p5 - The p5 instance
 */
export function renderCopyright(p5: P5) {
    const currentYear = new Date().getFullYear()
    const copyrightText = `© ${currentYear} Basketball Game. All Rights Reserved. But you can use it for free.`

    // Calculate appropriate font size based on canvas width
    // This ensures text is readable but not too large on different screen sizes
    const minFontSize = 12
    const maxFontSize = 26

    // Calculate font size as a percentage of canvas width
    // 1.5% of canvas width, but clamped between min and max values
    const calculatedSize = Math.min(maxFontSize, Math.max(minFontSize, gameState.canvas.width * 0.015))

    // Calculate bottom margin based on canvas height
    const bottomMargin = Math.max(10, gameState.canvas.height * 0.03)

    p5.push()
    p5.fill(80) // Dark gray color
    p5.textSize(calculatedSize)
    p5.textAlign(p5.CENTER, p5.BOTTOM)

    // Check if text width exceeds canvas width
    const textWidth = p5.textWidth(copyrightText)
    if (textWidth > gameState.canvas.width * 0.9) {
        // If text is too wide, reduce font size further
        const scaleFactor = (gameState.canvas.width * 0.9) / textWidth
        p5.textSize(calculatedSize * scaleFactor)
    }

    p5.text(copyrightText, gameState.canvas.width / 2, gameState.canvas.height - bottomMargin)
    p5.pop()
}
