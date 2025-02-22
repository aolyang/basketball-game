import type P5 from "p5"

import { BASE_HEIGHT, BASE_WIDTH } from "./config/constants.ts"
import { getScaleFactors } from "./utils/screenAdapter.ts"

export default function sketch(p: P5) {
    let graphicsBuffer: P5.Graphics

    p.setup = () => {
        // 创建主画布（实际显示尺寸）
        p.createCanvas(p.windowWidth, p.windowHeight)

        // 创建离屏缓冲区（逻辑分辨率）
        graphicsBuffer = p.createGraphics(BASE_WIDTH, BASE_HEIGHT)
        graphicsBuffer.pixelDensity(1) // 关闭高DPI缩放
    }

    p.draw = () => {
        // 1. 清空主画布
        p.clear()

        // 2. 更新离屏缓冲区
        graphicsBuffer.background(51)

        // 3. 计算缩放参数
        const { scale, offsetX, offsetY } = getScaleFactors(p)

        // 4. 绘制到主画布（保持像素对齐）
        p.imageMode(p.CORNER)
        p.image(graphicsBuffer, offsetX, offsetY, BASE_WIDTH * scale, BASE_HEIGHT * scale)
    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
        p.redraw()
    }
}
