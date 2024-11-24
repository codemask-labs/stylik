import { CSSProperties, StyleTagID, StylikCSSProperties } from '../types'
import { isServer } from '../utils'
import { parseStyles } from './core'
import { createParserState, generateHash } from './utils'

export class StylikParser {
    private cache = new Set<string>()
    private styles = createParserState()
    private stylesTarget: HTMLStyleElement | null = null

    constructor(id: StyleTagID) {
        if (isServer()) {
            return
        }

        this.stylesTarget = document.querySelector<HTMLStyleElement>(`#${id}`)
    }

    add = (config: StylikCSSProperties) => {
        const hash = generateHash(JSON.stringify(config))

        if (this.cache.has(hash)) {
            return hash
        }

        this.cache.add(hash)
        parseStyles(hash, config, this.styles)

        return hash
    }

    getStyles = () => ''
}
