import type { ESTree } from 'meriyah'
import { DYNAMIC_STYLIK_PROPERTY } from '../types'
import { apply } from './apply'

export const callExpression = (expression: ESTree.CallExpression) => {
    expression.arguments.forEach(apply)

    if (!expression.callee || expression.callee?.type !== 'MemberExpression') {
        return
    }

    const callee = expression.callee as ESTree.MemberExpression

    if (callee.object.type !== 'Identifier' || callee.object.name !== 'styles') {
        expression.arguments.forEach(apply)

        return
    }

    const identifier = callee.object
    const propertyName = callee.property.type === 'Identifier'
        ? callee.property.name
        : ''

    callee.property = {
        name: DYNAMIC_STYLIK_PROPERTY,
        type: 'Identifier',
    } satisfies ESTree.Identifier
    callee.object = {
        type: 'MemberExpression',
        property: {
            name: propertyName,
            type: 'Identifier',
        } satisfies ESTree.Identifier,
        object: identifier,
    } satisfies ESTree.MemberExpression
}
