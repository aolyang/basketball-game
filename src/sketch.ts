import type P5 from "p5"

export default function sketch(p: P5) {
    let aspectRatio = 16 / 9
    let canvasWidth = 0
    let canvasHeight = 0

    const calculateCanvasSize = () => {
        // Get the window dimensions
        const windowWidth = p.windowWidth
        const windowHeight = p.windowHeight

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

    p.setup = () => {
        calculateCanvasSize()
        p.createCanvas(canvasWidth, canvasHeight)
        p.pixelDensity(window.devicePixelRatio) // Handle DPI scaling
    }

    p.draw = () => {
        p.background(0xdb, 0xd7, 0xd3) // Set background to #dbd7d3
        
        // Center the canvas on screen
        const x = (p.windowWidth - canvasWidth) / 2
        const y = (p.windowHeight - canvasHeight) / 2
        
        p.canvas.style.position = 'absolute'
        p.canvas.style.left = `${x}px`
        p.canvas.style.top = `${y}px`
    }

    p.windowResized = () => {
        calculateCanvasSize()
        p.resizeCanvas(canvasWidth, canvasHeight)
        p.redraw()
    }
}
