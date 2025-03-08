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

/**
 * 绘制纸张纹理效果
 *
 * 使用Perlin噪声创建自然的纸张纹理效果。该函数会缓存生成的纹理，
 * 只有在参数变化时才会重新生成，以提高性能。
 *
 * @param p - p5实例
 * @param width - 纹理宽度
 * @param height - 纹理高度
 */
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

        // 获取基础颜色
        const baseP5Color = p.color(baseColor)

        // 绘制纸张纹理
        drawNoisePattern(p, cachedTexture, width, height, noiseScale, grainDensity, dotGap, dotOffset, baseP5Color)
    }

    // 绘制缓存的纹理
    p.image(cachedTexture!, 0, 0)
}

/**
 * 使用Perlin噪声绘制点阵纹理
 *
 * @param p - p5实例
 * @param g - 绘图缓冲区
 * @param width - 纹理宽度
 * @param height - 纹理高度
 * @param xScale - X轴噪声缩放因子（值越小纹理越平滑）
 * @param yScale - Y轴噪声缩放因子（值越小纹理越平滑）
 * @param gap - 点之间的间距（值越小纹理越精细但性能消耗越大）
 * @param offset - 噪声偏移量（改变此值会生成不同的纹理模式）
 * @param baseColor - 基础颜色
 */
function drawNoisePattern(
    p: p5,
    g: p5.Graphics,
    width: number,
    height: number,
    xScale: number,
    yScale: number,
    gap: number,
    offset: number,
    baseColor: p5.Color
): void {
    // 设置绘图属性
    g.noStroke()
    g.clear()

    // 提取基础颜色的RGB值
    const r = p.red(baseColor)
    const g2 = p.green(baseColor)
    const b = p.blue(baseColor)

    // 绘制深色点阵（主要纹理）
    g.fill(r * 0.8, g2 * 0.8, b * 0.8, 40) // 深色版本的基础颜色，半透明

    // 使用与示例代码相似的方法绘制点阵
    for (let x = gap / 2; x < width; x += gap) {
        for (let y = gap / 2; y < height; y += gap) {
            // 计算噪声值，使用缩放和偏移的坐标
            const noiseValue = p.noise((x + offset) * xScale, (y + offset) * yScale)

            // 根据噪声值确定点的大小
            const diameter = noiseValue * gap * 0.8

            // 只绘制大于某个阈值的点，使纹理更加自然
            if (noiseValue > 0.3) {
                g.circle(x, y, diameter)
            }
        }
    }

    // 绘制浅色点阵（次要纹理，增加层次感）
    g.fill(r * 1.1, g2 * 1.1, b * 1.1, 30) // 浅色版本的基础颜色，半透明

    // 使用不同的缩放和偏移，创建第二层纹理
    const secondaryXScale = xScale * 1.5
    const secondaryYScale = yScale * 1.5
    const secondaryOffset = offset + 500

    for (let x = gap / 2; x < width; x += gap) {
        for (let y = gap / 2; y < height; y += gap) {
            const noiseValue = p.noise(
                (x + secondaryOffset) * secondaryXScale,
                (y + secondaryOffset) * secondaryYScale
            )

            const diameter = noiseValue * gap * 0.6

            if (noiseValue > 0.5) {
                g.circle(x, y, diameter)
            }
        }
    }
}

/**
 * 重置纹理缓存
 * 当窗口大小改变或需要强制重新生成纹理时调用
 */
export function resetTextureCache() {
    if (cachedTexture) {
        cachedTexture.remove()
        cachedTexture = null
    }
}
