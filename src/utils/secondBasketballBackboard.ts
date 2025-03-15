import type P5 from "p5"

import basketboardUrl from "../assets/basketball-board.png"
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
let isFirstRender = true // 首次渲染标志

// 第二个篮板的配置
export const secondBackboardConfig = {
    positionX: 0.9, // 默认在画布右侧
    positionY: 0.71, // 默认在画布下方
    positionZ: -0.25, // 默认向后偏移
    rotationX: 0,
    rotationY: 0.43, // 默认向右旋转
    rotationZ: 0,
    originX: 0.5, // 默认在篮板中心
    originY: 0.5, // 默认在篮板中心
    originZ: 0,
    scale: 1,
    visible: true
}

/**
 * 预加载篮板图片
 * 在游戏初始化时调用此函数
 * @param p5 - p5实例
 */
export function preloadSecondBackboardImage(p5: P5): void {
    // 使用p5.loadImage加载外部图片
    backboardImage = p5.loadImage(basketboardUrl,
        () => {
            console.log("Second basketball backboard image loaded successfully")
            forceRender = true // 图片加载成功后强制渲染
        },
        () => console.error("Failed to load second basketball backboard image")
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
export function forceNextSecondBackboardRender(): void {
    forceRender = true
}

/**
 * 渲染第二个篮板
 * @param p5 - p5实例
 */
export function renderSecondBackboard(p5: P5): void {
    // 如果图片未加载，尝试加载
    if (!backboardImage) {
        preloadSecondBackboardImage(p5)
        return
    }

    // 初始化WebGL画布
    if (!webglCanvas || webglCanvas.width !== p5.width || webglCanvas.height !== p5.height) {
        if (webglCanvas) webglCanvas.remove()
        initWebGLCanvas(p5)
    }

    if (!webglCanvas) return

    // 如果篮板不可见，跳过渲染
    if (!secondBackboardConfig.visible) return

    const { width, height } = gameState.canvas
    const {
        positionX, positionY, positionZ,
        rotationX, rotationY, rotationZ,
        originX, originY, originZ,
        scale
    } = secondBackboardConfig

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
        console.log("First second basketball backboard render completed")
    }
}

/**
 * 切换第二个篮板的可见性
 */
export function toggleSecondBackboardVisibility(): void {
    secondBackboardConfig.visible = !secondBackboardConfig.visible
    forceRender = true
}

/**
 * 设置第二个篮板的位置
 */
export function setSecondBackboardPosition(x: number, y: number, z: number): void {
    secondBackboardConfig.positionX = x
    secondBackboardConfig.positionY = y
    secondBackboardConfig.positionZ = z
    forceRender = true
}

/**
 * 设置第二个篮板的旋转
 */
export function setSecondBackboardRotation(x: number, y: number, z: number): void {
    secondBackboardConfig.rotationX = x
    secondBackboardConfig.rotationY = y
    secondBackboardConfig.rotationZ = z
    forceRender = true
}

/**
 * 设置第二个篮板的缩放
 */
export function setSecondBackboardScale(scale: number): void {
    secondBackboardConfig.scale = scale
    forceRender = true
}

/**
 * 重置第二个篮板的配置到默认值
 */
export function resetSecondBackboardConfig(): void {
    secondBackboardConfig.positionX = 0.9
    secondBackboardConfig.positionY = 0.71
    secondBackboardConfig.positionZ = -0.25
    secondBackboardConfig.rotationX = 0
    secondBackboardConfig.rotationY = 0.43
    secondBackboardConfig.rotationZ = 0
    secondBackboardConfig.originX = 0.5
    secondBackboardConfig.originY = 0.5
    secondBackboardConfig.originZ = 0
    secondBackboardConfig.scale = 1
    secondBackboardConfig.visible = true
    forceRender = true
}
