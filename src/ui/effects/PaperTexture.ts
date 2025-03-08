import type p5 from "p5"

import { gameState } from "../../config/gameState"

// 缓存纹理图像
let cachedTexture: p5.Graphics | null = null
let lastWidth = 0
let lastHeight = 0
let lastNoiseScale = 0
let lastGrainDensity = 0
let lastBaseColor = ""
let lastDotGap = 0
let lastDotOffset = 0

export function drawPaperTexture(
    p: p5,
    width: number,
    height: number
): void {
    const {
        noiseScale,
        grainDensity,
        baseColor,
        dotGap,
        dotOffset
    } = gameState.paperTexture

    // 检查是否需要重新生成纹理
    const needsUpdate =
        !cachedTexture ||
        lastWidth !== width ||
        lastHeight !== height ||
        lastNoiseScale !== noiseScale ||
        lastGrainDensity !== grainDensity ||
        lastBaseColor !== baseColor ||
        lastDotGap !== dotGap ||
        lastDotOffset !== dotOffset

    if (needsUpdate) {
        // 更新缓存参数
        lastWidth = width
        lastHeight = height
        lastNoiseScale = noiseScale
        lastGrainDensity = grainDensity
        lastBaseColor = baseColor
        lastDotGap = dotGap
        lastDotOffset = dotOffset

        // 创建或重置缓存图像
        if (!cachedTexture) {
            cachedTexture = p.createGraphics(width, height)
        } else if (cachedTexture.width !== width || cachedTexture.height !== height) {
            cachedTexture.remove()
            cachedTexture = p.createGraphics(width, height)
        } else {
            cachedTexture.clear()
        }

        // 在缓存图像上绘制纹理
        cachedTexture.noStroke()

        // 计算点的颜色，使其相对于baseColor略微偏暗
        const baseP5Color = p.color(baseColor)
        const dotColor = p.color(
            p.red(baseP5Color) * 0.92,
            p.green(baseP5Color) * 0.92,
            p.blue(baseP5Color) * 0.92,
            25 // 设置较低的透明度以创建叠加效果
        )
        cachedTexture.fill(dotColor)

        // 使用点阵和噪声创建纸张纹理
        for (let x = dotGap / 2; x < width; x += dotGap) {
            for (let y = dotGap / 2; y < height; y += dotGap) {
                const noiseValue = p.noise(
                    (x + dotOffset) * noiseScale,
                    (y + dotOffset) * grainDensity
                )

                // 根据噪声值确定点的大小，使用较小的系数来创建更细腻的效果
                const diameter = noiseValue * dotGap * 0.6
                cachedTexture.circle(x, y, diameter)
            }
        }
    }

    // 绘制缓存的纹理
    p.image(cachedTexture!, 0, 0)
}

// 当窗口大小改变或需要重置缓存时调用
export function resetTextureCache() {
    if (cachedTexture) {
        cachedTexture.remove()
        cachedTexture = null
    }
}
