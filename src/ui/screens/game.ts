import type P5 from "p5"

import { gameState } from "../../config/gameState"
import { renderBallNets } from "../../utils/ballNetRenderer"
import { renderFloorTexture } from "../../utils/floorTextureRenderer"
import { renderSlimesInGame } from "../../utils/renderSlimeInGame"
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

export function renderGamePage(p5: P5) {
    drawPaperTexture(p5, gameState.canvas.width, gameState.canvas.height)
    renderFloorTexture(p5)
    renderBallNets(p5)
    renderSlimesInGame(p5)
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
