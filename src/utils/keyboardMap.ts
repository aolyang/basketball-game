import type P5 from "p5"

/**
 * Keyboard mapping configuration
 * Supports standard keyboard and 76-key mini keyboard
 * Provides different control keys for two-player mode
 */
export interface KeyboardControls {
    // Player 1 control keys
    player1: {
        left: number
        right: number
        jump: number
        attack: number
    }
    // Player 2 control keys
    player2: {
        left: number
        right: number
        jump: number
        attack: number
    }
}

/**
 * Default keyboard mapping
 * Player 1: A/D movement, W jump, S attack
 * Player 2: Arrow keys left/right movement, up jump, down attack
 */
export const DEFAULT_KEYBOARD_MAP: KeyboardControls = {
    player1: {
        left: 65, // A
        right: 68, // D
        jump: 87, // W
        attack: 83 // S
    },
    player2: {
        left: 37, // LEFT_ARROW (37)
        right: 39, // RIGHT_ARROW (39)
        jump: 38, // UP_ARROW (38)
        attack: 40 // DOWN_ARROW (40)
    }
}

// Store previously pressed keys to detect changes
let previouslyPressedKeys: Set<number> = new Set()

/**
 * Get character corresponding to key code
 * @param keyCode Key code
 * @returns Key character
 */
export function getKeyChar(keyCode: number): string {
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
 * Get control name for a key code
 * @param keyMap Keyboard mapping
 * @param keyCode Key code
 * @returns Control name and player index
 */
export function getControlInfo(keyMap: KeyboardControls, keyCode: number): { player: number; control: string } | null {
    // Check player 1 controls
    if (keyMap.player1.left === keyCode) return { player: 1, control: "left" }
    if (keyMap.player1.right === keyCode) return { player: 1, control: "right" }
    if (keyMap.player1.jump === keyCode) return { player: 1, control: "jump" }
    if (keyMap.player1.attack === keyCode) return { player: 1, control: "attack" }

    // Check player 2 controls
    if (keyMap.player2.left === keyCode) return { player: 2, control: "left" }
    if (keyMap.player2.right === keyCode) return { player: 2, control: "right" }
    if (keyMap.player2.jump === keyCode) return { player: 2, control: "jump" }
    if (keyMap.player2.attack === keyCode) return { player: 2, control: "attack" }

    // Not a game control
    return null
}

/**
 * Log keyboard events to console
 * @param keyMap Keyboard mapping
 * @param isKeyDown Function to check if a key is pressed
 */
export function logKeyboardEvents(
    keyMap: KeyboardControls,
    isKeyDown: (keyCode: number) => boolean
): void {
    const currentlyPressedKeys: Set<number> = new Set()

    // Check all game control keys
    const allKeys = [
        ...Object.values(keyMap.player1),
        ...Object.values(keyMap.player2)
    ]

    // Check which keys are currently pressed
    for (const keyCode of allKeys) {
        if (isKeyDown(keyCode)) {
            currentlyPressedKeys.add(keyCode)
        }
    }

    // Find newly pressed keys (not in previous set but in current set)
    for (const keyCode of currentlyPressedKeys) {
        if (!previouslyPressedKeys.has(keyCode)) {
            // This key was just pressed
            const controlInfo = getControlInfo(keyMap, keyCode)
            if (controlInfo) {
                console.log(`Key Pressed: ${getKeyChar(keyCode)} (${keyCode}) - Player ${controlInfo.player} ${controlInfo.control}`)
            } else {
                console.log(`Key Pressed: ${getKeyChar(keyCode)} (${keyCode})`)
            }
        }
    }

    // Find released keys (in previous set but not in current set)
    for (const keyCode of previouslyPressedKeys) {
        if (!currentlyPressedKeys.has(keyCode)) {
            // This key was just released
            const controlInfo = getControlInfo(keyMap, keyCode)
            if (controlInfo) {
                console.log(`Key Released: ${getKeyChar(keyCode)} (${keyCode}) - Player ${controlInfo.player} ${controlInfo.control}`)
            } else {
                console.log(`Key Released: ${getKeyChar(keyCode)} (${keyCode})`)
            }
        }
    }

    // Update previously pressed keys for next frame
    previouslyPressedKeys = new Set(currentlyPressedKeys)
}

/**
 * Get current movement direction
 * 1: Move right
 * -1: Move left
 * 0: No movement
 * @param controls Control keys
 * @param isKeyDown Function to check if a key is pressed
 */
export function getMovementDirection(
    controls: { left: number; right: number },
    isKeyDown: (keyCode: number) => boolean
): number {
    let direction = 0

    if (isKeyDown(controls.left)) {
        direction -= 1
    }

    if (isKeyDown(controls.right)) {
        direction += 1
    }

    return direction
}

/**
 * Get player control state
 */
export interface PlayerControlState {
    movementDirection: number // -1: left, 0: no movement, 1: right
    isJumping: boolean
    isAttacking: boolean
}

/**
 * Get control state for specified player
 * @param keyMap Keyboard mapping
 * @param playerIndex Player index (1 or 2)
 * @param isKeyDown Function to check if a key is pressed
 */
export function getPlayerControlState(
    keyMap: KeyboardControls,
    playerIndex: 1 | 2,
    isKeyDown: (keyCode: number) => boolean
): PlayerControlState {
    const controls = playerIndex === 1 ? keyMap.player1 : keyMap.player2

    return {
        movementDirection: getMovementDirection(controls, isKeyDown),
        isJumping: isKeyDown(controls.jump),
        isAttacking: isKeyDown(controls.attack)
    }
}
