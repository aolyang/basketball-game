import type P5 from "p5"

import { gameState } from "../../config/gameState"

export class ScoreCounter {
    constructor(private p5: P5) {}

    public draw() {
        const { width, height } = gameState.canvas
        const player1Score = gameState.player.slimes[0].score
        const player2Score = gameState.player.slimes[1].score

        // Draw player 1 score (left side)
        this.p5.push()
        this.p5.textSize(72)
        this.p5.textAlign(this.p5.LEFT, this.p5.TOP)
        this.p5.fill(25, 25, 25)
        this.p5.text(`${player1Score}`, width * 0.1, height * 0.1)
        this.p5.pop()

        // Draw player 2 score (right side)
        this.p5.push()
        this.p5.textSize(72)
        this.p5.textAlign(this.p5.RIGHT, this.p5.TOP)
        this.p5.fill(25, 25, 25)
        this.p5.text(`${player2Score}`, width * 0.9, height * 0.1)
        this.p5.pop()
    }
}