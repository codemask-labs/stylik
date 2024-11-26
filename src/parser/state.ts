import { StyleTagID, StylikCSSProperties } from '../types'
import { isServer } from '../utils'
import { parseStyles } from './core'
import { createParserState, generateHash, getStylesFromState } from './utils'

export class StylikParser {
    private cache = new Set<string>()
    private styles = createParserState()
    private stylesTarget: HTMLStyleElement | null = null

    constructor(id: StyleTagID, private isDev: boolean) {
        if (isServer()) {
            return
        }

        if (!isDev && id === StyleTagID.Static) {
            return
        }

        this.stylesTarget = document.querySelector<HTMLStyleElement>(`#${id}`)
    }

    add = (key: string, config: StylikCSSProperties) => {
        const hash = `${this.isDev ? `${key}-` : ''}${generateHash(config)}`

        if (this.cache.has(hash)) {
            return hash
        }

        this.cache.add(hash)
        parseStyles(hash, config, this.styles)

        if (this.stylesTarget) {
            this.stylesTarget.textContent = getStylesFromState(this.styles)
        }

        return hash
    }

    getStyles = () => getStylesFromState(this.styles)
}
