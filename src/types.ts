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
