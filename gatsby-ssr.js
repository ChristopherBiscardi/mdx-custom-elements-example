import React from "react";
import { MDXProvider } from "@mdx-js/tag";

const components = {
  "code-block": props => {
    return <code {...props} />;
  }
};

export const wrapRootElement = ({ element }) => {
  return <MDXProvider components={{ components }}>{element}</MDXProvider>;
};
