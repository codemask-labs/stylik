import type { ESTree } from 'meriyah'
import { apply } from './apply'

export const objectExpression = (expression: ESTree.ObjectExpression) => {
    expression.properties.forEach(property => {
        if (property.type !== 'Property') {
            return
        }

        if (property.value.type === 'AssignmentPattern') {
            return
        }

        apply(property.value)
    })
}
