import type { KeyboardControls } from "../../utils/keyboardMap"

export class KeyboardDrawer {
    private isVisible = false
    private toggleButton!: HTMLButtonElement
    private drawerElement!: HTMLDivElement

    // Static keyboard configuration
    private static readonly KEYBOARD_MAP: KeyboardControls = {
        player1: {
            left: 65, // A
            right: 68, // D
            jump: 87, // W
            attack: 83 // S
        },
        player2: {
            left: 37, // LEFT_ARROW
            right: 39, // RIGHT_ARROW
            jump: 38, // UP_ARROW
            attack: 40 // DOWN_ARROW
        }
    }

    constructor() {
        this.createToggleButton()
        this.createDrawer()
        this.updateDrawerContent()
    }

    private createToggleButton() {
        this.toggleButton = document.createElement("button")
        this.toggleButton.textContent = "⌨"
        this.toggleButton.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      padding: 10px;
      font-size: 20px;
      background: rgba(255, 255, 255, 0.9);
      border: 2px solid #333;
      border-radius: 8px;
      cursor: pointer;
      z-index: 1000;
      transition: transform 0.2s;
    `

        this.toggleButton.addEventListener("click", () => this.toggle())
        this.toggleButton.addEventListener("mouseover", () => {
            this.toggleButton.style.transform = "scale(1.1)"
        })
        this.toggleButton.addEventListener("mouseout", () => {
            this.toggleButton.style.transform = "scale(1)"
        })

        document.body.appendChild(this.toggleButton)
    }

    private createDrawer() {
        this.drawerElement = document.createElement("div")
        this.drawerElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.95);
      padding: 20px;
      transform: translateY(-100%);
      transition: transform 0.3s ease-in-out;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 999;
    `

        document.body.appendChild(this.drawerElement)
    }

    private getKeyChar(keyCode: number): string {
    // Special key mapping
        switch (keyCode) {
            case 37: return "←" // LEFT_ARROW
            case 39: return "→" // RIGHT_ARROW
            case 38: return "↑" // UP_ARROW
            case 40: return "↓" // DOWN_ARROW
        }

        // Letter and number keys
        if (keyCode >= 65 && keyCode <= 90) {
            return String.fromCharCode(keyCode)
        }

        return String.fromCharCode(keyCode)
    }

    private updateDrawerContent() {
        const { player1, player2 } = KeyboardDrawer.KEYBOARD_MAP

        this.drawerElement.innerHTML = `
      <div style="display: flex; justify-content: center; gap: 40px; font-family: Arial, sans-serif;">
        <div style="text-align: center;">
          <h3 style="margin: 0 0 10px 0;">Player 1 Controls</h3>
          <div style="display: grid; gap: 5px;">
            <div>Move Left: ${this.getKeyChar(player1.left)} | Move Right: ${this.getKeyChar(player1.right)}</div>
            <div>Jump: ${this.getKeyChar(player1.jump)} | Attack: ${this.getKeyChar(player1.attack)}</div>
          </div>
        </div>
        <div style="text-align: center;">
          <h3 style="margin: 0 0 10px 0;">Player 2 Controls</h3>
          <div style="display: grid; gap: 5px;">
            <div>Move Left: ${this.getKeyChar(player2.left)} | Move Right: ${this.getKeyChar(player2.right)}</div>
            <div>Jump: ${this.getKeyChar(player2.jump)} | Attack: ${this.getKeyChar(player2.attack)}</div>
          </div>
        </div>
      </div>
    `
    }

    show(): void {
        this.isVisible = true
        this.drawerElement.style.transform = "translateY(0)"
        this.toggleButton.style.transform = "scale(1) rotate(180deg)"
    }

    hide(): void {
        this.isVisible = false
        this.drawerElement.style.transform = "translateY(-100%)"
        this.toggleButton.style.transform = "scale(1) rotate(0deg)"
    }

    toggle(): void {
        if (this.isVisible) {
            this.hide()
        } else {
            this.show()
        }
    }

    destroy(): void {
        document.body.removeChild(this.toggleButton)
        document.body.removeChild(this.drawerElement)
    }
}
