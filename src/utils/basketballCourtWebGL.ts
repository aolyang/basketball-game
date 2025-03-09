import type P5 from "p5"

import { gameState } from "../config/gameState"

// 缓存WEBGL画布
let courtCanvas: P5.Graphics | null = null

// 缓存上一次渲染的参数
let lastRotationX = 0
let lastRotationY = 0
let lastRotationZ = 0
let lastOriginX = 0.5
let lastOriginY = 0.5
let lastOriginZ = 0
let lastCanvasWidth = 0
let lastCanvasHeight = 0
let lastRenderTime = 0

/**
 * 初始化WEBGL画布
 * @param p5 - p5实例
 */
function initCourtCanvas(p5: P5): void {
    const { width, height } = gameState.canvas
    courtCanvas = p5.createGraphics(width, height, p5.WEBGL)
}

/**
 * 在WEBGL模式下渲染3D篮球场
 * @param graphics - WEBGL图形对象
 */
function render3DBasketballCourt(graphics: P5.Graphics): void {
    console.log("Rendering basketball court in 3D mode", new Date().toISOString())

    const g = graphics
    const { width, height } = gameState.canvas
    const { rotationX, rotationY, rotationZ, originX, originY, originZ } = gameState.court

    // 清除背景
    g.clear()

    // 计算球场尺寸
    const courtWidth = width * 1 // 使用画布宽度的100%
    const courtHeight = courtWidth * (15/28) // 保持篮球场比例

    // 设置3D变换
    g.push()

    // 计算旋转原点的实际坐标（相对于画布中心）
    const originXOffset = (originX - 0.5) * courtWidth
    const originYOffset = (originY - 0.5) * courtHeight
    const originZOffset = originZ * Math.min(courtWidth, courtHeight) * 0.1 // Z轴缩放因子

    // 先移动到旋转原点
    g.translate(originXOffset, originYOffset, originZOffset)

    // 应用旋转（增大旋转角度范围）
    g.rotateX(rotationX * Math.PI) // 允许完整的360度旋转
    g.rotateY(rotationY * Math.PI)
    g.rotateZ(rotationZ * Math.PI)

    // 移回原位置
    g.translate(-originXOffset, -originYOffset, -originZOffset)

    // 绘制球场地板
    g.push()
    g.fill(245, 222, 179, 240) // 浅木色，略微透明
    g.stroke(0)
    g.strokeWeight(2)
    g.plane(courtWidth, courtHeight)
    g.pop()

    // 绘制中线
    g.push()
    g.translate(0, 0, 1) // 略微抬高线条，避免z-fighting
    g.stroke(0)
    g.strokeWeight(2)
    g.line(0, -courtHeight/2, 0, courtHeight/2)
    g.pop()

    // 绘制中心圆
    g.push()
    g.translate(0, 0, 1)
    g.stroke(0)
    g.strokeWeight(2)
    g.noFill()
    g.circle(0, 0, courtWidth * 0.12) // 中心圆直径为球场宽度的12%
    g.pop()

    // 绘制左右禁区
    const keyWidth = courtWidth * 0.12
    const keyHeight = courtHeight * 0.35

    // 左禁区
    g.push()
    g.translate(-courtWidth/2 + keyWidth/2, 0, 1)
    g.fill(220, 220, 250, 100) // 浅蓝色，半透明
    g.stroke(0)
    g.strokeWeight(2)
    g.plane(keyWidth, keyHeight)
    g.pop()

    // 右禁区
    g.push()
    g.translate(courtWidth/2 - keyWidth/2, 0, 1)
    g.fill(220, 220, 250, 100)
    g.stroke(0)
    g.strokeWeight(2)
    g.plane(keyWidth, keyHeight)
    g.pop()

    // 绘制篮筐（简化为圆形）
    const basketRadius = courtWidth * 0.015
    const basketOffset = courtWidth * 0.02

    // 左篮筐
    g.push()
    g.translate(-courtWidth/2 + basketOffset, 0, 2)
    g.fill(255, 0, 0, 200) // 红色，半透明
    g.noStroke()
    g.circle(0, 0, basketRadius * 2)
    g.pop()

    // 右篮筐
    g.push()
    g.translate(courtWidth/2 - basketOffset, 0, 2)
    g.fill(255, 0, 0, 200)
    g.noStroke()
    g.circle(0, 0, basketRadius * 2)
    g.pop()

    // 绘制三分线（使用多个线段近似弧线）
    const threePointRadius = courtWidth * 0.23

    // 左侧三分线
    g.push()
    g.translate(-courtWidth/2 + basketOffset, 0, 1)
    g.stroke(0)
    g.strokeWeight(2)
    g.noFill()
    drawArc(g, 0, 0, threePointRadius, -Math.PI/4, Math.PI/4, 20)
    g.pop()

    // 右侧三分线
    g.push()
    g.translate(courtWidth/2 - basketOffset, 0, 1)
    g.stroke(0)
    g.strokeWeight(2)
    g.noFill()
    drawArc(g, 0, 0, threePointRadius, Math.PI - Math.PI/4, Math.PI + Math.PI/4, 20)
    g.pop()

    g.pop()
}

/**
 * 使用线段绘制弧线（WEBGL中没有直接的arc函数）
 */
function drawArc(g: P5.Graphics, x: number, y: number, radius: number, startAngle: number, endAngle: number, segments: number): void {
    const angleStep = (endAngle - startAngle) / segments

    g.beginShape()
    for (let i = 0; i <= segments; i++) {
        const angle = startAngle + i * angleStep
        const px = x + Math.cos(angle) * radius
        const py = y + Math.sin(angle) * radius
        g.vertex(px, py, 0)
    }
    g.endShape()
}

/**
 * 检查参数是否发生变化
 * @returns 如果参数发生变化，返回true
 */
function hasParamsChanged(): boolean {
    const { width, height } = gameState.canvas
    const { rotationX, rotationY, rotationZ, originX, originY, originZ } = gameState.court

    // 检查参数是否发生变化
    const paramsChanged =
        lastRotationX !== rotationX ||
        lastRotationY !== rotationY ||
        lastRotationZ !== rotationZ ||
        lastOriginX !== originX ||
        lastOriginY !== originY ||
        lastOriginZ !== originZ ||
        lastCanvasWidth !== width ||
        lastCanvasHeight !== height

    // 每500毫秒强制更新一次
    const currentTime = Date.now()
    const timeChanged = (currentTime - lastRenderTime > 500)

    return paramsChanged || timeChanged
}

/**
 * 更新缓存的参数
 */
function updateCachedParams(): void {
    const { width, height } = gameState.canvas
    const { rotationX, rotationY, rotationZ, originX, originY, originZ } = gameState.court

    lastRotationX = rotationX
    lastRotationY = rotationY
    lastRotationZ = rotationZ
    lastOriginX = originX
    lastOriginY = originY
    lastOriginZ = originZ
    lastCanvasWidth = width
    lastCanvasHeight = height
    lastRenderTime = Date.now()
}

/**
 * 渲染篮球场（始终使用WEBGL）
 * @param p5 - p5实例
 */
export function renderBasketballCourt(p5: P5): void {
    // 检查参数是否发生变化，如果没有变化则跳过渲染
    if (!hasParamsChanged() && courtCanvas) {
        // 直接使用缓存的画布
        const x = (p5.width - courtCanvas.width) / 2
        const y = (p5.height - courtCanvas.height) / 2
        p5.image(courtCanvas, x, y)
        return
    }

    // 更新缓存的参数
    updateCachedParams()

    // 懒初始化WEBGL画布
    if (!courtCanvas) {
        initCourtCanvas(p5)
    }

    // 更新球场尺寸（如果画布大小改变）
    if (courtCanvas && (courtCanvas.width !== gameState.canvas.width ||
        courtCanvas.height !== gameState.canvas.height)) {
        courtCanvas.remove()
        initCourtCanvas(p5)
    }

    // 在WEBGL画布上渲染3D球场
    if (courtCanvas) {
        render3DBasketballCourt(courtCanvas)

        // 计算居中位置
        const x = (p5.width - courtCanvas.width) / 2
        const y = (p5.height - courtCanvas.height) / 2

        // 将WEBGL画布内容绘制到主画布
        p5.image(courtCanvas, x, y)
    }
}
