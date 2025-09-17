import { StylikCSSProperties } from '../types'
import { getMediaQuery } from './breakpoint'
import { pseudos } from './pseudos'
import { StylikParser } from './state'
import { parseUnit } from './unit'
import { camelToKebab } from './utils'

export const parseStyles = (hash: string, config: StylikCSSProperties, state: StylikParser['styles']) => {
    Object.entries(config).forEach(([styleKey, styleValue]) => {
        styleKey = camelToKebab(styleKey)

        if (styleKey === '_selectors') {
            Object.entries(styleValue as Required<StylikCSSProperties>['_selectors']).forEach(([selector, selectorValue]) => {
                const selectorClassName = selector.replace('&', `.${hash}`)

                Object.entries(selectorValue).forEach(([selectorStyleKey, selectorStyleValue]) => {
                    if (typeof selectorStyleValue === 'object') {
                        const allBreakpoints = Object.keys(selectorStyleValue)
                        Object.entries(selectorStyleValue).forEach(([breakpoint, breakpointStyleValue]) => {
                            const mediaQuery = getMediaQuery(breakpoint, allBreakpoints)
                            const propertyKey = camelToKebab(selectorStyleKey)

                            state.set({
                                mediaQuery,
                                className: selectorClassName,
                                propertyKey,
                                value: parseUnit(propertyKey, breakpointStyleValue),
                            })
                        })

                        return
                    }

                    const propertyKey = camelToKebab(selectorStyleKey)

                    state.set({
                        className: selectorClassName,
                        propertyKey,
                        value: parseUnit(propertyKey, selectorStyleValue),
                    })
                })
            })

            return
        }

        if (styleKey[0] === '_') {
            const pseudoColon = pseudos[styleKey as keyof typeof pseudos] ?? ':'
            const pseudoClassName = styleKey.replace('_', `.${hash}${pseudoColon}`)

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
                    className: `.${hash}`,
                    propertyKey,
                    value: parseUnit(propertyKey, breakpointStyleValue),
                })
            })

            return
        }

        const propertyKey = camelToKebab(styleKey)

        state.set({
            className: `.${hash}`,
            propertyKey,
            value: parseUnit(propertyKey, styleValue),
        })
    })
}
