import { stylik } from '../state'
import { Breakpoint } from '../types'
import { parseMq } from '../utils'

export const getMediaQuery = (breakpoint: string) => {
    if (breakpoint in stylik.breakpoints) {
        return `@media (min-width: ${stylik.breakpoints[breakpoint as Breakpoint]}px)`
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
