import type P5 from "p5"

import { gameState } from "../../config/gameState"
import { renderBasketballCourt, forceNextRender } from "../../utils/basketballCourtWebGL"
import { Dialog } from "../components/Dialog"

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
    // 如果是首次加载页面，强制渲染篮球场
    if (!pageLoaded) {
        forceNextRender()
        pageLoaded = true
    }

    // 清除背景
    p5.background(240)

    // 绘制篮球场
    renderBasketballCourt(p5)

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
