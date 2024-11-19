import type { AstroIntegration } from 'astro'
import { writeFile } from 'fs/promises'
import { name } from '../../package.json'
import { plugin } from '../plugin'
import { stylik as stylikState } from '../state'
import type { Config } from '../types'

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
            injectScript('page', `StyleSheet.configure(${JSON.stringify(stylikConfig)})`)
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
