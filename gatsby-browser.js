import React from "react";
import { MDXProvider } from "@mdx-js/tag";
import Highlight, { defaultProps } from "prism-react-renderer";

const components = {
  "code-block": ({ children, lang, ...props }) => {
    console.log("rendering code-block", props, lang, children);
    return (
      <Highlight {...defaultProps} code={children.trim()} language={lang}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    );
  }
};

export const wrapRootElement = ({ element }) => {
  return <MDXProvider components={components}>{element}</MDXProvider>;
};
