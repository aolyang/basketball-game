import type P5 from "p5"

import { gameState } from "../config/gameState"

// 篮板配置接口
export interface BackboardConfig {
    // 位置 (0-1, 画布百分比)
    positionX: number
    positionY: number
    positionZ: number
    // 旋转 (弧度)
    rotationX: number
    rotationY: number
    rotationZ: number
    // 旋转原点 (0-1, 篮板尺寸百分比)
    originX: number
    originY: number
    originZ: number
    // 缩放因子
    scale: number
    // 可见性
    visible: boolean
}

// 篮板渲染器类
export class BackboardRenderer {
    private backboardImage: P5.Image | null = null
    private webglCanvas: P5.Graphics | null = null
    private isFirstRender: boolean = true
    private forceRender: boolean = true
    private lastPositionX: number = 0
    private lastPositionY: number = 0
    private lastPositionZ: number = 0
    private lastRotationX: number = 0
    private lastRotationY: number = 0
    private lastRotationZ: number = 0
    private lastOriginX: number = 0
    private lastOriginY: number = 0
    private lastOriginZ: number = 0
    private lastScale: number = 1
    private lastVisible: boolean = true

    /**
     * 创建篮板渲染器
     * @param imagePath 篮板图片路径（通过 import 导入的 URL）
     * @param name 篮板名称（用于日志）
     */
    constructor(
        private readonly imagePath: string,
        private readonly name: string = "Basketball"
    ) {}

    /**
     * 预加载篮板图片
     * @param p5 p5实例
     */
    public preloadImage(p5: P5): void {
        // 使用p5.loadImage加载外部图片
        this.backboardImage = p5.loadImage(this.imagePath,
            () => {
                console.log(`${this.name} basketball backboard image loaded successfully`)
                this.forceRender = true // 图片加载成功后强制渲染
            },
            () => console.error(`Failed to load ${this.name} basketball backboard image`)
        )
    }

    /**
     * 初始化WebGL画布
     * @param p5 p5实例
     */
    private initWebGLCanvas(p5: P5): void {
        const { width, height } = gameState.canvas
        this.webglCanvas = p5.createGraphics(width, height, p5.WEBGL)
        this.forceRender = true // 初始化画布后强制渲染
    }

    /**
     * 强制下一次渲染
     */
    public forceNextRender(): void {
        this.forceRender = true
    }

    /**
     * 检查参数是否发生变化
     * @param config 篮板配置
     * @returns 如果参数发生变化，返回true
     */
    private hasParamsChanged(config: BackboardConfig): boolean {
        const { width, height } = gameState.canvas
        const {
            positionX, positionY, positionZ,
            rotationX, rotationY, rotationZ,
            originX, originY, originZ,
            scale
        } = config

        // 首次渲染或强制渲染
        if (this.isFirstRender || this.forceRender) {
            return true
        }

        // 检查参数是否发生变化
        return (
            this.lastPositionX !== positionX ||
            this.lastPositionY !== positionY ||
            this.lastPositionZ !== positionZ ||
            this.lastRotationX !== rotationX ||
            this.lastRotationY !== rotationY ||
            this.lastRotationZ !== rotationZ ||
            this.lastOriginX !== originX ||
            this.lastOriginY !== originY ||
            this.lastOriginZ !== originZ ||
            this.lastScale !== scale ||
            this.lastVisible !== config.visible
        )
    }

    /**
     * 更新缓存参数
     * @param config 篮板配置
     */
    private updateCachedParams(config: BackboardConfig): void {
        const { width, height } = gameState.canvas
        const {
            positionX, positionY, positionZ,
            rotationX, rotationY, rotationZ,
            originX, originY, originZ,
            scale
        } = config

        this.lastPositionX = positionX
        this.lastPositionY = positionY
        this.lastPositionZ = positionZ
        this.lastRotationX = rotationX
        this.lastRotationY = rotationY
        this.lastRotationZ = rotationZ
        this.lastOriginX = originX
        this.lastOriginY = originY
        this.lastOriginZ = originZ
        this.lastScale = scale
        this.lastVisible = config.visible
        this.forceRender = false
    }

    /**
     * 渲染篮板
     * @param p5 p5实例
     * @param config 篮板配置
     */
    public render(p5: P5, config: BackboardConfig): void {
        // 如果篮板不可见，跳过渲染
        if (!config.visible) return

        // 如果图片未加载，尝试加载
        if (!this.backboardImage) {
            this.preloadImage(p5)
            return
        }

        // 初始化WebGL画布
        if (!this.webglCanvas || this.webglCanvas.width !== p5.width || this.webglCanvas.height !== p5.height) {
            if (this.webglCanvas) this.webglCanvas.remove()
            this.initWebGLCanvas(p5)
        }

        if (!this.webglCanvas) return

        // 检查参数是否变化
        const paramsChanged = this.hasParamsChanged(config)

        // 更新缓存参数
        this.updateCachedParams(config)

        // 如果参数没有变化且不是首次渲染，跳过渲染
        if (!paramsChanged && !this.isFirstRender) {
            p5.image(this.webglCanvas, 0, 0)
            return
        }

        // 清除WebGL画布
        this.webglCanvas.clear()

        const { width, height } = gameState.canvas
        const {
            positionX, positionY, positionZ,
            rotationX, rotationY, rotationZ,
            originX, originY, originZ,
            scale
        } = config

        // 计算篮板尺寸
        const backboardWidth = width * 0.25 * scale
        const backboardHeight = backboardWidth * 0.6

        // 计算旋转原点的实际坐标（相对于画布中心）
        const originXOffset = (originX - 0.5) * backboardWidth
        const originYOffset = (originY - 0.5) * backboardHeight
        const originZOffset = originZ * Math.min(backboardWidth, backboardHeight) * 0.1

        // 设置3D变换
        this.webglCanvas.push()

        // 应用位置
        this.webglCanvas.translate(
            positionX * width - width/2,
            positionY * height - height/2,
            positionZ * 100
        )

        // 移动到旋转原点
        this.webglCanvas.translate(originXOffset, originYOffset, originZOffset)

        // 应用旋转
        this.webglCanvas.rotateX(rotationX * Math.PI)
        this.webglCanvas.rotateY(rotationY * Math.PI)
        this.webglCanvas.rotateZ(rotationZ * Math.PI)

        // 移回原位置
        this.webglCanvas.translate(-originXOffset, -originYOffset, -originZOffset)

        // 绘制篮板图片作为纹理
        this.webglCanvas.texture(this.backboardImage)
        this.webglCanvas.noStroke()

        // 使用平面绘制带有纹理的篮板
        this.webglCanvas.plane(backboardWidth, backboardHeight)

        this.webglCanvas.pop()

        // 将WebGL画布内容绘制到主画布
        p5.image(this.webglCanvas, 0, 0)

        // 标记已完成首次渲染
        if (this.isFirstRender) {
            this.isFirstRender = false
            console.log(`First ${this.name} basketball backboard render completed`)
        }
    }
}
