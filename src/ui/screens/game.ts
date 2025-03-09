import type P5 from "p5"

import { gameState } from "../../config/gameState"
import { renderFloorTexture } from "../../utils/floorTextureRenderer"
import { Dialog } from "../components/Dialog"
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

// 页面加载标志
let pageLoaded = false

export function renderGamePage(p5: P5) {
    drawPaperTexture(p5, gameState.canvas.width, gameState.canvas.height)
    renderFloorTexture(p5)
    exitDialog.render(p5)
}

export function handleGameKeyboard(p5: P5) {
    if (p5.keyCode === p5.ESCAPE) {
        if (exitDialog.isVisible()) exitDialog.hide()
        else exitDialog.show()
    } else if (p5.keyCode === p5.ENTER && exitDialog.isVisible()) {
        gameState.currentPage = "main"
        exitDialog.hide()
        // 重置页面加载标志，以便下次进入游戏页面时重新渲染
        pageLoaded = false
    }
}
