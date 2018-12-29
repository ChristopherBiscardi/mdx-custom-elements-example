const path = require('path');
const detab = require("detab");
const u = require("unist-builder");

module.exports = {
  siteMetadata: {
    title: 'Gatsby Starter MDX Basic',
    description:
      'Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.',
    author: '@chrisbiscardi',
  },
  plugins: [
    {
      resolve: `gatsby-mdx`,
      options: {
        defaultLayouts: { default: path.resolve("./src/components/layout.js") },
        mdxAstHandlers: {
          code(h, node) {
            const value = node.value ? detab(node.value + "\n") : "";
            const lang = node.lang;
            const props = {};

            // Mdast sets `node.meta` to `null` instead of `undefined` if
            // not present, which React doesn't like.
            props.metastring = node.meta || undefined;

            const meta =
              node.meta &&
              node.meta.split(" ").reduce((acc, cur) => {
                if (cur.split("=").length > 1) {
                  const t = cur.split("=");
                  acc[t[0]] = t[1];
                  return acc;
                }
                acc[cur] = true;
                return acc;
              }, {});

            if (meta) {
              Object.keys(meta).forEach(key => {
                props[key] = meta[key];
              });
            }

            return h(node.position, "code-block", {lang, ...props}, [u("text", value)]);
          }
        }
      }
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-default-mdx-basic',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
}
