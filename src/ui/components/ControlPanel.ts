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
        debug.add(gameState.debug, "showFrameBorders").name("Show Frame Borders")
            .onChange(() => forceNextRender())
        debug.add(gameState.debug, "lowFrameRate").name("Low Frame Rate")
            .onChange(() => {
                // 当切换帧率模式时，强制重新渲染
                forceNextRender()
                // 可以在这里添加其他需要在帧率切换时执行的逻辑
            })

        // Add floor controls
        const floor = this.gui.addFolder("Floor")
        floor.add(gameState.scene.floor, "offsetX", 0, 240, 1)
            .name("Horizontal Offset")
            .onChange(() => forceNextRender())
        floor.add(gameState.scene.floor, "offsetY", 0, 1, 0.01)
            .name("Vertical Position (0-1)")
            .onChange(() => forceNextRender())
        floor.add(gameState.scene.floor, "contentRatio", 0, 1, 0.01)
            .name("Floor Real Position (0-1)")
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

        // Add physics controls
        const physics = this.gui.addFolder("Physics")
        physics.add(gameState.player.physics, "gravity", 0, 1, 0.01)
            .name("Gravity")
            .onChange(() => forceNextRender())
        physics.add(gameState.player.physics, "initialJumpVelocity", 0, 1, 0.01)
            .name("Jump Velocity")
            .onChange(() => forceNextRender())
        physics.add(gameState.player.physics, "moveSpeed", 0, 1, 0.01)
            .name("Move Speed")
            .onChange(() => forceNextRender())

        // Add slime charge controls
        const slimeCharge = this.gui.addFolder("Slime Charge")

        // Shared charge triangle controls
        slimeCharge.add(gameState.player, "chargeTriangleOffsetX", -2, 2, 0.1)
            .name("Triangle X Offset")
            .onChange(() => forceNextRender())
        slimeCharge.add(gameState.player, "chargeTriangleOffsetY", -0.5, 0.5, 0.01)
            .name("Triangle Y Offset")
            .onChange(() => forceNextRender())

        // Shared charge speed control for both players
        slimeCharge.add(gameState.player, "chargeSpeed", 0.1, 2, 0.1)
            .name("Charge Speed")
            .onChange(() => forceNextRender())
            
        // Basketball controls
        const basketball = this.gui.addFolder("Basketball")
        basketball.add(gameState.player, "basketballOffsetX", -0.2, 0.2, 0.01)
            .name("X Offset")
            .onChange(() => forceNextRender())
        basketball.add(gameState.player, "basketballOffsetY", -0.3, 0, 0.01)
            .name("Y Offset")
            .onChange(() => forceNextRender())
        basketball.add(gameState.player, "basketballSize", 0.01, 0.1, 0.005)
            .name("Size")
            .onChange(() => forceNextRender())
        basketball.close()

        debug.close()
        floor.close()
        ballNets.close()
        snapshot.close()
        paperTexture.close()
        physics.close()
        slimeCharge.close()
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
