import { StylikCSSProperties } from '../types'
import { getMediaQuery } from './breakpoint'
import { StylikParser } from './state'
import { parseUnit } from './unit'
import { camelToKebab } from './utils'

export const parseStyles = (hash: string, config: StylikCSSProperties, state: StylikParser['styles']) => {
    Object.entries(config).forEach(([styleKey, styleValue]) => {
        styleKey = camelToKebab(styleKey)

        if (styleKey.charCodeAt(0) === 95) {
            const pseudoClassName = styleKey.replace('_', `${hash}:`)

            Object.entries(styleValue).forEach(([pseudoStyleKey, pseudoStyleValue]) => {
                if (typeof pseudoStyleValue === 'object') {
                    const allBreakpoints = Object.keys(pseudoStyleValue)
                    Object.entries(pseudoStyleValue).forEach(([breakpoint, breakpointStyleValue]) => {
                        const mediaQuery = getMediaQuery(breakpoint, allBreakpoints)
                        const propertyKey = camelToKebab(pseudoStyleKey)

                        state.set({
                            mediaQuery,
                            className: pseudoClassName,
                            propertyKey,
                            value: parseUnit(propertyKey, breakpointStyleValue),
                        })
                    })

                    return
                }

                const propertyKey = camelToKebab(pseudoStyleKey)

                state.set({
                    className: pseudoClassName,
                    propertyKey,
                    value: parseUnit(propertyKey, pseudoStyleValue),
                })
            })

            return
        }

        if (typeof styleValue === 'object') {
            const allBreakpoints = Object.keys(styleValue)
            Object.entries(styleValue).forEach(([breakpoint, breakpointStyleValue]) => {
                const mediaQuery = getMediaQuery(breakpoint, allBreakpoints)
                const propertyKey = camelToKebab(styleKey)

                state.set({
                    mediaQuery,
                    className: hash,
                    propertyKey,
                    value: parseUnit(propertyKey, breakpointStyleValue),
                })
            })

            return
        }

        const propertyKey = camelToKebab(styleKey)

        state.set({
            className: hash,
            propertyKey,
            value: parseUnit(propertyKey, styleValue),
        })
    })
}
