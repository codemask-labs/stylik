import { create, type StylikCSSProperties } from './create'
import { stylik } from './state'
import type { Config, StylikBreakpoints, StylikTheme } from './types'

export const StyleSheet = {
    create,
    configure: (config: Config) => stylik.configure(config),
}

export type { StylikBreakpoints, StylikCSSProperties, StylikTheme }
