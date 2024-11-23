export const generateHash = (str: string) => {
    let value = 5381
    let len = str.length
    while (len--) value = (value * 33) ^ str.charCodeAt(len)
    return `.${(value >>> 0).toString(36)}`
}

const KEBAB_REGEX = /[A-Z]/g

export const camelToKebab = (str: string) => str.replace(KEBAB_REGEX, '-$&').toLowerCase()
