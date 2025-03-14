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
    /**
     * The offset from the top of the frame to the top of the entity (0-1)
     * For example, if the entity starts 20% from the top of the frame, this would be 0.2
     */
    entityOffsetTop?: number
    /**
     * The offset from the bottom of the frame to the bottom of the entity (0-1)
     * For example, if the entity ends 10% from the bottom of the frame, this would be 0.1
     */
    entityOffsetBottom?: number
}

export class FrameAnimation {
    private image: P5.Image
    readonly frameWidth: number
    readonly frameHeight: number
    readonly frameCount: number
    readonly entityOffsetTop: number = 0.1 // Default to 10% from top
    readonly entityOffsetBottom: number = 0.1 // Default to 10% from bottom
    private frameRate: number
    private loop: boolean
    private currentFrame: number = 0
    private lastFrameTime: number = 0
    private isPlaying: boolean = true

    constructor(options: FrameAnimationOptions) {
        this.image = options.image
        this.frameWidth = options.frameWidth || this.image.width
        this.frameHeight = options.frameHeight || this.image.width
        this.frameCount = options.frameCount || this.image.height / this.image.width

        // Handle entity dimensions with array destructuring
        {[this.entityOffsetTop, this.entityOffsetBottom] = [
            options.entityOffsetTop || 0.1,// Default to 10% from top
            options.entityOffsetBottom || 0.1 // Default to 10% from bottom
        ]}
        this.frameRate = options.frameRate || 12 // Default to 12 FPS
        this.loop = options.loop !== undefined ? options.loop : true // Default to looping
    }

    /**
     * Get the entity top position as a percentage of frame height
     */
    getEntityTopPosition(): number {
        return this.entityOffsetTop
    }

    /**
     * Get the entity bottom position as a percentage of frame height
     */
    getEntityBottomPosition(): number {
        return 1 - this.entityOffsetBottom
    }

    /**
     * Get the entity height ratio (percentage of frame height)
     */
    getEntityHeightRatio(): number {
        return 1 - (this.entityOffsetTop + this.entityOffsetBottom)
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
     * Force the animation to the last frame
     */
    forceLastFrame(): void {
        this.currentFrame = this.frameCount - 1
    }

    /**
     * Draw the current frame of the animation at a position specified as percentages of canvas dimensions
     * @param p5 The p5 instance
     * @param xPercent The x position as a percentage of canvas width (0-1)
     * @param yPercent The y position as a percentage of canvas height (0-1)
     * @param widthPercent Optional width as a percentage of canvas width (0-1)
     * @param heightPercent Optional height as a percentage of canvas height (0-1)
     * @param filter Optional filter to apply to the image (e.g., tint)
     * @param showBorders Optional flag to show frame borders for debugging
     */
    draw(p5: P5, xPercent: number, yPercent: number, widthPercent?: number, heightPercent?: number, filter?: {
        r: number
        g: number
        b: number
        a?: number
    }, showBorders?: boolean): void {
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

        // Draw borders if requested
        if (showBorders) {
            p5.noFill()
            p5.stroke(255, 0, 0) // Red stroke for borders
            p5.strokeWeight(2)

            // Draw border around the frame
            p5.rect(x, y + verticalOffset, destWidth, destHeight)

            // Draw source frame indicator
            p5.stroke(0, 255, 0) // Green stroke for source frame
            p5.line(x, y + verticalOffset, x + destWidth, y + verticalOffset + destHeight) // Diagonal line
            p5.line(x + destWidth, y + verticalOffset, x, y + verticalOffset + destHeight) // Diagonal line

            // Calculate entity boundaries based on entityOffsetTop and entityOffsetBottom
            const entityTopY = y + verticalOffset + (destHeight * this.entityOffsetTop)
            const entityBottomY = y + verticalOffset + (destHeight * (1 - this.entityOffsetBottom))

            // Draw entity top boundary (blue line)
            p5.stroke(0, 100, 255)
            p5.strokeWeight(2)
            p5.line(x, entityTopY, x + destWidth, entityTopY)
            p5.noStroke()
            p5.fill(0, 100, 255)
            p5.textSize(12)
            p5.textAlign(p5.LEFT, p5.CENTER)
            p5.text(`Entity Top (${Math.round(this.entityOffsetTop * 100)}%)`, x + 5, entityTopY - 10)

            // Draw entity bottom boundary (magenta line)
            p5.stroke(255, 0, 255)
            p5.strokeWeight(2)
            p5.line(x, entityBottomY, x + destWidth, entityBottomY)
            p5.noStroke()
            p5.fill(255, 0, 255)
            p5.textSize(12)
            p5.textAlign(p5.LEFT, p5.CENTER)
            p5.text(`Entity Bottom (${Math.round((1 - this.entityOffsetBottom) * 100)}%)`, x + 5, entityBottomY + 10)

            // Draw frame number and entity ratio
            p5.noStroke()
            p5.fill(255, 255, 0) // Yellow text
            p5.textSize(16)
            p5.textAlign(p5.CENTER, p5.CENTER)
            p5.text(`Frame: ${this.currentFrame} (Ratio: ${Math.round(this.getEntityHeightRatio() * 100)}%)`, x + destWidth/2, y + verticalOffset - 10)
        }

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
