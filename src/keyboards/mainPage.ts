import type P5 from "p5"

import { gameState } from "../config/gameState"

export function handleMainPageKeyboard(p5: P5) {
    switch (p5.keyCode) {
        case p5.UP_ARROW:
            gameState.player.selectedPlayer = gameState.player.selectedPlayer === 2 ? 1 : 2
            break
        case p5.DOWN_ARROW:
            gameState.player.selectedPlayer = gameState.player.selectedPlayer === 1 ? 2 : 1
            break
        case p5.ENTER:
            gameState.currentPage = "playing"
            break
    }
}
