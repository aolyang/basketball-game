import type P5 from "p5"

import { gameState } from "../config/gameState"
import { renderSVGPath } from "./svgPath"

// Basketball SVG path from playerSelect.ts
const basketballSvgPath = "M1.333 2.89A6.97 6.97 0 0 0 0 7a6.97 6.97 0 0 0 1.333 4.11A4.55 4.55 0 0 0 2.87 9.355A5.2 5.2 0 0 0 3.423 7a5.24 5.24 0 0 0-.553-2.355A4.55 4.55 0 0 0 1.333 2.89m.826-.947a5.8 5.8 0 0 1 1.826 2.138c.453.895.688 1.9.688 2.919a6.5 6.5 0 0 1-.688 2.92a5.8 5.8 0 0 1-1.826 2.137a6.98 6.98 0 0 0 4.216 1.915V.028c-1.63.144-3.1.847-4.216 1.915m5.466 12.03a6.98 6.98 0 0 0 4.216-1.916a5.8 5.8 0 0 1-1.826-2.138A6.5 6.5 0 0 1 9.327 7c0-1.02.235-2.024.688-2.92a5.8 5.8 0 0 1 1.825-2.137A6.98 6.98 0 0 0 7.626.028v13.944ZM14 7a6.97 6.97 0 0 1-1.333 4.11a4.55 4.55 0 0 1-1.537-1.755A5.2 5.2 0 0 1 10.577 7c0-.828.191-1.64.553-2.355a4.55 4.55 0 0 1 1.537-1.755A6.97 6.97 0 0 1 14 7"

/**
 * Render basketball and shot trajectory when a slime is charging
 * @param p5 p5 instance
 */
export function renderBasketballShot(p5: P5): void {
    const { width, height } = gameState.canvas
    const { selectedPlayer, basketballOffsetX, basketballOffsetY, basketballSize } = gameState.player
    const { leftX, leftY, rightX, rightY } = gameState.scene.ballNets
    
    // Check if any slime is charging
    const player1Slime = gameState.player.slimes[0]
    const player2Slime = gameState.player.slimes[1]
    
    // Render for player 1 if charging
    if (player1Slime.isCharging) {
        // Calculate basketball position above slime's head
        const basketballX = player1Slime.x * width
        const basketballY = (player1Slime.y + basketballOffsetY) * height
        
        // Determine target net based on player position (left side player aims for right net)
        const targetNetX = rightX * width
        const targetNetY = rightY * height
        
        // Draw basketball
        drawBasketball(p5, basketballX, basketballY, basketballSize * width)
        
        // Draw trajectory curve
        drawTrajectory(p5, basketballX, basketballY, targetNetX, targetNetY, player1Slime.chargeLevel)
    }
    
    // Render for player 2 if in two-player mode and charging
    if (selectedPlayer === 2 && player2Slime.isCharging) {
        // Calculate basketball position above slime's head
        const basketballX = player2Slime.x * width
        const basketballY = (player2Slime.y + basketballOffsetY) * height
        
        // Determine target net based on player position (right side player aims for left net)
        const targetNetX = leftX * width
        const targetNetY = leftY * height
        
        // Draw basketball
        drawBasketball(p5, basketballX, basketballY, basketballSize * width)
        
        // Draw trajectory curve
        drawTrajectory(p5, basketballX, basketballY, targetNetX, targetNetY, player2Slime.chargeLevel)
    }
}

/**
 * Draw basketball at specified position
 * @param p5 p5 instance
 * @param x x position in pixels
 * @param y y position in pixels
 * @param size size in pixels
 */
function drawBasketball(p5: P5, x: number, y: number, size: number): void {
    p5.push()
    p5.translate(x, y)
    p5.scale(size / 14) // Scale SVG path (original SVG viewBox is 14x14)
    
    // Render basketball with orange fill
    renderSVGPath(p5, basketballSvgPath, {
        fill: { r: 255, g: 165, b: 0 }
    })
    
    p5.pop()
}

/**
 * Draw trajectory curve from basketball to target net
 * @param p5 p5 instance
 * @param startX starting x position in pixels
 * @param startY starting y position in pixels
 * @param endX ending x position in pixels
 * @param endY ending y position in pixels
 * @param chargeLevel charge level (0-1)
 */
function drawTrajectory(p5: P5, startX: number, startY: number, endX: number, endY: number, chargeLevel: number): void {
    // Only draw trajectory if charge level is above 0
    if (chargeLevel <= 0) return
    
    // Calculate the distance between start and target based on charge level
    // Higher charge level = longer trajectory
    const maxDistanceRatio = 1.5 // Maximum distance ratio when fully charged
    const distanceRatio = chargeLevel * maxDistanceRatio
    
    // Calculate the actual endpoint based on charge level
    // Instead of fixed endpoint at the net, we calculate it proportionally
    const deltaX = endX - startX
    const deltaY = endY - startY
    
    // Calculate the direction vector from start to target
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const directionX = deltaX / distance
    const directionY = deltaY / distance
    
    // Calculate the actual endpoint with a fixed 45-degree angle
    // We use a 1:1 ratio for x and y movement to maintain 45 degrees
    const actualDistance = distance * distanceRatio
    const actualEndX = startX + directionX * actualDistance
    const actualEndY = startY + directionY * actualDistance
    
    // Calculate control point for the bezier curve with fixed 45-degree angle
    const midX = (startX + actualEndX) / 2
    const controlY = Math.min(startY, actualEndY) - (actualDistance * 0.5) // Fixed arc height relative to distance
    
    // Set curve style based on charge level
    const alpha = Math.min(255, chargeLevel * 255)
    p5.stroke(255, 255, 255, alpha)
    p5.strokeWeight(2 * chargeLevel)
    p5.noFill()
    
    // Draw bezier curve
    p5.beginShape()
    p5.vertex(startX, startY)
    p5.quadraticVertex(midX, controlY, actualEndX, actualEndY)
    p5.endShape()
}