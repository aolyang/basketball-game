import type P5 from "p5"

import { gameState } from "../config/gameState"

// 缓存WEBGL画布
let floorCanvas: P5.Graphics | null = null
// 缓存纹理
let floorTexture: P5.Image | null = null

// 缓存上一次渲染的参数
let lastCanvasWidth = 0
let lastCanvasHeight = 0
let lastRenderTime = 0
let forceRender = true // 首次渲染标志

/**
 * 预加载地板纹理
 * @param p5 p5实例
 */
export function preloadFloorTexture(p5: P5): void {
    floorTexture = p5.loadImage("./src/assets/floor.png",
        () => {
            console.log("Floor texture loaded successfully")
            forceRender = true // 图片加载成功后强制渲染
        },
        () => console.error("Failed to load floor texture")
    )
}

/**
 * 初始化WEBGL画布
 * @param p5 p5实例
 */
function initFloorCanvas(p5: P5): void {
    const { width, height } = gameState.canvas
    floorCanvas = p5.createGraphics(width, height, p5.WEBGL)
    forceRender = true // 初始化画布后强制渲染
}

/**
 * 检查参数是否发生变化
 * @returns 如果参数发生变化，返回true
 */
function hasParamsChanged(): boolean {
    const { width, height } = gameState.canvas

    // 首次渲染或强制渲染
    if (forceRender) {
        forceRender = false
        return true
    }

    // 检查参数是否发生变化
    const paramsChanged =
        lastCanvasWidth !== width ||
        lastCanvasHeight !== height

    // 每30秒强制更新一次，防止长时间不更新
    const currentTime = Date.now()
    const timeChanged = (currentTime - lastRenderTime > 30000)

    return paramsChanged || timeChanged
}

/**
 * 更新缓存的参数
 */
function updateCachedParams(): void {
    const { width, height } = gameState.canvas

    lastCanvasWidth = width
    lastCanvasHeight = height
    lastRenderTime = Date.now()
}

/**
 * 强制下一次渲染
 */
export function forceNextRender(): void {
    forceRender = true
}

/**
 * 渲染地板纹理
 * 将纹理渲染在屏幕底部20%的位置，并循环渲染与界面宽度相等
 * @param p5 p5实例
 */
export function renderFloorTexture(p5: P5): void {
    // 如果纹理未加载，尝试加载
    if (!floorTexture) {
        preloadFloorTexture(p5)
        return
    }

    // 检查参数是否发生变化，如果没有变化则跳过渲染
    if (!hasParamsChanged() && floorCanvas) {
        // 直接使用缓存的画布
        p5.image(floorCanvas, 0, 0)
        return
    }

    // 更新缓存的参数
    updateCachedParams()

    // 懒初始化WEBGL画布
    if (!floorCanvas) {
        initFloorCanvas(p5)
    }

    // 更新地板尺寸（如果画布大小改变）
    if (floorCanvas && (floorCanvas.width !== gameState.canvas.width ||
        floorCanvas.height !== gameState.canvas.height)) {
        floorCanvas.remove()
        initFloorCanvas(p5)
    }

    // 在WEBGL画布上渲染地板纹理
    if (floorCanvas && floorTexture) {
        // 清除背景
        floorCanvas.clear()

        const { width, height } = gameState.canvas

        // 计算地板高度（屏幕底部20%）
        const floorHeight = height * 0.2
        // 地板位置（底部对齐）
        const floorY = height / 2 - floorHeight / 2

        floorCanvas.push()

        // 移动到底部
        floorCanvas.translate(0, floorY, 0)

        // 设置纹理模式为重复
        floorCanvas.textureMode(p5.REPEAT)
        floorCanvas.textureWrap(p5.REPEAT, p5.CLAMP)

        // 计算需要重复的次数
        // 假设纹理宽度为原始纹理宽度
        const textureWidth = floorTexture.width
        const repeatX = Math.ceil(width / textureWidth)

        // 绘制地板
        floorCanvas.texture(floorTexture)
        floorCanvas.noStroke()

        // 创建一个平面，宽度等于画布宽度，高度为画布高度的20%
        floorCanvas.plane(width, floorHeight)

        floorCanvas.pop()

        // 将WEBGL画布内容绘制到主画布
        p5.image(floorCanvas, 0, 0)
    }
}
