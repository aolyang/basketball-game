import { GUI } from "lil-gui"

import { gameState } from "../../config/gameState"

export class ControlPanel {
    private gui: GUI
    private isVisible = true
    private rotationFolder: GUI | null = null
    private originFolder: GUI | null = null

    constructor() {
        this.gui = new GUI({ title: "Control Panel" })

        const debug = this.gui.addFolder("Debug")
        debug.add(gameState.debug, "showFPS").name("Show FPS")

        const paperTexture = this.gui.addFolder("Paper Texture")
        paperTexture.add(gameState.paperTexture, "noiseScale", 0.001, 0.1)
        paperTexture.add(gameState.paperTexture, "grainDensity", 0.001, 0.1)
        paperTexture.add(gameState.paperTexture, "dotGap", 1, 10, 1)
        paperTexture.addColor(gameState.paperTexture, "baseColor")

        const court = this.gui.addFolder("Basketball Court")

        this.rotationFolder = court.addFolder("Manual Rotation")

        const rotX = this.rotationFolder.add(gameState.court, "rotationX", -1, 1, 0.01).name("X Rotation (Pitch)")
        const rotY = this.rotationFolder.add(gameState.court, "rotationY", -1, 1, 0.01).name("Y Rotation (Yaw)")
        const rotZ = this.rotationFolder.add(gameState.court, "rotationZ", -1, 1, 0.01).name("Z Rotation (Roll)")

        this.originFolder = court.addFolder("Rotation Origin")
        const originX = this.originFolder.add(gameState.court, "originX", 0, 1, 0.01).name("X Origin (0=Left, 1=Right)")
        const originY = this.originFolder.add(gameState.court, "originY", 0, 1, 0.01).name("Y Origin (0=Top, 1=Bottom)")
        const originZ = this.originFolder.add(gameState.court, "originZ", -1, 1, 0.05).name("Z Origin (Height)")

        this.originFolder.add({
            resetOrigin: () => {
                gameState.court.originX = 0
                gameState.court.originY = 0.87
                gameState.court.originZ = 0.5
            }
        }, "resetOrigin").name("Reset to Default")

        this.rotationFolder.add({
            resetRotation: () => {
                gameState.court.rotationX = 0.42
                gameState.court.rotationY = 0
                gameState.court.rotationZ = 0
            }
        }, "resetRotation").name("Reset to Default")

        debug.close()
        paperTexture.close()
        court.close()
        this.rotationFolder.close()
        this.originFolder.close()
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

        if (this.rotationFolder) {
            this.rotationFolder.controllers.forEach(controller => {
                controller.updateDisplay()
            })
        }

        if (this.originFolder) {
            this.originFolder.controllers.forEach(controller => {
                controller.updateDisplay()
            })
        }
    }
}
