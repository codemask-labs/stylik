import { stylik } from '../state'
import { Breakpoint } from '../types'
import { parseMq } from '../utils'

export const getMediaQuery = (breakpoint: string, allBreakpoints: Array<string>) => {
    if (breakpoint in stylik.breakpoints) {
        const breakpointValue = stylik.breakpoints[breakpoint as Breakpoint]
        const nextBreakpoint = allBreakpoints
            .filter((b): b is Breakpoint => b in stylik.breakpoints)
            .map(b => stylik.breakpoints[b])
            .sort((a, b) => a - b)
            .find(b => b > breakpointValue)
        const queries = [
            `(min-width: ${breakpointValue}px)`,
            nextBreakpoint ? `(max-width: ${nextBreakpoint - 1}px)` : undefined,
        ].filter(Boolean).join(' and ')

        return `@media ${queries}`
    }

    const { minWidth, maxWidth, minHeight, maxHeight } = parseMq(breakpoint)

    const queries = [
        minWidth ? `(min-width: ${minWidth})` : undefined,
        maxWidth ? `(max-width: ${maxWidth})` : undefined,
        minHeight ? `(min-height: ${minHeight})` : undefined,
        maxHeight ? `(max-height: ${maxHeight})` : undefined,
    ].filter(Boolean).join(' and ')

    return `@media ${queries}`
}
