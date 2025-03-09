import { gameState } from "../config/gameState"
import { firstBackboardConfig } from "./basketballBackboards"

/**
 * 创建并返回当前gameState的快照
 * @returns 当前gameState的JSON字符串
 */
export function createGameStateSnapshot(): string {
    // 创建一个深拷贝，避免引用问题
    const snapshot = JSON.stringify(gameState, null, 2)
    return snapshot
}

/**
 * 将当前gameState的快照输出到控制台
 */
export function logGameStateSnapshot(): void {
    console.log("=== Game State Snapshot ===")
    console.log(createGameStateSnapshot())
    console.log("==========================")
}

/**
 * 将当前gameState的特定部分输出到控制台
 * @param section 要输出的部分，如"court", "backboard"等
 */
export function logGameStateSection(section: keyof typeof gameState): void {
    if (section in gameState) {
        console.log(`=== Game State Section: ${section} ===`)
        console.log(JSON.stringify(gameState[section], null, 2))
        console.log("==========================")
    } else {
        console.error(`Section "${section}" not found in gameState`)
    }
}

/**
 * 将当前篮板状态输出到控制台
 */
export function logBackboardState(): void {
    console.log(`=== First Backboard State ===`)
    console.log(JSON.stringify(firstBackboardConfig, null, 2))
    console.log("==========================")
}

/**
 * 将当前篮球场状态输出到控制台
 */
export function logCourtState(): void {
    logGameStateSection("court")
}

/**
 * 将当前画布状态输出到控制台
 */
export function logCanvasState(): void {
    logGameStateSection("canvas")
}

/**
 * 将当前游戏状态保存为JSON文件
 * 注意：此功能仅在支持文件系统API的环境中有效
 */
export function saveGameStateToFile(): void {
    try {
        const snapshot = createGameStateSnapshot()
        const blob = new Blob([snapshot], { type: "application/json" })
        const url = URL.createObjectURL(blob)

        // 创建一个下载链接
        const a = document.createElement("a")
        a.href = url
        a.download = `gamestate-${new Date().toISOString().replace(/:/g, "-")}.json`
        document.body.appendChild(a)
        a.click()

        // 清理
        setTimeout(() => {
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        }, 0)

        console.log("Game state saved to file")
    } catch (error) {
        console.error("Failed to save game state to file:", error)
    }
}
