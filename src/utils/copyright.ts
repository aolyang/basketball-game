import type P5 from "p5"

import { gameState } from "../config/gameState"

/**
 * Renders copyright information at the bottom of the screen
 * @param p5 - The p5 instance
 */
export function renderCopyright(p5: P5) {
    const currentYear = new Date().getFullYear()
    const copyrightText = `© ${currentYear} Basketball Game. All Rights Reserved. But you can use it for free.`

    p5.push()
    p5.fill(80) // Dark gray color
    p5.textSize(26) // Increased font size
    p5.textAlign(p5.CENTER, p5.BOTTOM)
    p5.text(copyrightText, gameState.canvas.width / 2, gameState.canvas.height - 20)
    p5.pop()
}
