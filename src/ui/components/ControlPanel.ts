import { GUI } from "lil-gui"

import { gameState } from "../../config/gameState"
import { logCourtState,logGameStateSnapshot, saveGameStateToFile } from "../../utils/gameStateSnapshot"

export class ControlPanel {
    private gui: GUI
    private isVisible = true

    constructor() {
        this.gui = new GUI({ title: "Control Panel" })

        const debug = this.gui.addFolder("Debug")
        debug.add(gameState.debug, "showFPS").name("Show FPS")

        // 添加快照功能
        const snapshot = this.gui.addFolder("Snapshot")
        snapshot.add({
            logState: () => logGameStateSnapshot()
        }, "logState").name("Log Game State")

        snapshot.add({
            logCourt: () => logCourtState()
        }, "logCourt").name("Log Court State")

        snapshot.add({
            saveToFile: () => saveGameStateToFile()
        }, "saveToFile").name("Save State to File")

        const paperTexture = this.gui.addFolder("Paper Texture")
        paperTexture.add(gameState.paperTexture, "noiseScale", 0.001, 0.1)
        paperTexture.add(gameState.paperTexture, "grainDensity", 0.001, 0.1)
        paperTexture.add(gameState.paperTexture, "dotGap", 1, 10, 1)
        paperTexture.addColor(gameState.paperTexture, "baseColor")

        debug.close()
        snapshot.close()
        paperTexture.close()
    }

    public toggle() {
        this.isVisible = !this.isVisible
        if (this.isVisible) {
            this.gui.show()
        } else {
            this.gui.hide()
        }
    }

    public show() {
        this.isVisible = true
        this.gui.show()
    }

    public hide() {
        this.isVisible = false
        this.gui.hide()
    }

    public updateDisplay() {
        this.gui.controllers.forEach(controller => {
            controller.updateDisplay()
        })
    }
}
