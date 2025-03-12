import type P5 from "p5"

import { gameState } from "../../config/gameState"
import { renderCopyright } from "../../utils/copyright"
import { renderGameTitle } from "../../utils/gameTitle"
import { renderPlayerSelect } from "../../utils/playerSelect"
import { renderSlimeJumpAnimation } from "../../utils/renderSlimeInMainPage"
import { drawPaperTexture } from "../effects/PaperTexture"

export function renderMainPage(p5: P5) {
    drawPaperTexture(p5, gameState.canvas.width, gameState.canvas.height)

    renderGameTitle(p5)
    renderPlayerSelect(p5)

    // Render the slime animation(s)
    renderSlimeJumpAnimation(p5)

    renderCopyright(p5)
}
