import type P5 from "p5"
import type { KeyboardControls, PlayerControlState } from "../utils/keyboardMap"

import { gameState } from "../config/gameState"
import { DEFAULT_KEYBOARD_MAP, getPlayerControlState, logKeyboardEvents } from "../utils/keyboardMap"

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

    // Log keyboard events to console
    logKeyboardEvents(keyboardMap, isKeyDown)

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
    const playerIndex = slimeIndex + 1

    // Get physics parameters from gameState
    // Scale moveSpeed from 0-1 range to appropriate game value (0-0.02)
    const moveSpeed = gameState.player.physics.moveSpeed * 0.02

    // Update X coordinate based on movement direction
    if (controls.movementDirection !== 0) {
        slime.x += controls.movementDirection * moveSpeed

        // Ensure slime doesn't move off screen
        slime.x = Math.max(0.05, Math.min(0.95, slime.x))

        // Log position information
        console.log(`Player ${playerIndex} position: ${slime.x.toFixed(4)} (direction: ${controls.movementDirection})`)
    }

    // Handle jump action
    if (controls.isJumping && !slime.isJumping) {
        // Log jump action
        console.log(`Player ${playerIndex} jump action triggered`)
        // Trigger the jump by setting initial velocity from gameState
        // Scale initialJumpVelocity from 0-1 range to appropriate game value (0-0.05)
        slime.isJumping = true
        slime.jumpVelocity = gameState.player.physics.initialJumpVelocity * 0.05
        slime.baseY = slime.y // Store the base Y position
    }

    // Apply gravity physics if slime is jumping
    if (slime.isJumping) {
        // Apply gravity (reduce velocity) using value from gameState
        // Scale gravity from 0-1 range to appropriate game value (0-0.003)
        slime.jumpVelocity -= gameState.player.physics.gravity * 0.003

        // Update position based on velocity
        slime.y -= slime.jumpVelocity

        // Calculate jump height for animation purposes
        slime.jumpHeight = slime.baseY - slime.y

        // Check if slime has landed
        if (slime.y >= slime.baseY) {
            // Reset jump state
            slime.isJumping = false
            slime.jumpVelocity = 0
            slime.jumpHeight = 0
            slime.y = slime.baseY // Ensure slime is exactly at base position
            console.log(`Player ${playerIndex} landed`)
        }
    }

    // Handle attack/hit action
    if (controls.isAttacking) {
        if (!slime.isHitting && !slime.isCharging) {
            // Start charging when attack key is first pressed
            console.log(`Player ${playerIndex} charging started`)
            slime.isCharging = true
            slime.chargeStartTime = Date.now()
            slime.chargeLevel = 0

            // Also start hit animation but we'll pause it at the last frame
            slime.isHitting = true
            slime.hitStartTime = Date.now()
        } else if (slime.isCharging) {
            // Update charge level while key is held (0-100%)
            const currentTime = Date.now()
            const chargeElapsedTime = currentTime - slime.chargeStartTime
            // Max charge time adjusted by shared chargeSpeed (higher speed = faster charging)
            const maxChargeTime = 2000 / gameState.player.chargeSpeed
            slime.chargeLevel = Math.min(1.0, chargeElapsedTime / maxChargeTime)
        }
    } else if (slime.isCharging) {
        // Key was released, end charging
        console.log(`释放 (Player ${playerIndex} released charge at level: ${Math.round(slime.chargeLevel * 100)}%)`)
        slime.isCharging = false
    }

    // Update hit animation state
    if (slime.isHitting) {
        const currentTime = Date.now()
        const hitElapsedTime = currentTime - slime.hitStartTime

        // If charging, keep the animation on the last frame
        if (slime.isCharging) {
            // Let the animation run until the last frame
            if (hitElapsedTime < slime.hitDuration) {
                // Animation is still running to reach last frame
            } else {
                // Keep the animation paused at the last frame while charging
            }
        } else {
            // Normal hit animation behavior when not charging
            if (hitElapsedTime >= slime.hitDuration) {
                slime.isHitting = false
                console.log(`Player ${playerIndex} hit animation completed`)
            }
        }
    }
}
