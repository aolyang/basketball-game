import { GUI } from "lil-gui"

import { gameState } from "../../config/gameState"
import { forceNextRender } from "../../utils/floorTextureRenderer"
import { logCourtState, logGameStateSnapshot, logSceneState, saveGameStateToFile } from "../../utils/gameStateSnapshot"

export class ControlPanel {
    private gui: GUI
    private isVisible = true

    constructor() {
        this.gui = new GUI({ title: "Control Panel" })

        const debug = this.gui.addFolder("Debug")
        debug.add(gameState.debug, "showFPS").name("Show FPS")

        // Add floor controls
        const floor = this.gui.addFolder("Floor")
        floor.add(gameState.scene.floor, "offsetX", 0, 240, 1)
            .name("Horizontal Offset")
            .onChange(() => forceNextRender())
        floor.add(gameState.scene.floor, "offsetY", -100, 100, 1)
            .name("Vertical Position")
            .onChange(() => forceNextRender())
            
        // Add ball nets controls
        const ballNets = this.gui.addFolder("Ball Nets")
        ballNets.add(gameState.scene.ballNets, "leftX", 0, 0.5, 0.01)
            .name("Left X Position")
            .onChange(() => forceNextRender())
        ballNets.add(gameState.scene.ballNets, "leftY", 0, 1, 0.01)
            .name("Left Y Position")
            .onChange(() => forceNextRender())
        ballNets.add(gameState.scene.ballNets, "rightX", 0.5, 1, 0.01)
            .name("Right X Position")
            .onChange(() => forceNextRender())
        ballNets.add(gameState.scene.ballNets, "rightY", 0, 1, 0.01)
            .name("Right Y Position")
            .onChange(() => forceNextRender())
        ballNets.add(gameState.scene.ballNets, "scale", 0.5, 2, 0.1)
            .name("Scale")
            .onChange(() => forceNextRender())

        // 添加快照功能
        const snapshot = this.gui.addFolder("Snapshot")
        snapshot.add({
            logState: () => logGameStateSnapshot()
        }, "logState").name("Log Game State")

        snapshot.add({
            logCourt: () => logCourtState()
        }, "logCourt").name("Log Court State")

        snapshot.add({
            logScene: () => logSceneState()
        }, "logScene").name("Log Scene State")

        snapshot.add({
            saveToFile: () => saveGameStateToFile()
        }, "saveToFile").name("Save State to File")

        const paperTexture = this.gui.addFolder("Paper Texture")
        paperTexture.add(gameState.paperTexture, "noiseScale", 0.001, 0.1)
        paperTexture.add(gameState.paperTexture, "grainDensity", 0.001, 0.1)
        paperTexture.add(gameState.paperTexture, "dotGap", 1, 10, 1)
        paperTexture.addColor(gameState.paperTexture, "baseColor")

        debug.close()
        floor.close()
        ballNets.close()
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
