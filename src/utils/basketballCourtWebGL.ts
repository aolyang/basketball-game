import type P5 from "p5"

import { gameState } from "../config/gameState"

// 缓存WEBGL画布
let courtCanvas: P5.Graphics | null = null

// 缓存上一次渲染的参数
let lastRotationX = 0
let lastRotationY = 0
let lastRotationZ = 0
let lastUseWebGL = true
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
    const { rotationX, rotationY, rotationZ } = gameState.court

    // 清除背景
    g.clear()

    // 计算球场尺寸
    const courtWidth = width * 0.8 // 使用画布宽度的80%
    const courtHeight = courtWidth * (15/28) // 保持篮球场比例

    // 设置3D变换
    g.push()

    // 应用旋转
    g.rotateX(rotationX)
    g.rotateY(rotationY)
    g.rotateZ(rotationZ)

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
 * 更新动画旋转
 * @param p5 - p5实例
 */
function updateAnimatedRotation(p5: P5): void {
    if (!gameState.court.enableAnimation) return

    const time = p5.millis() / 1000

    gameState.court.rotationX = p5.sin(time * 0.3) * 0.2 // 上下倾斜
    gameState.court.rotationY = p5.sin(time * 0.2) * 0.3 // 左右旋转
    gameState.court.rotationZ = p5.sin(time * 0.1) * 0.05 // 轻微扭转
}

/**
 * 检查参数是否发生变化
 * @returns 如果参数发生变化，返回true
 */
function hasParamsChanged(): boolean {
    const { width, height } = gameState.canvas
    const { rotationX, rotationY, rotationZ, useWebGL } = gameState.court

    // 检查参数是否发生变化
    const paramsChanged =
        lastRotationX !== rotationX ||
        lastRotationY !== rotationY ||
        lastRotationZ !== rotationZ ||
        lastUseWebGL !== useWebGL ||
        lastCanvasWidth !== width ||
        lastCanvasHeight !== height

    // 如果启用了动画，则每500毫秒强制更新一次
    const currentTime = Date.now()
    const timeChanged = gameState.court.enableAnimation && (currentTime - lastRenderTime > 500)

    return paramsChanged || timeChanged
}

/**
 * 更新缓存的参数
 */
function updateCachedParams(): void {
    const { width, height } = gameState.canvas
    const { rotationX, rotationY, rotationZ, useWebGL } = gameState.court

    lastRotationX = rotationX
    lastRotationY = rotationY
    lastRotationZ = rotationZ
    lastUseWebGL = useWebGL
    lastCanvasWidth = width
    lastCanvasHeight = height
    lastRenderTime = Date.now()
}

/**
 * 渲染篮球场（使用WEBGL或回退到2D模式）
 * @param p5 - p5实例
 */
export function renderBasketballCourt(p5: P5): void {
    // 如果启用了动画，更新旋转角度
    updateAnimatedRotation(p5)

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

    if (gameState.court.useWebGL) {
        // 使用WEBGL模式

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
    } else {
        // 回退到2D模式（使用原来的实现）
        console.log("Rendering basketball court in 2D mode", new Date().toISOString())
        render2DBasketballCourt(p5)
    }
}

/**
 * 在2D模式下渲染篮球场（作为回退选项）
 * @param p5 - p5实例
 */
function render2DBasketballCourt(p5: P5): void {
    const { width, height } = gameState.canvas

    // Basketball court standard proportions (28m x 15m)
    // We'll scale everything based on canvas dimensions
    const courtWidth = width * 0.9 // Use 90% of canvas width
    const courtHeight = courtWidth * (15/28) // Maintain aspect ratio

    // Calculate court position to center it
    const courtX = (width - courtWidth) / 2
    const courtY = (height - courtHeight) / 2

    // Court dimensions
    const halfCourtWidth = courtWidth / 2
    const threePointRadius = courtWidth * 0.23 // Approximate 3-point arc radius
    const keyWidth = courtWidth * 0.12 // Key/paint width
    const keyHeight = courtHeight * 0.35 // Key/paint height
    const circleRadius = courtWidth * 0.06 // Center circle radius
    const basketRadius = courtWidth * 0.015 // Basket circle radius
    const basketOffset = courtWidth * 0.02 // Distance from baseline to basket

    p5.push()
    p5.noFill()
    p5.stroke(0) // Black lines
    p5.strokeWeight(2)

    // Draw court outline
    p5.rect(courtX, courtY, courtWidth, courtHeight)

    // Draw half-court line
    p5.line(
        courtX + halfCourtWidth,
        courtY,
        courtX + halfCourtWidth,
        courtY + courtHeight
    )

    // Draw center circle
    p5.circle(
        courtX + halfCourtWidth,
        courtY + courtHeight / 2,
        circleRadius * 2
    )

    // Draw left key (paint)
    p5.rect(
        courtX,
        courtY + (courtHeight - keyHeight) / 2,
        keyWidth,
        keyHeight
    )

    // Draw right key (paint)
    p5.rect(
        courtX + courtWidth - keyWidth,
        courtY + (courtHeight - keyHeight) / 2,
        keyWidth,
        keyHeight
    )

    // Draw left basket
    p5.circle(
        courtX + basketOffset,
        courtY + courtHeight / 2,
        basketRadius * 2
    )

    // Draw right basket
    p5.circle(
        courtX + courtWidth - basketOffset,
        courtY + courtHeight / 2,
        basketRadius * 2
    )

    // Draw left three-point arc
    p5.arc(
        courtX + basketOffset,
        courtY + courtHeight / 2,
        threePointRadius * 2,
        threePointRadius * 2,
        -p5.QUARTER_PI,
        p5.QUARTER_PI,
        p5.OPEN
    )

    // Draw right three-point arc
    p5.arc(
        courtX + courtWidth - basketOffset,
        courtY + courtHeight / 2,
        threePointRadius * 2,
        threePointRadius * 2,
        p5.PI - p5.QUARTER_PI,
        p5.PI + p5.QUARTER_PI,
        p5.OPEN
    )

    p5.pop()
}
