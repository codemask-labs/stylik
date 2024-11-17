import { createTypeStyle } from 'typestyle'
import type { NestedCSSProperties } from 'typestyle/lib/types'
import { Config, StyleTagID, StylikBreakpoints, StylikTheme } from './types'
import { getStyleTag, isServer } from './utils'

class Stylik {
    #staticStyles = createTypeStyle()
    #dynamicStyles = createTypeStyle()
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

    constructor() {
        this.#updateStyleTags()
    }

    configure(config: Config & { isDev?: boolean }) {
        this.#theme = config.theme
        this.#breakpoints = config.breakpoints
        this.isDev = Boolean(config.isDev)
    }

    #updateStyleTags() {
        const staticTag = getStyleTag(StyleTagID.Static)
        const dynamicTag = getStyleTag(StyleTagID.Dynamic)

        this.#staticStyles.setStylesTarget(staticTag)
        this.#dynamicStyles.setStylesTarget(dynamicTag)
    }

    getStaticStyles() {
        return this.#staticStyles.getStyles()
    }

    getDynamicStyles() {
        return this.#dynamicStyles.getStyles()
    }

    addStaticStyles(key: string, styles: Array<NestedCSSProperties>) {
        return this.#staticStyles.style(...styles, { $debugName: this.isDev ? key : undefined })
    }

    addDynamicStyles(key: string, styles: Array<NestedCSSProperties>) {
        return this.#dynamicStyles.style(...styles, { $debugName: this.isDev ? key : undefined })
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
