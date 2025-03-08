import type P5 from "p5"

interface DialogConfig {
    title: string
    onConfirm: () => void
    onCancel: () => void
    onShow?: () => void
    onHide?: () => void
    isVisible: boolean
}

export class Dialog {
    private config: DialogConfig
    private buttonWidth = 100
    private buttonHeight = 40
    private dialogWidth = 300
    private dialogHeight = 200
    private cancelButtonHovered = false
    private confirmButtonHovered = false
    private lastMouseX = 0
    private lastMouseY = 0

    constructor(config: DialogConfig) {
        this.config = config
    }

    render(p5: P5) {
        if (!this.config.isVisible) return

        // Calculate center position
        const centerX = p5.width / 2
        const centerY = p5.height / 2

        // Only recalculate hover state when mouse moves
        if (p5.mouseX !== this.lastMouseX || p5.mouseY !== this.lastMouseY) {
            this.lastMouseX = p5.mouseX
            this.lastMouseY = p5.mouseY

            // Calculate button positions
            const cancelX = centerX - 60
            const confirmX = centerX + 60
            const buttonY = centerY + 40

            // Update hover states
            this.cancelButtonHovered = this.isMouseOverButton(p5, cancelX, buttonY)
            this.confirmButtonHovered = this.isMouseOverButton(p5, confirmX, buttonY)
        }

        // Draw dialog background
        p5.push()
        p5.fill(255)
        p5.stroke(0)
        p5.rectMode(p5.CENTER)
        p5.rect(centerX, centerY, this.dialogWidth, this.dialogHeight)

        // Draw title
        p5.fill(0)
        p5.noStroke()
        p5.textAlign(p5.CENTER, p5.CENTER)
        p5.textSize(24)
        p5.text(this.config.title, centerX, centerY - 40)

        // Draw buttons
        this.drawButton(p5, centerX - 60, centerY + 40, "Cancel", false, this.cancelButtonHovered)
        this.drawButton(p5, centerX + 60, centerY + 40, "Confirm", true, this.confirmButtonHovered)
        p5.pop()

        // Handle click events
        if (p5.mouseIsPressed) {
            if (this.cancelButtonHovered) {
                this.config.onCancel()
                p5.mouseIsPressed = false // Prevent multiple triggers
            } else if (this.confirmButtonHovered) {
                this.config.onConfirm()
                p5.mouseIsPressed = false // Prevent multiple triggers
            }
        }
    }

    private drawButton(p5: P5, x: number, y: number, text: string, isConfirm: boolean, isHovered: boolean) {
        p5.push()
        p5.rectMode(p5.CENTER)
        // Use deeper color for confirm button
        if (isConfirm) {
            // Blue color scheme for confirm button
            p5.fill(isHovered ? 100 : 150, isHovered ? 150 : 180, isHovered ? 240 : 220)
            // Add gray border to confirm button
            p5.stroke(80)
            p5.strokeWeight(2)
        } else {
            // Gray color scheme for cancel button
            p5.fill(isHovered ? 200 : 240)
            p5.noStroke()
        }
        p5.rect(x, y, this.buttonWidth, this.buttonHeight, 5) // Add rounded corners
        // Use white text for confirm button to improve contrast
        p5.noStroke() // Ensure text has no stroke
        if (isConfirm) {
            p5.fill(255)
        } else {
            p5.fill(0)
        }
        p5.textAlign(p5.CENTER, p5.CENTER)
        p5.textSize(16)
        p5.text(text, x, y)
        p5.pop()
    }

    private isMouseOverButton(p5: P5, x: number, y: number): boolean {
        return p5.mouseX > x - this.buttonWidth / 2 &&
            p5.mouseX < x + this.buttonWidth / 2 &&
            p5.mouseY > y - this.buttonHeight / 2 &&
            p5.mouseY < y + this.buttonHeight / 2
    }

    show() {
        this.config.isVisible = true
        this.config.onShow?.()
    }

    hide() {
        this.config.isVisible = false
        this.config.onHide?.()
    }

    isVisible(): boolean {
        return this.config.isVisible
    }
}
