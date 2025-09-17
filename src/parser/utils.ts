import { StylikCSSProperties } from '../types'

const serialize = (obj: string | number | object): string => {
    if (typeof obj !== 'object') {
        return String(obj)
    }

    const sortedKeys = Object.keys(obj).sort()
    const sortedKeyValuePairs = sortedKeys.map(key => `${key}:${serialize(obj[key as keyof typeof obj])}`)

    return `{${sortedKeyValuePairs.join(',')}}`
}

// Based on https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
const cyrb53 = (data: string, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed
    let h2 = 0x41c6ce57 ^ seed

    for (let i = 0, ch; i < data.length; i++) {
        ch = data.charCodeAt(i)
        h1 = Math.imul(h1 ^ ch, 2654435761)
        h2 = Math.imul(h2 ^ ch, 1597334677)
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)

    return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

export const generateHash = (config: StylikCSSProperties) => {
    const serializedString = serialize(config)
    const hash = cyrb53(serializedString).toString(36)

    return `s${hash}`
}

const KEBAB_REGEX = /[A-Z]/g

export const camelToKebab = (str: string) => str.replace(KEBAB_REGEX, '-$&').toLowerCase()

const safeGetMap = (map: Map<string, Map<string, any>>, key: string) => {
    const nextLevelMap = map.get(key)

    if (!nextLevelMap) {
        const newMap = new Map<string, any>()

        map.set(key, newMap)

        return newMap
    }

    return nextLevelMap
}

type SetStateProps = {
    mediaQuery?: string
    className: string
    isMq?: boolean
    propertyKey: string
    value: any
}

export const createParserState = () => {
    type MapType = Map<string, Map<string, Map<string, any>>>
    const mainMap: MapType = new Map()
    const mqMap: MapType = new Map()

    return {
        set: ({
            mediaQuery = '',
            className,
            isMq,
            propertyKey,
            value,
        }: SetStateProps) => {
            const firstLevelMap = isMq ? mqMap : mainMap
            const secondLevelMap = safeGetMap(firstLevelMap, mediaQuery)
            const thirdLevelMap = safeGetMap(secondLevelMap, className)

            thirdLevelMap.set(propertyKey, value)
        },
        mainMap,
        mqMap,
    }
}

export const getStylesFromState = (state: ReturnType<typeof createParserState>) => {
    let styles = ''

    const generate = (mediaQuery: string, secondLevelMap: Map<string, Map<string, string>>) => {
        if (mediaQuery) {
            styles += `${mediaQuery}{`
        }

        for (const [className, thirdLevelMap] of secondLevelMap) {
            styles += `${className}{`

            for (const [propertyKey, value] of thirdLevelMap) {
                if (value === undefined) {
                    continue
                }

                styles += `${camelToKebab(propertyKey)}:${value};`
            }

            styles += '}'
        }

        if (mediaQuery) {
            styles += '}'
        }
    }

    for (const [mediaQuery, secondLevelMap] of state.mainMap) {
        generate(mediaQuery, secondLevelMap)
    }

    for (const [mediaQuery, secondLevelMap] of state.mqMap) {
        generate(mediaQuery, secondLevelMap)
    }

    return styles
}
