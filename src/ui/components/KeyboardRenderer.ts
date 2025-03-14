import type P5 from "p5"
import type { KeyboardControls } from "../../utils/keyboardMap"

/**
 * Mechanical keyboard style key renderer
 */
export class KeyboardRenderer {
    private keySize: number = 40
    private keyGap: number = 5
    private keyRadius: number = 6 // Changed from 4 to 6px for rounded corners
    private keyboardMap: KeyboardControls | null = null
    private pressedKeys: Set<number> = new Set()

    /**
   * Set keyboard mapping
   * @param keyboardMap Keyboard mapping configuration
   */
    setKeyboardMap(keyboardMap: KeyboardControls): void {
        this.keyboardMap = keyboardMap
    }

    /**
   * Update currently pressed keys
   * @param p5 p5 instance
   */
    updatePressedKeys(p5: P5): void {
        this.pressedKeys.clear()

        // Check all possible keys
        if (this.keyboardMap) {
            const { player1, player2 } = this.keyboardMap

            // Check player 1 keys
            if (p5.keyIsDown(player1.left)) this.pressedKeys.add(player1.left)
            if (p5.keyIsDown(player1.right)) this.pressedKeys.add(player1.right)
            if (p5.keyIsDown(player1.jump)) this.pressedKeys.add(player1.jump)
            if (p5.keyIsDown(player1.attack)) this.pressedKeys.add(player1.attack)

            // Check player 2 keys
            if (p5.keyIsDown(player2.left)) this.pressedKeys.add(player2.left)
            if (p5.keyIsDown(player2.right)) this.pressedKeys.add(player2.right)
            if (p5.keyIsDown(player2.jump)) this.pressedKeys.add(player2.jump)
            if (p5.keyIsDown(player2.attack)) this.pressedKeys.add(player2.attack)
        }
    }

    /**
   * Get character corresponding to key code
   * @param keyCode Key code
   * @returns Key character
   */
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

        // Other keys return key code
        return String.fromCharCode(keyCode)
    }

    /**
   * Render a single key
   * @param p5 p5 instance
   * @param x Key X coordinate
   * @param y Key Y coordinate
   * @param keyCode Key code
   * @param isPressed Whether the key is pressed
   */
    private renderKey(p5: P5, x: number, y: number, keyCode: number, isPressed: boolean): void {
        const keyChar = this.getKeyChar(keyCode)

        // Set key style
        p5.push()

        // Key shadow
        p5.noStroke()
        p5.fill(30, 30, 30, 200)
        p5.rect(x + 2, y + 4, this.keySize, this.keySize, this.keyRadius)

        // Key background - use white background
        if (isPressed) {
            // Style when pressed
            p5.fill(240, 240, 240) // Slightly grayish white
            p5.stroke(50, 50, 50)
            p5.strokeWeight(2)
            p5.rect(x + 1, y + 2, this.keySize, this.keySize, this.keyRadius)
        } else {
            // Style when not pressed - white background, dark border
            p5.fill(255, 255, 255) // Pure white background
            p5.stroke(50, 50, 50)
            p5.strokeWeight(2)
            p5.rect(x, y, this.keySize, this.keySize, this.keyRadius)
        }

        // Key text
        p5.fill(0)
        p5.textSize(16)
        p5.textAlign(p5.CENTER, p5.CENTER)
        p5.text(keyChar, x + this.keySize / 2, y + this.keySize / 2 - 2)

        p5.pop()
    }

    /**
   * Render control hint text
   * @param p5 p5 instance
   * @param x Text X coordinate
   * @param y Text Y coordinate
   */
    renderControlsText(p5: P5, x: number, y: number): void {
        if (!this.keyboardMap) return

        const { player1, player2 } = this.keyboardMap

        p5.push()
        p5.textSize(16)
        p5.textAlign(p5.CENTER, p5.CENTER)
        p5.fill(0)

        // Player 1 control hints
        const p1LeftKey = this.getKeyChar(player1.left)
        const p1RightKey = this.getKeyChar(player1.right)
        const p1JumpKey = this.getKeyChar(player1.jump)
        const p1AttackKey = this.getKeyChar(player1.attack)

        const p1Text = `P1 Move: Left ${p1LeftKey} Right ${p1RightKey} | Jump: ${p1JumpKey} | Attack: ${p1AttackKey}`
        p5.text(p1Text, x, y)

        // Player 2 control hints
        const p2LeftKey = this.getKeyChar(player2.left)
        const p2RightKey = this.getKeyChar(player2.right)
        const p2JumpKey = this.getKeyChar(player2.jump)
        const p2AttackKey = this.getKeyChar(player2.attack)

        const p2Text = `P2 Move: Left ${p2LeftKey} Right ${p2RightKey} | Jump: ${p2JumpKey} | Attack: ${p2AttackKey}`
        p5.text(p2Text, x, y + 25)

        p5.pop()
    }

    /**
   * Render mechanical keyboard
   * @param p5 p5 instance
   * @param x Keyboard X coordinate
   * @param y Keyboard Y coordinate
   */
    renderKeyboard(p5: P5, x: number, y: number): void {
        if (!this.keyboardMap) return

        this.updatePressedKeys(p5)

        const { player1, player2 } = this.keyboardMap

        p5.push()

        // Keyboard background
        p5.fill(50, 50, 50, 200)
        p5.rect(x, y, 5 * (this.keySize + this.keyGap), 3 * (this.keySize + this.keyGap), 10)

        // Render player 1 keys
        this.renderKey(p5, x + this.keySize + this.keyGap, y + this.keyGap, player1.left, this.pressedKeys.has(player1.left))
        this.renderKey(p5, x + 3 * (this.keySize + this.keyGap), y + this.keyGap, player1.right, this.pressedKeys.has(player1.right))
        this.renderKey(p5, x + 2 * (this.keySize + this.keyGap), y + this.keyGap, player1.jump, this.pressedKeys.has(player1.jump))
        this.renderKey(p5, x + 2 * (this.keySize + this.keyGap), y + 2 * (this.keySize + this.keyGap), player1.attack, this.pressedKeys.has(player1.attack))

        // Render player 2 keys
        const p2StartX = x + 5 * (this.keySize + this.keyGap) + 20
        this.renderKey(p5, p2StartX + this.keySize + this.keyGap, y + this.keyGap, player2.left, this.pressedKeys.has(player2.left))
        this.renderKey(p5, p2StartX + 3 * (this.keySize + this.keyGap), y + this.keyGap, player2.right, this.pressedKeys.has(player2.right))
        this.renderKey(p5, p2StartX + 2 * (this.keySize + this.keyGap), y + this.keyGap, player2.jump, this.pressedKeys.has(player2.jump))
        this.renderKey(p5, p2StartX + 2 * (this.keySize + this.keyGap), y + 2 * (this.keySize + this.keyGap), player2.attack, this.pressedKeys.has(player2.attack))

        p5.pop()
    }
}
