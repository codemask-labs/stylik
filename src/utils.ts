import { StyleTagID } from './types'

export const isServer = () => typeof window === 'undefined'

export const getStyleTag = (id: StyleTagID) => {
    if (isServer()) {
        return { textContent: '' }
    }

    return document.querySelector<HTMLStyleElement>(`#${id}`) ?? { textContent: '' }
}
