import { media } from 'typestyle'
import type { NestedCSSProperties } from 'typestyle/lib/types'
import { stylik } from './state'
import { type Breakpoint, DYNAMIC_STYLIK_PROPERTY, type StylikTheme } from './types'
import { parseMq } from './utils'

const pseudos = ['_before', '_after', '_hover'] as const

type Pseudos = typeof pseudos[number]

type WithMedia<T extends Record<string, any>> = {
    [K in keyof T]:
        | T[K]
        | {
            [B in Breakpoint]?: T[K]
        }
            & {
                [N: number | symbol]: T[K]
            }
}

type ExtendedNestedCSSProperties = WithMedia<NestedCSSProperties>

export type StylikCSSProperties =
    & ExtendedNestedCSSProperties
    & { [K in Pseudos]?: ExtendedNestedCSSProperties }

const isPseudo = (key: string) => pseudos.includes(key as Pseudos)

const isWithMedia = (value: unknown): value is Record<Breakpoint, NestedCSSProperties> => typeof value === 'object'

const getMediaStyles = (key: string, value: Record<Breakpoint, NestedCSSProperties>) => {
    const parsedStyles = Object.entries(value)
        .map(([breakpoint, breakpointValue]): [number | ReturnType<typeof parseMq>, unknown] => {
            if (breakpoint in stylik.breakpoints) {
                return [stylik.breakpoints[breakpoint as Breakpoint] as number, breakpointValue]
            }

            const mq = parseMq(breakpoint)

            return [mq, breakpointValue]
        })
        .sort(([a], [b]) => {
            if (typeof a === 'number' && typeof b === 'number') {
                return a - b
            }

            if (typeof a === 'number') {
                return -1
            }

            if (typeof b === 'number') {
                return 1
            }

            return 0
        })

    const otherBreakpoints = parsedStyles
        .map(([b]) => b)
        .filter(b => typeof b === 'number')
        .sort()

    return parsedStyles.map(([breakpoint, breakpointValue]) => {
        if (typeof breakpoint !== 'number') {
            return media(breakpoint, { [key]: breakpointValue })
        }

        const nextBreakpoint = otherBreakpoints.find(b => b > breakpoint)

        return media({
            minWidth: `${breakpoint}px`,
            maxWidth: nextBreakpoint ? `${nextBreakpoint - 1}px` : undefined,
        }, { [key]: breakpointValue })
    })
}

const generateStyles = (style: StylikCSSProperties): Array<NestedCSSProperties> => {
    const styles = Object.entries(style).flatMap(([key, value]) => {
        if (isPseudo(key)) {
            return generateStyles(value as StylikCSSProperties).map(v => ({
                $nest: {
                    [key.replace('_', '&:')]: v,
                },
            }))
        }

        if (isWithMedia(value)) {
            return getMediaStyles(key, value)
        }

        return [{ [key]: value }]
    })

    return styles
}

type DynamicStylesFactory = StylikCSSProperties | ((theme: StylikTheme) => StylikCSSProperties)

export const create = <TStyles extends Record<string, StylikCSSProperties>>(stylesFactory: TStyles | ((theme: StylikTheme) => TStyles)) => {
    const stylesheet = typeof stylesFactory === 'function'
        ? stylesFactory(stylik.theme)
        : stylesFactory

    return Object.fromEntries(
        Object.entries(stylesheet).map((
            [key, value],
        ) => {
            const className = Object(stylik.addStaticStyles(key, generateStyles(value)))

            Object.defineProperty(className, DYNAMIC_STYLIK_PROPERTY, {
                value: (dynamicStylesFactory: DynamicStylesFactory) => {
                    const dynamicStyles = typeof dynamicStylesFactory === 'function'
                        ? dynamicStylesFactory(stylik.theme)
                        : dynamicStylesFactory

                    return `${className} ${stylik.addDynamicStyles(key, generateStyles(dynamicStyles))}`
                },
                configurable: false,
                enumerable: false,
            })

            return [key, className]
        }),
    ) as Record<
        keyof TStyles,
        string & ((dynamicStylesFactory: DynamicStylesFactory) => string)
    >
}
