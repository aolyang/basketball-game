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
        calculateCanvasSize(p5)
        p5.createCanvas(gameState.canvas.width, gameState.canvas.height)
        setupDPIScaling(p5)
        p5.textFont(font)
        p5.textAlign(p5.CENTER, p5.CENTER)
    }

    p5.draw = () => {
        p5.background(0xdb, 0xd7, 0xd3) // Set background to #dbd7d3
        renderPlayerSelect(p5)
    }

    p5.windowResized = () => {
        calculateCanvasSize(p5)
        p5.resizeCanvas(gameState.canvas.width, gameState.canvas.height)
        p5.redraw()
    }
}
