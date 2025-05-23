import { type ESTree } from 'meriyah'
import { arrayExpression } from './arrayExpression'
import { arrowFunctionExpression } from './arrowFunction'
import { assignmentExpression } from './assignmentExpression'
import { callExpression } from './callExpression'
import { conditionalExpression } from './conditionalExpression'
import { objectExpression } from './objectExpression'

export const apply = (expression: ESTree.Expression) => {
    switch (expression.type) {
        case 'CallExpression':
            return callExpression(expression)
        case 'ObjectExpression':
            return objectExpression(expression)
        case 'ArrayExpression':
            return arrayExpression(expression)
        case 'ArrowFunctionExpression':
            return arrowFunctionExpression(expression)
        case 'AssignmentExpression':
            return assignmentExpression(expression)
        case 'ConditionalExpression':
            return conditionalExpression(expression)
    }
}
