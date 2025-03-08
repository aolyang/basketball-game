import type P5 from "p5"

import { gameState } from "../../config/gameState"
import { renderPlayerSelect } from "../../utils/playerSelect"
import { drawPaperTexture } from "../effects/PaperTexture"

export function renderMainPage(p5: P5) {
    drawPaperTexture(p5, gameState.canvas.width, gameState.canvas.height)
    renderPlayerSelect(p5)
}
