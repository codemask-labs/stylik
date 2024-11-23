import type * as CSS from 'csstype'

export interface StylikTheme {}
export interface StylikBreakpoints {}

export const enum StyleTagID {
    Static = 'stylik-static',
    Dynamic = 'stylik-dynamic',
}

export const DYNAMIC_STYLIK_PROPERTY = '__stylik__'

export type Config = {
    theme: StylikTheme
    breakpoints: StylikBreakpoints
}

type ParsePseudos<T extends string> = T extends `:${infer U}` ? `_${U}`
    : T extends `::${infer V}` ? `_${V}`
    : never
export type Pseudos = ParsePseudos<CSS.Pseudos>
export type Breakpoint = keyof StylikBreakpoints

type WithMedia<T extends Record<string, any>> = {
    [K in keyof T]:
        | T[K]
        | {
            [B in Breakpoint]?: T[K]
        }
            & {
                [N: number]: T[K]
            }
}

type TLength = string | number
export type CSSProperties =
    & CSS.StandardPropertiesFallback<TLength>
    & CSS.SvgPropertiesFallback<TLength>
    & CSS.VendorPropertiesHyphenFallback<TLength>
    & CSS.ObsoletePropertiesFallback<TLength>
type ExtendedNestedCSSProperties = WithMedia<CSSProperties>

export type StylikCSSProperties =
    & ExtendedNestedCSSProperties
    & { [K in Pseudos]?: ExtendedNestedCSSProperties }
