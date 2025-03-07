import type P5 from "p5"
import fontUrl from "./assets/font/Virgil.ttf"

export default function sketch(p5: P5) {
    let aspectRatio = 16 / 9
    let canvasWidth = 0
    let canvasHeight = 0
    let font: P5.Font

    p5.preload = () => {
        font = p5.loadFont(fontUrl)
    }

    const calculateCanvasSize = () => {
        // Get the window dimensions
        const windowWidth = p5.windowWidth
        const windowHeight = p5.windowHeight

        // Calculate canvas size maintaining 16:9 aspect ratio
        if (windowWidth / windowHeight > aspectRatio) {
            // Window is wider than needed
            canvasHeight = windowHeight
            canvasWidth = windowHeight * aspectRatio
        } else {
            // Window is taller than needed
            canvasWidth = windowWidth
            canvasHeight = windowWidth / aspectRatio
        }
    }

    p5.setup = () => {
        calculateCanvasSize()
        p5.createCanvas(canvasWidth, canvasHeight)
        p5.pixelDensity(window.devicePixelRatio) // Handle DPI scaling
        p5.textFont(font)
        p5.textAlign(p5.CENTER, p5.CENTER)
    }

    p5.draw = () => {
        p5.background(0xdb, 0xd7, 0xd3) // Set background to #dbd7d3

        // Draw player selection text
        const baseY = canvasHeight * 0.7 // 30% from bottom
        const spacing = 50 // Spacing between text items
        
        p5.textSize(48)
        p5.fill(0) // Black text color
        p5.text('select player:', canvasWidth / 2.3, baseY)
        p5.text('+ player 1', canvasWidth / 2, baseY + spacing)
        p5.text('+ player 2', canvasWidth / 2, baseY + spacing * 2)
    }

    p5.windowResized = () => {
        calculateCanvasSize()
        p5.resizeCanvas(canvasWidth, canvasHeight)
        p5.redraw()
    }
}
