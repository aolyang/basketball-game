import type P5 from "p5"
import type { BackboardConfig} from "./basketballBackboardRenderer"

import { BackboardRenderer } from "./basketballBackboardRenderer"

// 第一个篮板的配置
export const firstBackboardConfig: BackboardConfig = {
    positionX: 0.1, // 默认在画布左侧
    positionY: 0.71, // 默认在画布下方
    positionZ: -0.25, // 默认向后偏移
    rotationX: 0,
    rotationY: -0.43, // 默认向左旋转
    rotationZ: 0,
    originX: 0.5, // 默认在篮板中心
    originY: 0.5, // 默认在篮板中心
    originZ: 0,
    scale: 1,
    visible: true
}

// 第二个篮板的配置
export const secondBackboardConfig: BackboardConfig = {
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

// 创建篮板渲染器实例
const firstBackboardRenderer = new BackboardRenderer("src/assets/basketball-board.png", "First")
const secondBackboardRenderer = new BackboardRenderer("src/assets/basketball-board.png", "Second")

/**
 * 预加载所有篮板图片
 * @param p5 p5实例
 */
export function preloadBackboardImages(p5: P5): void {
    firstBackboardRenderer.preloadImage(p5)
    secondBackboardRenderer.preloadImage(p5)
}

/**
 * 强制下一次渲染第一个篮板
 */
export function forceNextFirstBackboardRender(): void {
    firstBackboardRenderer.forceNextRender()
}

/**
 * 强制下一次渲染第二个篮板
 */
export function forceNextSecondBackboardRender(): void {
    secondBackboardRenderer.forceNextRender()
}

/**
 * 渲染第一个篮板
 * @param p5 p5实例
 */
export function renderFirstBackboard(p5: P5): void {
    firstBackboardRenderer.render(p5, firstBackboardConfig)
}

/**
 * 渲染第二个篮板
 * @param p5 p5实例
 */
export function renderSecondBackboard(p5: P5): void {
    secondBackboardRenderer.render(p5, secondBackboardConfig)
}

/**
 * 切换第一个篮板的可见性
 */
export function toggleFirstBackboardVisibility(): void {
    firstBackboardConfig.visible = !firstBackboardConfig.visible
    forceNextFirstBackboardRender()
}

/**
 * 切换第二个篮板的可见性
 */
export function toggleSecondBackboardVisibility(): void {
    secondBackboardConfig.visible = !secondBackboardConfig.visible
    forceNextSecondBackboardRender()
}

/**
 * 重置第一个篮板的配置到默认值
 */
export function resetFirstBackboardConfig(): void {
    firstBackboardConfig.positionX = 0.1
    firstBackboardConfig.positionY = 0.71
    firstBackboardConfig.positionZ = -0.25
    firstBackboardConfig.rotationX = 0
    firstBackboardConfig.rotationY = -0.43
    firstBackboardConfig.rotationZ = 0
    firstBackboardConfig.originX = 0.5
    firstBackboardConfig.originY = 0.5
    firstBackboardConfig.originZ = 0
    firstBackboardConfig.scale = 1
    firstBackboardConfig.visible = true
    forceNextFirstBackboardRender()
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
    forceNextSecondBackboardRender()
}
