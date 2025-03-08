import type P5 from "p5"

import slimeHitUrl from "../assets/slime-hit.png"
import slimeJumpUrl from "../assets/slime-jump.png"
import slimeMoveUrl from "../assets/slime-move.png"
import { gameState } from "../config/gameState"
import { FrameAnimation } from "./frameAnimation"

// Animation configurations
const SLIME_FRAME_WIDTH = 240
const SLIME_FRAME_HEIGHT = 240

// Different slime animations
let slimeJumpAnimation: FrameAnimation | null = null
let slimeHitAnimation: FrameAnimation | null = null
let slimeMoveAnimation: FrameAnimation | null = null

// Preloaded images
let slimeJumpImg: P5.Image
let slimeHitImg: P5.Image
let slimeMoveImg: P5.Image

/**
 * Preload all slime animation images
 * @param p5 The p5 instance
 */
export function preloadSlimeAnimations(p5: P5): void {
    slimeJumpImg = p5.loadImage(slimeJumpUrl)
    slimeHitImg = p5.loadImage(slimeHitUrl)
    slimeMoveImg = p5.loadImage(slimeMoveUrl)
}

/**
 * Initialize all slime animations
 */
export function initSlimeAnimations(): void {
    // Count frames by dividing image height by frame height
    const jumpFrameCount = Math.floor(slimeJumpImg.height / SLIME_FRAME_HEIGHT)
    const hitFrameCount = Math.floor(slimeHitImg.height / SLIME_FRAME_HEIGHT)
    const moveFrameCount = Math.floor(slimeMoveImg.height / SLIME_FRAME_HEIGHT)

    // Create animation instances
    slimeJumpAnimation = new FrameAnimation({
        image: slimeJumpImg,
        frameWidth: SLIME_FRAME_WIDTH,
        frameHeight: SLIME_FRAME_HEIGHT,
        frameCount: jumpFrameCount,
        frameRate: 10, // Adjust as needed
        loop: true
    })

    slimeHitAnimation = new FrameAnimation({
        image: slimeHitImg,
        frameWidth: SLIME_FRAME_WIDTH,
        frameHeight: SLIME_FRAME_HEIGHT,
        frameCount: hitFrameCount,
        frameRate: 10,
        loop: true
    })

    slimeMoveAnimation = new FrameAnimation({
        image: slimeMoveImg,
        frameWidth: SLIME_FRAME_WIDTH,
        frameHeight: SLIME_FRAME_HEIGHT,
        frameCount: moveFrameCount,
        frameRate: 10,
        loop: true
    })
}

/**
 * Render the slime jump animation
 * When player 2 is selected, renders two slimes (green and yellow)
 * @param p5 The p5 instance
 */
export function renderSlimeJumpAnimation(p5: P5): void {
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

/**
 * Get the slime jump animation instance
 */
export function getSlimeJumpAnimation(): FrameAnimation | null {
    return slimeJumpAnimation
}

/**
 * Get the slime hit animation instance
 */
export function getSlimeHitAnimation(): FrameAnimation | null {
    return slimeHitAnimation
}

/**
 * Get the slime move animation instance
 */
export function getSlimeMoveAnimation(): FrameAnimation | null {
    return slimeMoveAnimation
}
