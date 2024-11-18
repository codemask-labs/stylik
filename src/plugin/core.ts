import { generate } from 'escodegen'
import { parseModule } from 'meriyah'
import { apply } from './apply'

export const plugin = () => {
    return {
        name: 'stylik-vite-plugin',
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
        },
    }
}
