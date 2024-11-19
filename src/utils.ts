import { stylik } from './state'
import { Breakpoint, StyleTagID } from './types'

export const isServer = () => typeof window === 'undefined'

export const getStyleTag = (id: StyleTagID) => {
    if (isServer()) {
        return { textContent: '' }
    }

    return document.querySelector<HTMLStyleElement>(`#${id}`) ?? { textContent: '' }
}

const mqHeight = (minHeight: number, maxHeight?: number) => {
    return `h(${minHeight}${maxHeight !== undefined ? `|${maxHeight}` : ''})`
}

export const mq = {
    width: (minWidth: number | Breakpoint, maxWidth?: number | Breakpoint) => {
        const minWidthValue = typeof minWidth === 'string' ? stylik.breakpoints[minWidth] : minWidth
        const maxWidthValue = typeof maxWidth === 'string' ? stylik.breakpoints[maxWidth] : maxWidth
        const mqWidth = Object(`w(${minWidthValue}${maxWidthValue !== undefined ? `|${maxWidthValue}` : ''})`)

        Object.defineProperty(mqWidth, 'height', {
            value: (...args: Parameters<typeof mqHeight>) => `${mqWidth} ${mqHeight(...args)}`,
            configurable: false,
            enumerable: false,
        })

        return mqWidth as unknown as symbol & {
            height: typeof mqHeight
        }
    },
    height: mqHeight,
}

export const parseMq = (mq: string) => {
    const [minW, maxW] = mq.toString().match(/w\((\d+)\|(\d+)?\)/)?.slice(1) ?? []
    const [minH, maxH] = mq.toString().match(/h\((\d+)\|(\d+)?\)/)?.slice(1) ?? []

    return {
        minWidth: typeof minW !== 'undefined' ? `${minW}px` : undefined,
        maxWidth: typeof maxW !== 'undefined' ? `${maxW}px` : undefined,
        minHeight: typeof minH !== 'undefined' ? `${minH}px` : undefined,
        maxHeight: typeof maxH !== 'undefined' ? `${maxH}px` : undefined,
    }
}
