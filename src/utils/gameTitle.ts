import type P5 from "p5"

export function renderGameTitle(p5: P5) {
    const title = "IKun Basketball"
    const size = p5.width / title.length * 1.1
    p5.textSize(size)
    p5.fill(0, 0, 0)
    
    const x = p5.width * 0.15
    const y = p5.height / 2.4
    
    // Render the title
    p5.text(title, x, y)
    p5.textSize(size / 2)
    p5.fill(22, 22, 22, 90)
    p5.text("by AOLYANG", x, y + size / 2)
}