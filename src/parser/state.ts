import { StyleTagID, StylikCSSProperties } from '../types'
import { isServer } from '../utils'
import { parseStyles } from './core'
import { createParserState, generateHash, getStylesFromState } from './utils'

export class StylikParser {
    private cache = new Set<string>()
    private styles = createParserState()
    private stylesTarget: HTMLStyleElement | null = null

    constructor(id: StyleTagID) {
        if (isServer() || id === StyleTagID.Static) {
            return
        }

        this.stylesTarget = document.querySelector<HTMLStyleElement>(`#${id}`)
    }

    add = (key: string | undefined, config: StylikCSSProperties) => {
        const hash = `${key ? `${key}-` : ''}${generateHash(JSON.stringify(config))}`

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
