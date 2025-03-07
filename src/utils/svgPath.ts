import type P5 from "p5"

type SVGPathOptions = {
    fill?: {
        r: number
        g: number
        b: number
        a?: number
    }
    stroke?: {
        r: number
        g: number
        b: number
        a?: number
    }
    fillRule?: "nonzero" | "evenodd"
    clipRule?: "nonzero" | "evenodd"
}

function applyColor(p5: P5, color?: { r: number; g: number; b: number; a?: number }, isStroke: boolean = false) {
    if (!color) {
        return false
    }
    const { r, g, b, a } = color
    if (a !== undefined) {
        isStroke ? p5.stroke(r, g, b, a) : p5.fill(r, g, b, a)
    } else {
        isStroke ? p5.stroke(r, g, b) : p5.fill(r, g, b)
    }
    return true
}

export function renderSVGPath(p5: P5, pathString: string, options?: SVGPathOptions) {
    const path = new Path2D(pathString)
    const ctx = p5.drawingContext as CanvasRenderingContext2D
    
    // Apply fill and stroke styles
    if (!applyColor(p5, options?.fill, false)) {
        p5.noFill()
    }
    if (!applyColor(p5, options?.stroke, true)) {
        p5.noStroke()
    }
    
    // Apply fill rule
    if (options?.fillRule === "evenodd") {
        ctx.fill(path, "evenodd")
    } else {
        ctx.fill(path)
    }
}