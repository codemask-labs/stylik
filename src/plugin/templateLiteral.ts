import type { ESTree } from 'meriyah'
import { apply } from './apply'

export const templateLiteral = (expression: ESTree.TemplateLiteral) => {
    expression.expressions.forEach(apply)
}
