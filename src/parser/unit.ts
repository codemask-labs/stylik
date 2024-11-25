const cssNumbers = new Set([
    'animation-iteration-count',
    'border-image-outset',
    'border-image-slice',
    'border-image-width',
    'box-flex',
    'box-flex-group',
    'box-ordinal-group',
    'column-count',
    'columns',
    'counter-increment',
    'counter-reset',
    'flex',
    'flex-grow',
    'flex-positive',
    'flex-shrink',
    'flex-negative',
    'flex-order',
    'font-weight',
    'grid-area',
    'grid-column',
    'grid-column-end',
    'grid-column-span',
    'grid-column-start',
    'grid-row',
    'grid-row-end',
    'grid-row-span',
    'grid-row-start',
    'line-clamp',
    'opacity',
    'order',
    'orphans',
    'tab-size',
    'widows',
    'z-index',
    'zoom',
    'fill-opacity',
    'flood-opacity',
    'stop-opacity',
    'stroke-dasharray',
    'stroke-dashoffset',
    'stroke-miterlimit',
    'stroke-opacity',
    'stroke-width',
])

export const parseUnit = (key: string, value: any) => {
    if (typeof value === 'number' && !cssNumbers.has(key)) {
        return `${value}px`
    }

    return value
}
