import type P5 from "p5"
import type { KeyboardControls, PlayerControlState } from "../utils/keyboardMap"

import { gameState } from "../config/gameState"
import { DEFAULT_KEYBOARD_MAP, getPlayerControlState } from "../utils/keyboardMap"

// Cache keyboard mapping
let keyboardMap: KeyboardControls = DEFAULT_KEYBOARD_MAP

/**
 * Initialize keyboard mapping
 */
export function initKeyboardControls(): void {
    // 使用静态配置，不需要初始化
    keyboardMap = DEFAULT_KEYBOARD_MAP
}

/**
 * Handle slime keyboard controls
 * Update slime position and state
 * @param p5 p5 instance
 */
export function handleSlimeControls(p5: P5): void {
    const { selectedPlayer } = gameState.player
    const { width } = gameState.canvas

    // 创建 isKeyDown 回调函数
    const isKeyDown = (keyCode: number) => p5.keyIsDown(keyCode)

    // Get player 1 control state
    const player1Controls = getPlayerControlState(keyboardMap, 1, isKeyDown)

    // Update player 1 slime position
    updateSlimePosition(0, player1Controls, width)

    // If in two-player mode, also update player 2 slime
    if (selectedPlayer === 2) {
        const player2Controls = getPlayerControlState(keyboardMap, 2, isKeyDown)
        updateSlimePosition(1, player2Controls, width)
    }
}

/**
 * Update slime position
 * @param slimeIndex Slime index (0 or 1)
 * @param controls Control state
 * @param canvasWidth Canvas width
 */
function updateSlimePosition(
    slimeIndex: number,
    controls: PlayerControlState,
    canvasWidth: number
): void {
    const slime = gameState.player.slimes[slimeIndex]

    // Movement speed (percentage moved per frame)
    const moveSpeed = 0.01

    // Update X coordinate based on movement direction
    if (controls.movementDirection !== 0) {
        slime.x += controls.movementDirection * moveSpeed

        // Ensure slime doesn't move off screen
        slime.x = Math.max(0.05, Math.min(0.95, slime.x))
    }

    // TODO: Implement jump and attack logic
    // Animation state updates for jumping and attacking can be added here
    // For example:
    // if (controls.isJumping) {
    //   // Trigger jump animation
    // }
    //
    // if (controls.isAttacking) {
    //   // Trigger attack animation
    // }
}
