import type P5 from "p5"
import fontUrl from "./assets/font/Virgil.ttf"
import { renderPlayerSelect } from "./utils/playerSelect"
import { calculateCanvasSize, setupDPIScaling } from "./utils/dpi"
import { gameState } from "./config/gameState"

export default function sketch(p5: P5) {
    let font: P5.Font

    p5.preload = () => {
        font = p5.loadFont(fontUrl)
    }

    p5.setup = () => {
        p5.createCanvas(gameState.canvas.width, gameState.canvas.height)
        setupDPIScaling(p5)
        p5.textFont(font)
    }

    p5.draw = () => {
        p5.background(0xdb, 0xd7, 0xd3) // Set background to #dbd7d3
        if (gameState.currentPage === "main") {
            renderPlayerSelect(p5)
        } else {
            // TODO: Render game scene
        }
    }

    p5.keyPressed = () => {
        if (gameState.currentPage === "main") {
            switch (p5.keyCode) {
                case p5.UP_ARROW:
                    gameState.player.selectedPlayer = 1
                    break
                case p5.DOWN_ARROW:
                    gameState.player.selectedPlayer = 2
                    break
                case p5.ENTER:
                    gameState.currentPage = "playing"
                    break
            }
        }
    }

    p5.windowResized = () => {
        calculateCanvasSize(p5)
        p5.resizeCanvas(gameState.canvas.width, gameState.canvas.height)
        p5.redraw()
    }
}
