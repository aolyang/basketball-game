import type P5 from "p5"

import { gameState } from "../config/gameState"
import { Dialog } from "../ui/screens/dialog"

const exitDialog = new Dialog({
    title: "Exit Game",
    onConfirm: () => {
        gameState.currentPage = "main"
        exitDialog.hide()
    },
    onCancel: () => exitDialog.hide(),
    isVisible: false
})

export function handlePlayPageKeyboard(p5: P5) {
    if (p5.keyCode === p5.ESCAPE) {
        exitDialog.show()
    } else if (p5.keyCode === p5.ENTER && exitDialog.isVisible()) {
        gameState.currentPage = "main"
        exitDialog.hide()
    }
}

export function renderPlayPage(p5: P5) {
    // TODO: Implement play page rendering
    exitDialog.render(p5)
}
