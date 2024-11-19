# stylik ✏️

Minimal CSS-in-JS library

## Features

- ✍️ Simple configuration
- 💅 Minimal API
- 💪 TypeScript support
- 🌈 Media queries and pseudo selectors
- 📦 Astro integration

## Installation

Install package using preferred package manager:

```bash
npm install @codemask-labs/stylik
yarn add @codemask-labs/stylik
pnpm add @codemask-labs/stylik
bun add @codemask-labs/stylik
```

## Getting started

### Configuration

Create theme, breakpoints and override stylik types:

```ts
export const theme = {
    colors: {
        error: '#FF0000',
        white: '#FFFFFF',
        black: '#000000',
    },
} as const

export const breakpoints = {
    xs: 0,
    md: 992,
    lg: 1920,
} as const

export type Breakpoints = typeof breakpoints
export type Theme = typeof theme

declare module '@codemask-labs/stylik' {
    interface StylikTheme extends Theme {}
    interface StylikBreakpoints extends Breakpoints {}
}
```

Configure stylik using `StyleSheet.configure` or built in Astro integration.

```ts
import { StyleSheet } from '@codemask-labs/stylik'

StyleSheet.configure({
    theme,
    breakpoints,
})
```

```ts
import { defineConfig } from 'astro/config'
import { stylik } from '@codemask-labs/stylik/astro'
import { breakpoints, theme } from './src/lib/styles'

export default defineConfig({
    integrations: [
        stylik({
            breakpoints,
            theme,
        }),
    ]
})
```

And configuration is done!

### Styling

```tsx
import { StyleSheet } from '@codemask-labs/stylik'

const App = () => (
    <div className={styles.wrapper}>
        <h1>Meet stylik!</h1>
        <div className={styles.wrapper({ fontSize: 32 })}>
            Minimal CSS-in-JS library
        </div>
    </div>
)

const styles = StyleSheet.create(theme => ({
    wrapper: {
        padding: 16
    },
}))
```
