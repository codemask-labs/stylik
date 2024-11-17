import { defineMiddleware } from 'astro/middleware'
import { stylik } from '../state'
import { StyleTagID } from '../types'

const injectStyles = (html: string) => {
    const staticTag = stylik.isDev
        ? `<style id=${StyleTagID.Static}>${stylik.getStaticStyles()}</style>`
        : '<link rel="stylesheet" href="./_astro/stylik.css" />'
    const dynamicTag = `<style id=${StyleTagID.Dynamic}>${stylik.getDynamicStyles()}</style>`

    return html.replace('</head>', `${staticTag}\n${dynamicTag}\n</head>`)
}

export const onRequest = defineMiddleware(async (_context, next) => {
    const response = await next()

    if (response.headers.get('content-type') !== 'text/html') {
        return response
    }

    const cloned = response.clone()
    const html = await cloned.text()
    const modifiedHtml = injectStyles(html)
    const modifiedResponse = new Response(modifiedHtml, cloned)

    return modifiedResponse
})
