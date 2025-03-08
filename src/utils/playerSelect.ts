import type P5 from "p5"

import { gameState } from "../config/gameState"
import { renderSVGPath } from "./svgPath"

const basketballSvgPath = "M1.333 2.89A6.97 6.97 0 0 0 0 7a6.97 6.97 0 0 0 1.333 4.11A4.55 4.55 0 0 0 2.87 9.355A5.2 5.2 0 0 0 3.423 7a5.24 5.24 0 0 0-.553-2.355A4.55 4.55 0 0 0 1.333 2.89m.826-.947a5.8 5.8 0 0 1 1.826 2.138c.453.895.688 1.9.688 2.919a6.5 6.5 0 0 1-.688 2.92a5.8 5.8 0 0 1-1.826 2.137a6.98 6.98 0 0 0 4.216 1.915V.028c-1.63.144-3.1.847-4.216 1.915m5.466 12.03a6.98 6.98 0 0 0 4.216-1.916a5.8 5.8 0 0 1-1.826-2.138A6.5 6.5 0 0 1 9.327 7c0-1.02.235-2.024.688-2.92a5.8 5.8 0 0 1 1.825-2.137A6.98 6.98 0 0 0 7.626.028v13.944ZM14 7a6.97 6.97 0 0 1-1.333 4.11a4.55 4.55 0 0 1-1.537-1.755A5.2 5.2 0 0 1 10.577 7c0-.828.191-1.64.553-2.355a4.55 4.55 0 0 1 1.537-1.755A6.97 6.97 0 0 1 14 7"

export function renderPlayerSelect(p5: P5) {
    const { width, height } = gameState.canvas
    const baseYRatio = 0.73,
        spacing = 0.11 * height,
        fontSize = 0.09 * height,
        iconSize = fontSize * 0.8 // Basketball icon size relative to font size

    const { selectedPlayer } = gameState.player
    const baseY = height * baseYRatio

    p5.textSize(fontSize)
    p5.fill(255, 255, 255) // Black text color

    // Draw player selection text
    p5.text("player select", width / 4, baseY)
    p5.text("1 player", width / 3.1, baseY + spacing)
    p5.text("2 players", width / 3.22, baseY + spacing * 2)

    // Draw basketball icon at selected player position
    p5.push()
    const iconX = width / 3.1 - iconSize * 1.5
    const iconY = baseY + (selectedPlayer === 1 ? spacing * 0.78 : spacing * 1.76) - iconSize / 2

    p5.translate(iconX, iconY)
    p5.scale(iconSize / 14) // Scale SVG path (original SVG viewBox is 14x14)
    renderSVGPath(p5, basketballSvgPath, {
        fill: { r: 255, g: 165, b: 0 } // Orange fill
    })

    p5.pop()
}
