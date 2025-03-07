import type P5 from "p5"
import { gameState } from "../config/gameState"

interface PlayerSelectConfig {
    baseYRatio?: number
    spacing?: number
    fontSize?: number
}

export function renderPlayerSelect(p5: P5, config: PlayerSelectConfig = {}) {
    const {
        baseYRatio = 0.7,
        spacing = 50,
        fontSize = 40
    } = config

    const { width, height } = gameState.canvas
    const { selectedPlayer } = gameState.player
    const baseY = height * baseYRatio

    p5.textSize(fontSize)
    p5.fill(0) // Black text color

    // Draw player selection text
    p5.text('select player:', width / 2.3, baseY)
    p5.text(
        `${selectedPlayer === 1 ? '>' : '+'} player 1`,
        width / 2,
        baseY + spacing
    )
    p5.text(
        `${selectedPlayer === 2 ? '>' : '+'} player 2`,
        width / 2,
        baseY + spacing * 2
    )
}