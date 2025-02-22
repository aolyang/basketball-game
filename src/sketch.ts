import type P5 from "p5"

export default function sketch(p: P5) {
    let ballPositions: P5.Vector[] = []

    p.setup = () => {
        p.createCanvas(800, 600)
    }

    p.draw = () => {
        p.background(220)
        p.fill("#FF3B3B")
        ballPositions.forEach(ballPosition => {
            p.ellipse(ballPosition.x, ballPosition.y, 40)

            // 示例：篮球基础运动
            ballPosition.x += p.random(-2, 2)
            ballPosition.y += 1
        })
    }

    // 事件监听示例
    p.mousePressed = () => {
        ballPositions.push(p.createVector(p.mouseX, p.mouseY))
    }
}
