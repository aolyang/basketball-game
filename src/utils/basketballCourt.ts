import type P5 from "p5"

import { gameState } from "../config/gameState"

/**
 * Renders a basketball court with proper proportions based on the canvas size
 * @param p5 - The p5 instance
 */
export function renderBasketballCourt(p5: P5) {
    const { width, height } = gameState.canvas
    
    // Basketball court standard proportions (28m x 15m)
    // We'll scale everything based on canvas dimensions
    const courtWidth = width * 0.9 // Use 90% of canvas width
    const courtHeight = courtWidth * (15/28) // Maintain aspect ratio
    
    // Calculate court position to center it
    const courtX = (width - courtWidth) / 2
    const courtY = (height - courtHeight) / 2
    
    // Court dimensions
    const halfCourtWidth = courtWidth / 2
    const threePointRadius = courtWidth * 0.23 // Approximate 3-point arc radius
    const keyWidth = courtWidth * 0.12 // Key/paint width
    const keyHeight = courtHeight * 0.35 // Key/paint height
    const circleRadius = courtWidth * 0.06 // Center circle radius
    const basketRadius = courtWidth * 0.015 // Basket circle radius
    const basketOffset = courtWidth * 0.02 // Distance from baseline to basket
    
    p5.push()
    p5.noFill()
    p5.stroke(0) // Black lines
    p5.strokeWeight(2)
    
    // Draw court outline
    p5.rect(courtX, courtY, courtWidth, courtHeight)
    
    // Draw half-court line
    p5.line(
        courtX + halfCourtWidth,
        courtY,
        courtX + halfCourtWidth,
        courtY + courtHeight
    )
    
    // Draw center circle
    p5.circle(
        courtX + halfCourtWidth,
        courtY + courtHeight / 2,
        circleRadius * 2
    )
    
    // Draw left key (paint)
    p5.rect(
        courtX,
        courtY + (courtHeight - keyHeight) / 2,
        keyWidth,
        keyHeight
    )
    
    // Draw right key (paint)
    p5.rect(
        courtX + courtWidth - keyWidth,
        courtY + (courtHeight - keyHeight) / 2,
        keyWidth,
        keyHeight
    )
    
    // Draw left basket
    p5.circle(
        courtX + basketOffset,
        courtY + courtHeight / 2,
        basketRadius * 2
    )
    
    // Draw right basket
    p5.circle(
        courtX + courtWidth - basketOffset,
        courtY + courtHeight / 2,
        basketRadius * 2
    )
    
    // Draw left three-point arc
    p5.arc(
        courtX + basketOffset,
        courtY + courtHeight / 2,
        threePointRadius * 2,
        threePointRadius * 2,
        -p5.QUARTER_PI,
        p5.QUARTER_PI,
        p5.OPEN
    )
    
    // Draw right three-point arc
    p5.arc(
        courtX + courtWidth - basketOffset,
        courtY + courtHeight / 2,
        threePointRadius * 2,
        threePointRadius * 2,
        p5.PI - p5.QUARTER_PI,
        p5.PI + p5.QUARTER_PI,
        p5.OPEN
    )
    
    p5.pop()
}