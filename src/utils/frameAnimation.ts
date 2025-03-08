import type P5 from "p5"

import { gameState } from "../config/gameState"

interface FrameAnimationOptions {
    /**
     * The image to use for the animation
     */
    image: P5.Image
    /**
     * The width of each frame
     */
    frameWidth: number
    /**
     * The height of each frame
     */
    frameHeight: number
    /**
     * The number of frames in the animation
     */
    frameCount: number
    /**
     * The frame rate of the animation (frames per second)
     */
    frameRate?: number
    /**
     * Whether the animation should loop
     */
    loop?: boolean
}

export class FrameAnimation {
    private image: P5.Image
    private frameWidth: number
    private frameHeight: number
    private frameCount: number
    private frameRate: number
    private loop: boolean
    private currentFrame: number = 0
    private lastFrameTime: number = 0
    private isPlaying: boolean = true

    constructor(options: FrameAnimationOptions) {
        this.image = options.image
        this.frameWidth = options.frameWidth
        this.frameHeight = options.frameHeight
        this.frameCount = options.frameCount
        this.frameRate = options.frameRate || 12 // Default to 12 FPS
        this.loop = options.loop !== undefined ? options.loop : true // Default to looping
    }

    /**
     * Update the animation state
     * @param p5 The p5 instance
     */
    update(p5: P5): void {
        if (!this.isPlaying) return

        const currentTime = p5.millis()
        const frameDuration = 1000 / this.frameRate

        if (currentTime - this.lastFrameTime >= frameDuration) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount

            // If we've reached the end and we're not looping, stop the animation
            if (this.currentFrame === 0 && !this.loop) {
                this.isPlaying = false
                this.currentFrame = this.frameCount - 1 // Stay on last frame
            }

            this.lastFrameTime = currentTime
        }
    }

    /**
     * Draw the current frame of the animation at a position specified as percentages of canvas dimensions
     * @param p5 The p5 instance
     * @param xPercent The x position as a percentage of canvas width (0-1)
     * @param yPercent The y position as a percentage of canvas height (0-1)
     * @param widthPercent Optional width as a percentage of canvas width (0-1)
     * @param heightPercent Optional height as a percentage of canvas height (0-1)
     * @param filter Optional filter to apply to the image (e.g., tint)
     */
    draw(p5: P5, xPercent: number, yPercent: number, widthPercent?: number, heightPercent?: number, filter?: {
        r: number
        g: number
        b: number
        a?: number
    }): void {
        // Calculate the source rectangle y-position based on current frame
        const sourceY = Math.floor(this.currentFrame) * this.frameHeight

        // Calculate actual pixel positions and dimensions based on canvas size
        const canvasWidth = gameState.canvas.width
        const canvasHeight = gameState.canvas.height

        const x = xPercent * canvasWidth
        const y = yPercent * canvasHeight

        // Calculate destination dimensions
        let destWidth: number
        let destHeight: number

        if (widthPercent !== undefined) {
            destWidth = widthPercent * canvasWidth
            // If only width is specified, maintain aspect ratio
            if (heightPercent === undefined) {
                const aspectRatio = this.frameHeight / this.frameWidth
                destHeight = destWidth * aspectRatio
            } else {
                destHeight = heightPercent * canvasHeight
            }
        } else {
            // Default to original frame dimensions
            destWidth = this.frameWidth
            destHeight = this.frameHeight
        }

        // Center the frame vertically if needed
        // This helps prevent the frame from appearing to be drawn too high
        const verticalOffset = 0 // No offset by default

        p5.push()
        p5.imageMode(p5.CORNER) // Ensure we're using CORNER mode for consistent positioning

        // Apply filter if provided
        if (filter) {
            if (filter.a !== undefined) {
                p5.tint(filter.r, filter.g, filter.b, filter.a)
            } else {
                p5.tint(filter.r, filter.g, filter.b)
            }
        }

        p5.image(
            this.image,
            x, y + verticalOffset, destWidth, destHeight, // Destination rectangle with vertical adjustment
            0, sourceY, this.frameWidth, this.frameHeight // Source rectangle
        )

        p5.pop()
    }

    /**
     * Play the animation
     */
    play(): void {
        this.isPlaying = true
    }

    /**
     * Pause the animation
     */
    pause(): void {
        this.isPlaying = false
    }

    /**
     * Reset the animation to the first frame
     */
    reset(): void {
        this.currentFrame = 0
        this.lastFrameTime = 0
    }

    /**
     * Check if the animation is currently playing
     */
    isAnimationPlaying(): boolean {
        return this.isPlaying
    }

    /**
     * Get the current frame index
     */
    getCurrentFrame(): number {
        return this.currentFrame
    }

    /**
     * Set the current frame index
     */
    setCurrentFrame(frame: number): void {
        this.currentFrame = Math.max(0, Math.min(frame, this.frameCount - 1))
    }
}
