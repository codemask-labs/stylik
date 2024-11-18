import type { ESTree } from 'meriyah'
import { apply } from './apply'

export const arrowFunctionExpression = (expression: ESTree.ArrowFunctionExpression) => {
    if (expression.body.type === 'BlockStatement') {
        const bodyExpression = expression.body.body.find(node => node.type === 'ReturnStatement')?.argument

        if (bodyExpression) {
            apply(bodyExpression)
        }

        return
    }

    apply(expression.body)
}
