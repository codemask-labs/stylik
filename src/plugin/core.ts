import { generate } from 'escodegen'
import { parseModule } from 'meriyah'
import { name } from '../../package.json'
import { apply } from './apply'

export const stylik = () => {
    return {
        name,
        transform: (code: string, id: string) => {
            if (!id.includes('src') || !id.endsWith('.tsx')) {
                return code
            }

            const ast = parseModule(code)
            const component = ast.body.find(node => node.type === 'ExportNamedDeclaration')

            if (!component || component.declaration?.type !== 'VariableDeclaration') {
                return code
            }

            const expression = component.declaration.declarations.at(0)?.init

            if (!expression) {
                return code
            }

            apply(expression)

            return generate(ast)
        }
    }
}
