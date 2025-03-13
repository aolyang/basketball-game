import type P5 from "p5"

import { gameState } from "../../config/gameState"
import { handleSlimeControls } from "../../keyboards/slimeControls"
import { getDefaultKeyMap, logKeyboardEvents } from "../../utils/keyboardMap"
import { renderBallNets } from "../../utils/ballNetRenderer"
import { renderFloorTexture } from "../../utils/floorTextureRenderer"
import { renderSlimesInGame } from "../../utils/renderSlimeInGame"
import { Dialog } from "../components/Dialog"
import { KeyboardRenderer } from "../components/KeyboardRenderer"
import { drawPaperTexture } from "../effects/PaperTexture"

const exitDialog = new Dialog({
    title: "Exit Game",
    onConfirm: () => {
        gameState.currentPage = "main"
        gameState.isPaused = false
        exitDialog.hide()
    },
    onCancel: () => {
        exitDialog.hide()
    },
    onShow: () => {
        gameState.isPaused = true
    },
    onHide: () => {
        gameState.isPaused = false
    },
    isVisible: false
})

// 创建键盘渲染器实例
const keyboardRenderer = new KeyboardRenderer()

export function renderGamePage(p5: P5) {
    // 处理史莱姆的键盘控制（只有在游戏未暂停时）
    if (!gameState.isPaused) {
        handleSlimeControls(p5)
    }
    
    drawPaperTexture(p5, gameState.canvas.width, gameState.canvas.height)
    renderFloorTexture(p5)
    renderBallNets(p5)
    renderSlimesInGame(p5)
    
    // 设置键盘映射并渲染控制提示
    const keyMap = getDefaultKeyMap(p5)
    keyboardRenderer.setKeyboardMap(keyMap)
    keyboardRenderer.renderControlsText(p5, gameState.canvas.width / 2, 30)
    
    // Log keyboard events to console
    logKeyboardEvents(p5, keyMap)
    
    exitDialog.render(p5)
}

export function handleGameKeyboard(p5: P5) {
    if (p5.keyCode === p5.ESCAPE) {
        if (exitDialog.isVisible()) exitDialog.hide()
        else exitDialog.show()
    } else if (p5.keyCode === p5.ENTER && exitDialog.isVisible()) {
        gameState.currentPage = "main"
        exitDialog.hide()
    }
}
