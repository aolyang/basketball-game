import type P5 from "p5"

import { gameState } from "../../config/gameState"

export class FPSCounter {
    private frameCount = 0
    private lastTime = 0
    private fps = 0
    private updateInterval = 1000 // 每秒更新一次FPS计算
    private displayFPS = 0 // 用于显示的FPS值

    constructor(private p5: P5) {
        this.lastTime = p5.millis()
    }

    public update() {
        this.frameCount++
        const currentTime = this.p5.millis()
        const elapsed = currentTime - this.lastTime

        // 每隔updateInterval毫秒计算一次FPS
        if (elapsed >= this.updateInterval) {
            this.fps = (this.frameCount / elapsed) * 1000
            this.displayFPS = Math.round(this.fps) // 更新显示值
            this.frameCount = 0
            this.lastTime = currentTime
        }
    }

    public draw() {
        if (!gameState.debug.showFPS) return

        // 每帧都渲染FPS显示
        const padding = 10
        this.p5.push()
        this.p5.textSize(56)
        this.p5.textAlign(this.p5.LEFT, this.p5.TOP)

        this.p5.fill(25, 25, 25)
        this.p5.text(`FPS: ${this.displayFPS}`, padding, padding)
        this.p5.pop()
    }
}
