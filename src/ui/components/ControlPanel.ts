import { GUI } from "lil-gui"

import { gameState } from "../../config/gameState"
import {
    firstBackboardConfig,
    resetFirstBackboardConfig,
    resetSecondBackboardConfig,
    secondBackboardConfig} from "../../utils/basketballBackboards"
import { logBackboardState, logCourtState,logGameStateSnapshot, saveGameStateToFile } from "../../utils/gameStateSnapshot"

export class ControlPanel {
    private gui: GUI
    private isVisible = true
    private rotationFolder: GUI | null = null
    private originFolder: GUI | null = null
    private backboardFolder: GUI | null = null
    private backboardPositionFolder: GUI | null = null
    private backboardRotationFolder: GUI | null = null
    private backboardOriginFolder: GUI | null = null
    private secondBackboardFolder: GUI | null = null
    private secondBackboardPositionFolder: GUI | null = null
    private secondBackboardRotationFolder: GUI | null = null
    private secondBackboardOriginFolder: GUI | null = null

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
            logBackboard: () => logBackboardState()
        }, "logBackboard").name("Log Backboard State")

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

        // 添加第一个篮板控制
        this.backboardFolder = this.gui.addFolder("First Backboard")
        this.backboardFolder.add(firstBackboardConfig, "visible").name("Show First Backboard")
        this.backboardFolder.add(firstBackboardConfig, "scale", 0.5, 2, 0.05).name("Size Scale")

        // 第一个篮板位置控制
        this.backboardPositionFolder = this.backboardFolder.addFolder("Position")
        this.backboardPositionFolder.add(firstBackboardConfig, "positionX", 0, 1, 0.01).name("X Position (0=Left, 1=Right)")
        this.backboardPositionFolder.add(firstBackboardConfig, "positionY", 0, 1, 0.01).name("Y Position (0=Top, 1=Bottom)")
        this.backboardPositionFolder.add(firstBackboardConfig, "positionZ", -1, 1, 0.05).name("Z Position (Depth)")

        // 第一个篮板旋转控制
        this.backboardRotationFolder = this.backboardFolder.addFolder("Rotation")
        this.backboardRotationFolder.add(firstBackboardConfig, "rotationX", -1, 1, 0.01).name("X Rotation (Pitch)")
        this.backboardRotationFolder.add(firstBackboardConfig, "rotationY", -1, 1, 0.01).name("Y Rotation (Yaw)")
        this.backboardRotationFolder.add(firstBackboardConfig, "rotationZ", -1, 1, 0.01).name("Z Rotation (Roll)")

        // 第一个篮板旋转原点控制
        this.backboardOriginFolder = this.backboardFolder.addFolder("Rotation Origin")
        this.backboardOriginFolder.add(firstBackboardConfig, "originX", 0, 1, 0.01).name("X Origin (0=Left, 1=Right)")
        this.backboardOriginFolder.add(firstBackboardConfig, "originY", 0, 1, 0.01).name("Y Origin (0=Top, 1=Bottom)")
        this.backboardOriginFolder.add(firstBackboardConfig, "originZ", -1, 1, 0.05).name("Z Origin (Depth)")

        // 添加重置按钮
        this.backboardFolder.add({
            resetBackboard: () => resetFirstBackboardConfig()
        }, "resetBackboard").name("Reset to Default")

        // 添加第二个篮板控制
        this.secondBackboardFolder = this.gui.addFolder("Second Backboard")
        this.secondBackboardFolder.add(secondBackboardConfig, "visible").name("Show Second Backboard")
        this.secondBackboardFolder.add(secondBackboardConfig, "scale", 0.5, 2, 0.05).name("Size Scale")

        // 第二个篮板位置控制
        this.secondBackboardPositionFolder = this.secondBackboardFolder.addFolder("Position")
        this.secondBackboardPositionFolder.add(secondBackboardConfig, "positionX", 0, 1, 0.01).name("X Position (0=Left, 1=Right)")
        this.secondBackboardPositionFolder.add(secondBackboardConfig, "positionY", 0, 1, 0.01).name("Y Position (0=Top, 1=Bottom)")
        this.secondBackboardPositionFolder.add(secondBackboardConfig, "positionZ", -1, 1, 0.05).name("Z Position (Depth)")

        // 第二个篮板旋转控制
        this.secondBackboardRotationFolder = this.secondBackboardFolder.addFolder("Rotation")
        this.secondBackboardRotationFolder.add(secondBackboardConfig, "rotationX", -1, 1, 0.01).name("X Rotation (Pitch)")
        this.secondBackboardRotationFolder.add(secondBackboardConfig, "rotationY", -1, 1, 0.01).name("Y Rotation (Yaw)")
        this.secondBackboardRotationFolder.add(secondBackboardConfig, "rotationZ", -1, 1, 0.01).name("Z Rotation (Roll)")

        // 第二个篮板旋转原点控制
        this.secondBackboardOriginFolder = this.secondBackboardFolder.addFolder("Rotation Origin")
        this.secondBackboardOriginFolder.add(secondBackboardConfig, "originX", 0, 1, 0.01).name("X Origin (0=Left, 1=Right)")
        this.secondBackboardOriginFolder.add(secondBackboardConfig, "originY", 0, 1, 0.01).name("Y Origin (0=Top, 1=Bottom)")
        this.secondBackboardOriginFolder.add(secondBackboardConfig, "originZ", -1, 1, 0.05).name("Z Origin (Depth)")

        // 添加重置按钮
        this.secondBackboardFolder.add({
            resetBackboard: () => resetSecondBackboardConfig()
        }, "resetBackboard").name("Reset to Default")

        debug.close()
        snapshot.close()
        paperTexture.close()
        court.close()
        this.rotationFolder.close()
        this.originFolder.close()
        this.backboardFolder.close()
        this.backboardPositionFolder.close()
        this.backboardRotationFolder.close()
        this.backboardOriginFolder.close()
        this.secondBackboardFolder.close()
        this.secondBackboardPositionFolder.close()
        this.secondBackboardRotationFolder.close()
        this.secondBackboardOriginFolder.close()
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

        if (this.backboardFolder) {
            this.backboardFolder.controllers.forEach(controller => {
                controller.updateDisplay()
            })
        }

        if (this.backboardPositionFolder) {
            this.backboardPositionFolder.controllers.forEach(controller => {
                controller.updateDisplay()
            })
        }

        if (this.backboardRotationFolder) {
            this.backboardRotationFolder.controllers.forEach(controller => {
                controller.updateDisplay()
            })
        }

        if (this.backboardOriginFolder) {
            this.backboardOriginFolder.controllers.forEach(controller => {
                controller.updateDisplay()
            })
        }

        if (this.secondBackboardFolder) {
            this.secondBackboardFolder.controllers.forEach(controller => {
                controller.updateDisplay()
            })
        }

        if (this.secondBackboardPositionFolder) {
            this.secondBackboardPositionFolder.controllers.forEach(controller => {
                controller.updateDisplay()
            })
        }

        if (this.secondBackboardRotationFolder) {
            this.secondBackboardRotationFolder.controllers.forEach(controller => {
                controller.updateDisplay()
            })
        }

        if (this.secondBackboardOriginFolder) {
            this.secondBackboardOriginFolder.controllers.forEach(controller => {
                controller.updateDisplay()
            })
        }
    }
}
