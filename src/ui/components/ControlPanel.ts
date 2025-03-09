import { GUI } from "lil-gui"

import { gameState } from "../../config/gameState"

export class ControlPanel {
    private gui: GUI
    private isVisible = true
    private rotationFolder: GUI | null = null

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

        court.add(gameState.court, "useWebGL").name("Use WebGL")

        const animationController = court.add(gameState.court, "enableAnimation").name("Enable Animation")

        this.rotationFolder = court.addFolder("Manual Rotation")

        const rotX = this.rotationFolder.add(gameState.court, "rotationX", -1, 1, 0.01).name("X Rotation")
        const rotY = this.rotationFolder.add(gameState.court, "rotationY", -1, 1, 0.01).name("Y Rotation")
        const rotZ = this.rotationFolder.add(gameState.court, "rotationZ", -1, 1, 0.01).name("Z Rotation")

        if (gameState.court.enableAnimation) {
            rotX.disable()
            rotY.disable()
            rotZ.disable()
        }

        this.rotationFolder.add({
            resetRotation: () => {
                gameState.court.rotationX = 0
                gameState.court.rotationY = 0
                gameState.court.rotationZ = 0
            }
        }, "resetRotation").name("Reset Rotation")

        animationController.onChange((value: boolean) => {
            if (this.rotationFolder) {
                this.rotationFolder.controllers.forEach(c => {
                    if (c.property === "rotationX" || c.property === "rotationY" || c.property === "rotationZ") {
                        value ? c.disable() : c.enable()
                    }
                })
            }

            if (!value) {
                gameState.court.rotationX = 0
                gameState.court.rotationY = 0
                gameState.court.rotationZ = 0
            }
        })

        debug.close()
        paperTexture.close()
        court.close()
        this.rotationFolder.close()
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
    }
}
