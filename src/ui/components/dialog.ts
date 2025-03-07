import type P5 from "p5"

interface DialogConfig {
    title: string
    onConfirm: () => void
    onCancel: () => void
    isVisible: boolean
}

export class Dialog {
    private config: DialogConfig
    private buttonWidth = 100
    private buttonHeight = 40
    private padding = 20
    private dialogWidth = 300
    private dialogHeight = 200

    constructor(config: DialogConfig) {
        this.config = config
    }

    render(p5: P5) {
        if (!this.config.isVisible) return

        // Calculate center position
        const centerX = p5.width / 2
        const centerY = p5.height / 2

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
        this.drawButton(p5, centerX - 60, centerY + 40, "Cancel", false)
        this.drawButton(p5, centerX + 60, centerY + 40, "Confirm", true)
        p5.pop()
    }

    private drawButton(p5: P5, x: number, y: number, text: string, isConfirm: boolean) {
        const isHovered = this.isMouseOverButton(p5, x, y)
        p5.push()
        p5.rectMode(p5.CENTER)
        p5.fill(isHovered ? 200 : 240)
        p5.rect(x, y, this.buttonWidth, this.buttonHeight)
        p5.fill(0)
        p5.textAlign(p5.CENTER, p5.CENTER)
        p5.textSize(16)
        p5.text(text, x, y)
        p5.pop()

        if (isHovered && p5.mouseIsPressed) {
            if (isConfirm) {
                this.config.onConfirm()
            } else {
                this.config.onCancel()
            }
        }
    }

    private isMouseOverButton(p5: P5, x: number, y: number): boolean {
        return p5.mouseX > x - this.buttonWidth / 2 &&
            p5.mouseX < x + this.buttonWidth / 2 &&
            p5.mouseY > y - this.buttonHeight / 2 &&
            p5.mouseY < y + this.buttonHeight / 2
    }

    show() {
        this.config.isVisible = true
    }

    hide() {
        this.config.isVisible = false
    }

    isVisible(): boolean {
        return this.config.isVisible
    }
}