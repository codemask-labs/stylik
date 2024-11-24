import { CSSProperties } from '../types'

export const generateHash = (str: string) => {
    let value = 5381
    let len = str.length
    while (len--) value = (value * 33) ^ str.charCodeAt(len)
    return `.-${(value >>> 0).toString(36)}`
}

const KEBAB_REGEX = /[A-Z]/g

export const camelToKebab = (str: string) => str.replace(KEBAB_REGEX, '-$&').toLowerCase()

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
            const secondLevelMap = (() => {
                const firstLevelMap = isMq ? mqMap : mainMap
                const secondLevelMap = firstLevelMap.get(mediaQuery) ?? (() => {
                    const newMap = new Map<string, Map<string, any>>()

                    firstLevelMap.set(mediaQuery, newMap)

                    return newMap
                })()

                return secondLevelMap
            })()
            const thirdLevelMap = secondLevelMap.get(className) ?? (() => {
                const newMap = new Map<string, any>()

                secondLevelMap.set(className, newMap)

                return newMap
            })()

            thirdLevelMap.set(propertyKey, value)
        },
        entries: () => [...mainMap.entries(), ...mqMap.entries()],
    }
}

export const getStylesFromState = (state: ReturnType<typeof createParserState>) => {
    let styles = ''

    console.log(state.entries())
    state.entries().forEach(([mediaQuery, secondLevelMap]) => {
        if (mediaQuery) {
            styles += `${mediaQuery}{`
        }

        secondLevelMap.forEach((thirdLevelMap, className) => {
            styles += `${className}{`

            thirdLevelMap.forEach((value, propertyKey) => {
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
