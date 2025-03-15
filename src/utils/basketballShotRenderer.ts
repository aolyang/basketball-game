import type P5 from "p5"

import { gameState } from "../config/gameState"
import { renderSVGPath } from "./svgPath"

// Interface for tracking basketball shooting state
interface BasketballShot {
    isActive: boolean
    startTime: number
    startX: number
    startY: number
    targetX: number
    targetY: number
    controlX: number
    controlY: number
    chargeLevel: number
    duration: number
    currentX: number
    currentY: number
}

// Track shooting state for both players
// Now using arrays to store multiple basketballs for each player
const basketballShots: [BasketballShot[], BasketballShot[]] = [
    [], // Player 1 basketballs
    []  // Player 2 basketballs
]

// Function to create a new basketball shot object
function createBasketballShot(): BasketballShot {
    return {
        isActive: false,
        startTime: 0,
        startX: 0,
        startY: 0,
        targetX: 0,
        targetY: 0,
        controlX: 0,
        controlY: 0,
        chargeLevel: 0,
        duration: 0,
        currentX: 0,
        currentY: 0
    }
}

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
    
    // Process player 1 basketball
    if (player1Slime.isCharging) {
        // Calculate basketball position above slime's head
        const basketballX = player1Slime.x * width
        const basketballY = (player1Slime.y + basketballOffsetY) * height
        
        // Determine target net based on player position (left side player aims for right net)
        const targetNetX = rightX * width
        const targetNetY = rightY * height
        
        // Draw basketball above slime's head while charging
        drawBasketball(p5, basketballX, basketballY, basketballSize * width)
        
        // Draw trajectory curve
        drawTrajectory(p5, basketballX, basketballY, targetNetX, targetNetY, player1Slime.chargeLevel)
        
        // Create or update a temporary basketball for tracking charge parameters
        let chargingBall = basketballShots[0].find(ball => !ball.isActive)
        if (!chargingBall) {
            chargingBall = createBasketballShot()
            basketballShots[0].push(chargingBall)
        }
        
        // Store trajectory parameters for when charging ends
        chargingBall.startX = basketballX
        chargingBall.startY = basketballY
        chargingBall.targetX = targetNetX
        chargingBall.targetY = targetNetY
        chargingBall.chargeLevel = player1Slime.chargeLevel
        
        // Calculate control point for the bezier curve
        const deltaX = targetNetX - basketballX
        const deltaY = targetNetY - basketballY
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        const midX = (basketballX + targetNetX) / 2
        const controlY = Math.min(basketballY, targetNetY) - (distance * 0.5)
        
        chargingBall.controlX = midX
        chargingBall.controlY = controlY
    } else if (!player1Slime.isCharging && player1Slime.chargeLevel > 0) {
        // Player just released the charge, start a new shot
        console.log(`Player 1 shooting with charge level: ${Math.round(player1Slime.chargeLevel * 100)}%`)
        
        // Find the charging ball (should be the last one that was updated)
        const chargingBall = basketballShots[0].find(ball => !ball.isActive && ball.chargeLevel > 0)
        
        if (chargingBall) {
            // Activate the ball for flight
            chargingBall.isActive = true
            chargingBall.startTime = Date.now()
            
            // Shot duration based on charge level (faster shots with higher charge)
            // Duration between 500ms (full charge) and 1500ms (minimal charge)
            chargingBall.duration = 1500 - (player1Slime.chargeLevel * 1000)
        }
        
        // Reset charge level after shooting
        player1Slime.chargeLevel = 0
    }
    
    // Process all active basketballs for player 1
    for (let i = 0; i < basketballShots[0].length; i++) {
        const ball = basketballShots[0][i]
        
        if (ball.isActive) {
            // Continue animating the shot that's in progress
            const currentTime = Date.now()
            const elapsedTime = currentTime - ball.startTime
            const progress = Math.min(1.0, elapsedTime / ball.duration)
            
            // Calculate current position along the quadratic Bezier curve
            const t = progress
            const startX = ball.startX
            const startY = ball.startY
            const controlX = ball.controlX
            const controlY = ball.controlY
            const targetX = ball.targetX
            const targetY = ball.targetY
            
            // Quadratic Bezier formula: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
            const oneMinusT = 1 - t
            const currentX = oneMinusT * oneMinusT * startX + 2 * oneMinusT * t * controlX + t * t * targetX
            const currentY = oneMinusT * oneMinusT * startY + 2 * oneMinusT * t * controlY + t * t * targetY
            
            // Store current position
            ball.currentX = currentX
            ball.currentY = currentY
            
            // Draw basketball at current position
            drawBasketball(p5, currentX, currentY, basketballSize * width)
            
            // Check if shot is complete
            if (progress >= 1.0) {
                ball.isActive = false
                console.log("Player 1 shot complete")
                // Here you could add scoring logic
            }
        }
    }
    
    // Process player 2 basketball (similar logic)
    if (selectedPlayer === 2) {
        if (player2Slime.isCharging) {
            // Calculate basketball position above slime's head
            const basketballX = player2Slime.x * width
            const basketballY = (player2Slime.y + basketballOffsetY) * height
            
            // Determine target net based on player position (right side player aims for left net)
            const targetNetX = leftX * width
            const targetNetY = leftY * height
            
            // Draw basketball above slime's head while charging
            drawBasketball(p5, basketballX, basketballY, basketballSize * width)
            
            // Draw trajectory curve
            drawTrajectory(p5, basketballX, basketballY, targetNetX, targetNetY, player2Slime.chargeLevel)
            
            // Create or update a temporary basketball for tracking charge parameters
            let chargingBall = basketballShots[1].find(ball => !ball.isActive)
            if (!chargingBall) {
                chargingBall = createBasketballShot()
                basketballShots[1].push(chargingBall)
            }
            
            // Store trajectory parameters for when charging ends
            chargingBall.startX = basketballX
            chargingBall.startY = basketballY
            chargingBall.targetX = targetNetX
            chargingBall.targetY = targetNetY
            chargingBall.chargeLevel = player2Slime.chargeLevel
            
            // Calculate control point for the bezier curve
            const deltaX = targetNetX - basketballX
            const deltaY = targetNetY - basketballY
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
            const midX = (basketballX + targetNetX) / 2
            const controlY = Math.min(basketballY, targetNetY) - (distance * 0.5)
            
            chargingBall.controlX = midX
            chargingBall.controlY = controlY
        } else if (!player2Slime.isCharging && player2Slime.chargeLevel > 0) {
            // Player just released the charge, start a new shot
            console.log(`Player 2 shooting with charge level: ${Math.round(player2Slime.chargeLevel * 100)}%`)
            
            // Find the charging ball (should be the last one that was updated)
            const chargingBall = basketballShots[1].find(ball => !ball.isActive && ball.chargeLevel > 0)
            
            if (chargingBall) {
                // Activate the ball for flight
                chargingBall.isActive = true
                chargingBall.startTime = Date.now()
                
                // Shot duration based on charge level (faster shots with higher charge)
                // Duration between 500ms (full charge) and 1500ms (minimal charge)
                chargingBall.duration = 1500 - (player2Slime.chargeLevel * 1000)
            }
            
            // Reset charge level after shooting
            player2Slime.chargeLevel = 0
        }
        
        // Process all active basketballs for player 2
        for (let i = 0; i < basketballShots[1].length; i++) {
            const ball = basketballShots[1][i]
            
            if (ball.isActive) {
                // Continue animating the shot that's in progress
                const currentTime = Date.now()
                const elapsedTime = currentTime - ball.startTime
                const progress = Math.min(1.0, elapsedTime / ball.duration)
                
                // Calculate current position along the quadratic Bezier curve
                const t = progress
                const startX = ball.startX
                const startY = ball.startY
                const controlX = ball.controlX
                const controlY = ball.controlY
                const targetX = ball.targetX
                const targetY = ball.targetY
                
                // Quadratic Bezier formula: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
                const oneMinusT = 1 - t
                const currentX = oneMinusT * oneMinusT * startX + 2 * oneMinusT * t * controlX + t * t * targetX
                const currentY = oneMinusT * oneMinusT * startY + 2 * oneMinusT * t * controlY + t * t * targetY
                
                // Store current position
                ball.currentX = currentX
                ball.currentY = currentY
                
                // Draw basketball at current position
                drawBasketball(p5, currentX, currentY, basketballSize * width)
                
                // Check if shot is complete
                if (progress >= 1.0) {
                    ball.isActive = false
                    console.log("Player 2 shot complete")
                    // Here you could add scoring logic
                }
            }
        }
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
    
    // Calculate the distance between start and target
    const deltaX = endX - startX
    const deltaY = endY - startY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    
    // Calculate control point for the bezier curve
    const midX = (startX + endX) / 2
    const controlY = Math.min(startY, endY) - (distance * 0.5) // Arc height relative to distance
    
    // Set curve style based on charge level
    const alpha = Math.min(255, chargeLevel * 255)
    p5.stroke(255, 255, 255, alpha)
    p5.strokeWeight(2 * chargeLevel)
    p5.noFill()
    
    // Draw bezier curve
    p5.beginShape()
    p5.vertex(startX, startY)
    p5.quadraticVertex(midX, controlY, endX, endY)
    p5.endShape()
}