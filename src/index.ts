import { create } from './create'
import { stylik } from './state'
import type { Config, StylikBreakpoints, StylikCSSProperties, StylikTheme } from './types'

export const StyleSheet = {
    create,
    configure: (config: Config) => stylik.configure(config),
}

export type { StylikBreakpoints, StylikCSSProperties, StylikTheme }
export { mq } from './utils'
