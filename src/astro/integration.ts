import type { AstroIntegration } from 'astro'
import { writeFile } from 'fs/promises'
import { name } from '../../package.json'
import { plugin } from '../plugin'
import { stylik as stylikState } from '../state'
import type { Config } from '../types'

const serializeConfig = (obj: Record<string, any>) => {
    let result = ''

    Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'function') {
            result += `${key}:${value.toString()},`

            return
        }

        if (typeof value === 'object') {
            result += `${key}:${serializeConfig(value)},`

            return
        }

        result += `${key}:${JSON.stringify(value)},`
    })

    return `{${result}}`
}

export const stylik = (config: Config): AstroIntegration => ({
    name,
    hooks: {
        'astro:config:setup': ({ updateConfig, command, injectScript, addMiddleware }) => {
            const stylikConfig = {
                ...config,
                isDev: command === 'dev',
            }
            stylikState.configure(stylikConfig)
            injectScript('page', `import { StyleSheet } from "${name}"`)
            injectScript('page', `StyleSheet.configure(${serializeConfig(stylikConfig)})`)
            updateConfig({
                vite: {
                    plugins: [plugin()],
                },
            })
            addMiddleware({
                order: 'pre',
                entrypoint: `${name}/middleware`,
            })
        },
        'astro:build:done': async ({ dir }) => {
            await writeFile(
                `${dir.pathname}_astro/stylik.css`,
                stylikState.getStaticStyles(),
            )
        },
    },
})
