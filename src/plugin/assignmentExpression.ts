import type { ESTree } from 'meriyah'
import { apply } from './apply'

export const assignmentExpression = (expression: ESTree.AssignmentExpression) => {
    apply(expression.left)
    apply(expression.right)
}
