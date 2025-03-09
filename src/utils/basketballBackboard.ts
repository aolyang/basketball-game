import type P5 from "p5"

import { gameState } from "../config/gameState"

// 篮板图片
let backboardImage: P5.Image | null = null

// WebGL画布
let webglCanvas: P5.Graphics | null = null

// 缓存参数
let lastPositionX = 0
let lastPositionY = 0
let lastPositionZ = 0
let lastRotationX = 0
let lastRotationY = 0
let lastRotationZ = 0
let lastOriginX = 0.5
let lastOriginY = 0.5
let lastOriginZ = 0
let lastScale = 1
let forceRender = true
let isFirstRender = true // 添加首次渲染标志

/**
 * 预加载篮板图片
 * 在游戏初始化时调用此函数
 * @param p5 - p5实例
 */
export function preloadBackboardImage(p5: P5): void {
    // 使用p5.loadImage加载外部图片
    backboardImage = p5.loadImage("src/assets/basketball-board.png",
        () => {
            console.log("Basketball backboard image loaded successfully")
            forceRender = true // 图片加载成功后强制渲染
        },
        () => console.error("Failed to load basketball backboard image")
    )
}

/**
 * 初始化WebGL画布
 * @param p5 - p5实例
 */
function initWebGLCanvas(p5: P5): void {
    const { width, height } = gameState.canvas
    webglCanvas = p5.createGraphics(width, height, p5.WEBGL)
    forceRender = true // 初始化画布后强制渲染
}

/**
 * 强制下一次渲染
 */
export function forceNextBackboardRender(): void {
    forceRender = true
}

/**
 * 渲染篮板
 * @param p5 - p5实例
 */
export function renderBackboard(p5: P5): void {
    // 如果图片未加载，尝试加载
    if (!backboardImage) {
        preloadBackboardImage(p5)
        return
    }

    // 初始化WebGL画布
    if (!webglCanvas || webglCanvas.width !== p5.width || webglCanvas.height !== p5.height) {
        if (webglCanvas) webglCanvas.remove()
        initWebGLCanvas(p5)
    }

    if (!webglCanvas) return

    const { width, height } = gameState.canvas
    const {
        positionX, positionY, positionZ,
        rotationX, rotationY, rotationZ,
        originX, originY, originZ,
        scale
    } = gameState.backboard

    // 检查参数是否变化或是首次渲染
    const paramsChanged =
        isFirstRender ||
        forceRender ||
        lastPositionX !== positionX ||
        lastPositionY !== positionY ||
        lastPositionZ !== positionZ ||
        lastRotationX !== rotationX ||
        lastRotationY !== rotationY ||
        lastRotationZ !== rotationZ ||
        lastOriginX !== originX ||
        lastOriginY !== originY ||
        lastOriginZ !== originZ ||
        lastScale !== scale

    // 更新缓存参数
    lastPositionX = positionX
    lastPositionY = positionY
    lastPositionZ = positionZ
    lastRotationX = rotationX
    lastRotationY = rotationY
    lastRotationZ = rotationZ
    lastOriginX = originX
    lastOriginY = originY
    lastOriginZ = originZ
    lastScale = scale
    forceRender = false

    // 如果参数没有变化且不是首次渲染，跳过渲染
    if (!paramsChanged && !isFirstRender) {
        p5.image(webglCanvas, 0, 0)
        return
    }

    // 清除WebGL画布
    webglCanvas.clear()

    // 计算篮板尺寸
    const backboardWidth = width * 0.25 * scale
    const backboardHeight = backboardWidth * 0.6

    // 计算旋转原点的实际坐标（相对于画布中心）
    const originXOffset = (originX - 0.5) * backboardWidth
    const originYOffset = (originY - 0.5) * backboardHeight
    const originZOffset = originZ * Math.min(backboardWidth, backboardHeight) * 0.1

    // 设置3D变换
    webglCanvas.push()

    // 应用位置
    webglCanvas.translate(
        positionX * width - width/2,
        positionY * height - height/2,
        positionZ * 100
    )

    // 移动到旋转原点
    webglCanvas.translate(originXOffset, originYOffset, originZOffset)

    // 应用旋转
    webglCanvas.rotateX(rotationX * Math.PI)
    webglCanvas.rotateY(rotationY * Math.PI)
    webglCanvas.rotateZ(rotationZ * Math.PI)

    // 移回原位置
    webglCanvas.translate(-originXOffset, -originYOffset, -originZOffset)

    // 绘制篮板图片作为纹理
    webglCanvas.texture(backboardImage)
    webglCanvas.noStroke()

    // 使用平面绘制带有纹理的篮板
    webglCanvas.plane(backboardWidth, backboardHeight)

    webglCanvas.pop()

    // 将WebGL画布内容绘制到主画布
    p5.image(webglCanvas, 0, 0)

    // 标记已完成首次渲染
    if (isFirstRender) {
        isFirstRender = false
        console.log("First basketball backboard render completed")
    }
}
