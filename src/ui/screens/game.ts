import type P5 from "p5"

import { gameState } from "../../config/gameState"
import { renderBasketballCourt } from "../../utils/basketballCourtWebGL"
import { Dialog } from "../components/dialog"

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

export function renderGamePage(p5: P5) {
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
    }
}
