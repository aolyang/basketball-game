import type p5 from "p5"

import { BASE_HEIGHT, BASE_WIDTH } from "../config/constants.ts"

export function getScaleFactors(p: p5) {
    const targetRatio = BASE_WIDTH / BASE_HEIGHT
    const screenRatio = p.windowWidth / p.windowHeight

    // 计算缩放比例
    let scale = screenRatio > targetRatio ?
        p.windowHeight / BASE_HEIGHT :
        p.windowWidth / BASE_WIDTH

    // 对齐物理像素（避免小数缩放）
    scale = Math.floor(scale * devicePixelRatio) / devicePixelRatio

    return {
        scale,
        offsetX: (p.width - BASE_WIDTH * scale) / 2,
        offsetY: (p.height - BASE_HEIGHT * scale) / 2
    }
}
