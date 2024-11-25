export const generateHash = (str: string) => {
    let value = 5381
    let len = str.length
    while (len--) value = (value * 33) ^ str.charCodeAt(len)
    return `s${(value >>> 0).toString(36)}`
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
        entries: () => [...mainMap.entries(), ...mqMap.entries()],
    }
}

export const getStylesFromState = (state: ReturnType<typeof createParserState>) => {
    let styles = ''

    state.entries().forEach(([mediaQuery, secondLevelMap]) => {
        if (mediaQuery) {
            styles += `${mediaQuery}{`
        }

        secondLevelMap.forEach((thirdLevelMap, className) => {
            styles += `.${className}{`

            thirdLevelMap.forEach((value, propertyKey) => {
                if (value === undefined) {
                    return
                }

                styles += `${propertyKey}:${value};`
            })

            styles += '}'
        })

        if (mediaQuery) {
            styles += '}'
        }
    })

    return styles
}
