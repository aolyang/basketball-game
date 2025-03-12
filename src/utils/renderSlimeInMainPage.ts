import type P5 from "p5"

import { gameState } from "../config/gameState"
import { getSlimeJumpAnimation } from "./slimeAnimation"

/**
 * Render the slime jump animation
 * When player 2 is selected, renders two slimes (green and yellow)
 * @param p5 The p5 instance
 */
export function renderSlimeJumpAnimation(p5: P5): void {
    const slimeJumpAnimation = getSlimeJumpAnimation()
    if (!slimeJumpAnimation) return

    // Update the animation state
    slimeJumpAnimation.update(p5)

    // Scale factor for the sprite
    const scale = 0.25 // 15% of canvas width

    // Render the first (green) slime in the bottom right corner
    slimeJumpAnimation.draw(
        p5,
        0.85 - scale, // x position (85% of canvas width minus sprite width)
        0.85 - scale, // y position (85% of canvas height minus sprite height)
        scale, // width (15% of canvas width)
        scale // height (15% of canvas height)
    )

    // If player 2 is selected, render a second slime with yellow tint
    if (gameState.player.selectedPlayer === 2) {
        // Render the second slime (yellow) to the left of the first one
        slimeJumpAnimation.draw(
            p5,
            1.0 - scale, // x position (70% of canvas width minus sprite width)
            0.85 - scale, // y position (85% of canvas height minus sprite height)
            scale, // width (15% of canvas width)
            scale, // height (15% of canvas height)
            {
                r: 255,
                g: 220,
                b: 0
            }
        )
    }
}
