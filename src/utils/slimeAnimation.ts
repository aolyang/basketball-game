import type P5 from "p5"

import slimeHitUrl from "../assets/slime-hit.png"
import slimeJumpUrl from "../assets/slime-jump.png"
import slimeMoveUrl from "../assets/slime-move.png"
import { FrameAnimation } from "./frameAnimation"

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
    const jumpFrameCount = Math.floor(slimeJumpImg.height / slimeJumpImg.width)
    const hitFrameCount = Math.floor(slimeHitImg.height / slimeHitImg.width)
    const moveFrameCount = Math.floor(slimeMoveImg.height / slimeMoveImg.width)

    console.log("count", jumpFrameCount, hitFrameCount, moveFrameCount)
    // Create animation instances
    slimeJumpAnimation = new FrameAnimation({
        image: slimeJumpImg,
        frameWidth: slimeJumpImg.width,
        frameHeight: slimeJumpImg.width,
        frameCount: jumpFrameCount,
        entityOffsetTop: 0.15, // Slime starts 15% from the top of the frame
        entityOffsetBottom: 0.12 // Slime ends 15% from the bottom of the frame
    })

    slimeHitAnimation = new FrameAnimation({
        image: slimeHitImg,
        frameWidth: slimeHitImg.width,
        frameHeight: slimeHitImg.width,
        frameCount: hitFrameCount,
        entityOffsetTop: 0.15, // Slime starts 15% from the top of the frame
        entityOffsetBottom: 0.15 // Slime ends 15% from the bottom of the frame
    })

    slimeMoveAnimation = new FrameAnimation({
        image: slimeMoveImg,
        frameWidth: slimeMoveImg.width,
        frameHeight: slimeMoveImg.width,
        frameCount: moveFrameCount,
        entityOffsetTop: 0.15, // Slime starts 15% from the top of the frame
        entityOffsetBottom: 0.15 // Slime ends 15% from the bottom of the frame
    })
}

export function getSlimeJumpAnimation(): FrameAnimation | null {
    return slimeJumpAnimation
}

export function getSlimeHitAnimation(): FrameAnimation | null {
    return slimeHitAnimation
}

export function getSlimeMoveAnimation(): FrameAnimation | null {
    return slimeMoveAnimation
}
