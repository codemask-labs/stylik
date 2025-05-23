import type { ESTree } from 'meriyah'
import { apply } from './apply'

export const conditionalExpression = (expression: ESTree.ConditionalExpression) => {
    apply(expression.consequent)
    apply(expression.alternate)
}
