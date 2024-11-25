import { StylikParser } from './parser'
import { Config, StyleTagID, StylikBreakpoints, StylikCSSProperties, StylikTheme } from './types'
import { isServer } from './utils'

class Stylik {
    #staticStyles = new StylikParser(StyleTagID.Static)
    #dynamicStyles = new StylikParser(StyleTagID.Dynamic)
    #theme: StylikTheme | undefined
    #breakpoints: StylikBreakpoints | undefined
    isDev = false

    get theme() {
        if (!this.#theme) {
            throw new Error('No theme configured')
        }

        return this.#theme
    }

    get breakpoints() {
        if (!this.#breakpoints) {
            throw new Error('No breakpoints configured')
        }

        return this.#breakpoints
    }

    configure(config: Config & { isDev?: boolean }) {
        this.#theme = config.theme
        this.#breakpoints = config.breakpoints
        this.isDev = Boolean(config.isDev)
    }

    getStaticStyles() {
        return this.#staticStyles.getStyles()
    }

    getDynamicStyles() {
        return this.#dynamicStyles.getStyles()
    }

    addStaticStyles(key: string, styles: StylikCSSProperties) {
        return this.#staticStyles.add(this.isDev ? key : undefined, styles)
    }

    addDynamicStyles(key: string, styles: StylikCSSProperties) {
        return this.#dynamicStyles.add(this.isDev ? key : undefined, styles)
    }
}

declare global {
    var __stylik__: Stylik
}

if (isServer() && !globalThis.__stylik__) {
    globalThis.__stylik__ = new Stylik()
}

export const stylik = isServer()
    ? globalThis.__stylik__
    : new Stylik()
