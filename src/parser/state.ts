import { StyleTagID, StylikCSSProperties } from '../types'
import { isServer } from '../utils'
import { parseStyles } from './core'
import { createParserState, generateHash, getStylesFromState } from './utils'

export class StylikParser {
    private cache = new Set<string>()
    private styles = createParserState()
    private stylesTarget: HTMLStyleElement | null = null
    private staticProd = false

    constructor(id: StyleTagID, private isDev: boolean) {
        if (isServer()) {
            return
        }

        this.staticProd = !isDev && id === StyleTagID.Static

        if (this.staticProd) {
            return
        }

        const style = Object.assign(document.createElement('style'), {
            id: `${id}-${Math.random().toString(32).slice(9)}`,
        })

        document.head.appendChild(style)
        this.stylesTarget = style
    }

    add = (key: string, config: StylikCSSProperties) => {
        const hash = `${this.isDev ? `${key}-` : ''}${generateHash(config)}`

        try {
            if (this.cache.has(hash)) {
                return
            }

            this.cache.add(hash)

            if (this.staticProd) {
                return
            }

            parseStyles(hash, config, this.styles)

            if (this.stylesTarget) {
                this.stylesTarget.textContent = getStylesFromState(this.styles)
            }
            // No matter what return the hash
        } finally {
            return hash
        }
    }

    getStyles = () => getStylesFromState(this.styles)
}
