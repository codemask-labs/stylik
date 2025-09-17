import { stylik } from './state'
import { DYNAMIC_STYLIK_PROPERTY, StylikCSSProperties, type StylikTheme } from './types'

type DynamicStylesFactory = StylikCSSProperties | ((theme: StylikTheme) => StylikCSSProperties)

export const create = <TStyles extends Record<string, StylikCSSProperties>>(stylesFactory: TStyles | ((theme: StylikTheme) => TStyles)) => {
    const stylesheet = typeof stylesFactory === 'function'
        ? stylesFactory(stylik.theme)
        : stylesFactory

    return Object.fromEntries(
        Object.entries(stylesheet).map(([key, value]) => {
            const className = Object(stylik.addStaticStyles(key, value))

            Object.defineProperty(className, DYNAMIC_STYLIK_PROPERTY, {
                value: (dynamicStylesFactory: DynamicStylesFactory) => {
                    const dynamicStyles = typeof dynamicStylesFactory === 'function'
                        ? dynamicStylesFactory(stylik.theme)
                        : dynamicStylesFactory

                    return `${className} ${stylik.addDynamicStyles(key, dynamicStyles)}`
                },
                configurable: false,
                enumerable: false,
            })

            return [key, className]
        }),
    ) as {
        [K in keyof TStyles]: string & ((dynamicStylesFactory: DynamicStylesFactory) => string)
    }
}
