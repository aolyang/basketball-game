import type P5 from "p5"

import fontUrl from "./assets/font/Virgil.ttf"
import { gameState } from "./config/gameState"
import { handleMainPageKeyboard } from "./keyboards/mainPage"
import { ControlPanel } from "./ui/components/ControlPanel"
import { FPSCounter } from "./ui/components/FPSCounter"
import { resetTextureCache } from "./ui/effects/PaperTexture"
import { handleGameKeyboard, renderGamePage } from "./ui/screens/game"
import { renderMainPage } from "./ui/screens/main"
import { calculateCanvasSize, setupDPIScaling } from "./utils/dpi"

export default function sketch(p5: P5) {
    let font: P5.Font
    const controlPanel = new ControlPanel()
    const fpsCounter = new FPSCounter(p5)

    p5.preload = () => {
        font = p5.loadFont(fontUrl)
    }

    p5.setup = () => {
        p5.createCanvas(gameState.canvas.width, gameState.canvas.height)
        setupDPIScaling(p5)
        p5.textFont(font)
        p5.frameRate(gameState.fps)
    }

    p5.draw = () => {
        p5.background(0xdb, 0xd7, 0xd3) // Set background to #dbd7d3
        
        if (gameState.currentPage === "main") {
            renderMainPage(p5)
        } else {
            renderGamePage(p5)
        }
        
        fpsCounter.update()
        fpsCounter.draw()
    }

    p5.keyPressed = () => {
        if (p5.keyIsDown(p5.CONTROL) && p5.key.toLowerCase() === "p") {
            controlPanel.toggle()
            return
        }

        if (gameState.currentPage === "main") {
            handleMainPageKeyboard(p5)
        } else if (gameState.currentPage === "playing") {
            handleGameKeyboard(p5)
        }
    }

    p5.windowResized = () => {
        calculateCanvasSize(p5)
        p5.resizeCanvas(gameState.canvas.width, gameState.canvas.height)
        // 重置纹理缓存，以便在窗口大小改变时重新生成
        resetTextureCache()
        p5.redraw()
    }
}
