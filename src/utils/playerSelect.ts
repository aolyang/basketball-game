import type P5 from "p5"

interface PlayerSelectConfig {
    canvasWidth: number
    canvasHeight: number
    selectedPlayer?: number
    baseYRatio?: number
    spacing?: number
    fontSize?: number
}

export function renderPlayerSelect(p5: P5, config: PlayerSelectConfig) {
    const {
        canvasWidth,
        canvasHeight,
        selectedPlayer = 0,
        baseYRatio = 0.7,
        spacing = 50,
        fontSize = 48
    } = config

    const baseY = canvasHeight * baseYRatio

    p5.textSize(fontSize)
    p5.fill(0) // Black text color

    // Draw player selection text
    p5.text('select player:', canvasWidth / 2.3, baseY)
    p5.text(
        `${selectedPlayer === 1 ? '>' : '+'} player 1`,
        canvasWidth / 2,
        baseY + spacing
    )
    p5.text(
        `${selectedPlayer === 2 ? '>' : '+'} player 2`,
        canvasWidth / 2,
        baseY + spacing * 2
    )
}