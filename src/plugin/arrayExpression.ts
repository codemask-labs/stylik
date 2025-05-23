import type { ESTree } from 'meriyah'
import { apply } from './apply'

export const arrayExpression = (expression: ESTree.ArrayExpression) => {
    expression.elements.forEach(el => {
        if (!el) {
            return
        }

        apply(el)
    })
}
