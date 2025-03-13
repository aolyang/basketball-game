import type P5 from "p5"

import fontUrl from "./assets/font/Virgil.ttf"
import { gameState } from "./config/gameState"
import { handleMainPageKeyboard } from "./keyboards/mainPage"
import { ControlPanel } from "./ui/components/ControlPanel"
import { FPSCounter } from "./ui/components/FPSCounter"
import { resetTextureCache } from "./ui/effects/PaperTexture"
import { handleGameKeyboard, renderGamePage } from "./ui/screens/game"
import { renderMainPage } from "./ui/screens/main"
import { preloadNetTexture } from "./utils/ballNetRenderer"
import { calculateCanvasSize, setupDPIScaling } from "./utils/dpi"
import { preloadFloorTexture } from "./utils/floorTextureRenderer"
import { saveGameStateToFile } from "./utils/gameStateSnapshot"
import { initSlimeAnimations, preloadSlimeAnimations } from "./utils/slimeAnimation"

// 全局控制面板实例，使其可以在其他地方访问
export let controlPanel: ControlPanel

// 帧率配置
const HIGH_FRAME_RATE = 60
const LOW_FRAME_RATE = 24

export default function sketch(p5: P5) {
    let font: P5.Font
    controlPanel = new ControlPanel()
    const fpsCounter = new FPSCounter(p5)

    p5.preload = () => {
        font = p5.loadFont(fontUrl)
        preloadSlimeAnimations(p5)
        preloadFloorTexture(p5)
        preloadNetTexture(p5)
    }

    p5.setup = () => {
        p5.createCanvas(gameState.canvas.width, gameState.canvas.height)
        setupDPIScaling(p5)
        p5.textFont(font)
        // 初始化时根据低帧率设置选择帧率
        const initialFrameRate = gameState.debug.lowFrameRate ? LOW_FRAME_RATE : HIGH_FRAME_RATE
        p5.frameRate(initialFrameRate)
        initSlimeAnimations()
    }

    p5.draw = () => {
        p5.background(186, 180, 174) // Set background to rgb(186, 180, 174)

        if (gameState.currentPage === "main") {
            renderMainPage(p5)
        } else {
            renderGamePage(p5)
        }
        
        // 根据低帧率设置动态调整帧率
        const targetFrameRate = gameState.debug.lowFrameRate ? LOW_FRAME_RATE : HIGH_FRAME_RATE
        p5.frameRate(targetFrameRate)
        
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
            // 更新控制面板显示
            controlPanel.updateDisplay()
        }

        // 快照功能快捷键
        if (p5.key === "s" && p5.keyIsDown(p5.CONTROL)) {
            // Ctrl+S: 保存游戏状态到文件
            saveGameStateToFile()
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
