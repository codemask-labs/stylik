import { StylikCSSProperties } from '../types'
import { getMediaQuery } from './breakpoint'
import { parseUnit } from './unit'
import { camelToKebab } from './utils'

export const parseStyles = (hash: string, config: StylikCSSProperties) => {
    let styles = `${hash}{`

    const generateStyles = ([key, value]: [string, any]) => {
        if (key.charCodeAt(0) === 95) {
            styles += `}`
        }
    }

    const a = Object.entries(config).reduce((acc, [styleKey, styleValue]) => {
        styleKey = camelToKebab(styleKey)

        if (styleKey.charCodeAt(0) === 95) {
            const pseudo = styleKey.replace('_', `${hash}:`)
            Object.entries(styleValue).forEach(([pseudoStyleKey, pseudoStyleValue]) => {
                if (typeof pseudoStyleValue === 'object') {
                    Object.entries(pseudoStyleValue).forEach(([breakpoint, breakpointStyleValue]) => {
                        const mediaQuery = getMediaQuery(breakpoint)

                        acc[`${mediaQuery}\0${pseudo}`] ??= {}
                        acc[`${mediaQuery}\0${pseudo}`][pseudoStyleKey] ??= breakpointStyleValue
                    })

                    return
                }

                acc[pseudo] ??= {}
                acc[pseudo][pseudoStyleKey] = parseUnit(styleKey, pseudoStyleValue)
            })

            return acc
        }

        if (typeof styleValue === 'object') {
            Object.entries(styleValue).forEach(([breakpoint, breakpointStyleValue]) => {
                const mediaQuery = getMediaQuery(breakpoint)

                acc[mediaQuery] ??= {}
                acc[mediaQuery][styleKey] = parseUnit(styleKey, breakpointStyleValue)
            })

            return acc
        }

        acc[hash] ??= {}
        acc[hash][styleKey] = parseUnit(styleKey, styleValue)

        return acc
    }, {} as Record<string, any>)

    console.log(a)

    styles += '}'

    return styles
}
