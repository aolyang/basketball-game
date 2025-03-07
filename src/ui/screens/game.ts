import type P5 from "p5"
import { Dialog } from "../components/dialog"
import { gameState } from "../../config/gameState"

const exitDialog = new Dialog({
    title: "Exit Game",
    onConfirm: () => {
        gameState.currentPage = "main"
        exitDialog.hide()
    },
    onCancel: () => exitDialog.hide(),
    isVisible: false
})

export function renderGamePage(p5: P5) {
    // TODO: Implement game page rendering
    exitDialog.render(p5)
}

export function handleGameKeyboard(p5: P5) {
    if (p5.keyCode === p5.ESCAPE) {
        exitDialog.show()
    } else if (p5.keyCode === p5.ENTER && exitDialog.isVisible()) {
        gameState.currentPage = "main"
        exitDialog.hide()
    }
}