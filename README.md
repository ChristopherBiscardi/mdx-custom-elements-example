# Warning

To run this example, you need to patch @mdx-js/mdx.

# MDX Custom Elements Example

This example shows how to use remark plugins to parse sections of
markdown into elements that can be replaced by an MDXProvider. 


The big examples here are `code-block`, which successfully replaces
trying to deal with `<pre><code>` blocks and math syntax, which uses
`inline-math` and `block-math`.

[read the blog post]()


### The MDX patch

modify `node_modules/@mdx-js/mdx/mdx-ast-to-mdx-hast.js` to include
the following handlers option.

```diff
const toHAST = require('mdast-util-to-hast')
const detab = require('detab')
const u = require('unist-builder')

+function mdxAstToMdxHast({ mdxAstHandlers }) {
  return (tree, _file) => {
    const handlers = {
      // `inlineCode` gets passed as `code` by the HAST transform.
      // This makes sure it ends up being `inlineCode`
      inlineCode(h, node) {
        return Object.assign({}, node, {
          type: 'element',
          tagName: 'inlineCode',
          properties: {},
          children: [
            {
              type: 'text',
              value: node.value
            }
          ]
        })
      },
      code(h, node) {
        const value = node.value ? detab(node.value + '\n') : ''
        const lang = node.lang
        const props = {}

        if (lang) {
          props.className = ['language-' + lang]
        }

        // Mdast sets `node.meta` to `null` instead of `undefined` if
        // not present, which React doesn't like.
        props.metastring = node.meta || undefined

        const meta =
          node.meta &&
          node.meta.split(' ').reduce((acc, cur) => {
            if (cur.split('=').length > 1) {
              const t = cur.split('=')
              acc[t[0]] = t[1]
              return acc
            }
            acc[cur] = true
            return acc
          }, {})

        if (meta) {
          Object.keys(meta).forEach(key => {
            props[key] = meta[key]
          })
        }

        return h(node.position, 'pre', [
          h(node, 'code', props, [u('text', value)])
        ])
      },
      import(h, node) {
        return Object.assign({}, node, {
          type: 'import'
        })
      },
      export(h, node) {
        return Object.assign({}, node, {
          type: 'export'
        })
      },
      comment(h, node) {
        return Object.assign({}, node, {
          type: 'comment'
        })
      },
      jsx(h, node) {
        return Object.assign({}, node, {
          type: 'jsx'
        })
      },
+     ...mdxAstHandlers
    }

    const hast = toHAST(tree, {
      handlers
    })

    return hast
  }
}

module.exports = mdxAstToMdxHast
```
