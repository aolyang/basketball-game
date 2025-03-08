import type P5 from "p5"

import { gameState } from "../../config/gameState"
import { Dialog } from "../components/Dialog.ts"

interface CircleState {
    x: number
    y: number
    speedX: number
    speedY: number
    radius: number
}

const circle: CircleState = {
    x: 100,
    y: 100,
    speedX: 5,
    speedY: 3,
    radius: 30
}

const exitDialog = new Dialog({
    title: "Exit Game",
    onConfirm: () => {
        gameState.currentPage = "main"
        gameState.isPaused = false
        exitDialog.hide()
    },
    onCancel: () => {
        exitDialog.hide()
    },
    onShow: () => {
        gameState.isPaused = true
    },
    onHide: () => {
        gameState.isPaused = false
    },
    isVisible: false
})

function updateCircle(p5: P5) {
    if (gameState.isPaused) return

    circle.x += circle.speedX
    circle.y += circle.speedY

    // Bounce off walls
    if (circle.x + circle.radius > p5.width || circle.x - circle.radius < 0) {
        circle.speedX *= -1
    }
    if (circle.y + circle.radius > p5.height || circle.y - circle.radius < 0) {
        circle.speedY *= -1
    }
}

export function renderGamePage(p5: P5) {
    updateCircle(p5)

    // Draw the circle
    p5.fill(255)
    p5.stroke(0)
    p5.circle(circle.x, circle.y, circle.radius * 2)

    exitDialog.render(p5)
}

export function handleGameKeyboard(p5: P5) {
    if (p5.keyCode === p5.ESCAPE) {
        if (exitDialog.isVisible()) exitDialog.hide()
        else exitDialog.show()
    } else if (p5.keyCode === p5.ENTER && exitDialog.isVisible()) {
        gameState.currentPage = "main"
        exitDialog.hide()
    }
}
