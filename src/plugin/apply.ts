import { type ESTree } from 'meriyah'
import { arrayExpression } from './arrayExpression'
import { callExpression } from './callExpression'
import { objectExpression } from './objectExpression'

export const apply = (expression: ESTree.Expression) => {
    switch (expression.type) {
        case 'CallExpression':
            return callExpression(expression)
        case 'ObjectExpression':
            return objectExpression(expression)
        case 'ArrayExpression':
            return arrayExpression(expression)
    }
}
