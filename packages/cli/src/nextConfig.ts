import { config } from './cliConfig';
import { writeFileFormatIfNotExists } from './writeFormat';

export async function writeNextConfig() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'next.config.js'],
    `
  const { register } = require('esbuild-register/dist/node');

  register({
    extensions: ['.ts', '.tsx'],
  });
  
  const { i18n } = require('./next-i18next.config');
  
  const { withGuildDocs } = require('@guild-docs/server');
  
  const { getRoutes } = require('./routes.ts');
  
  module.exports = withGuildDocs({
    i18n,
    getRoutes,
  });      
`,
    'typescript'
  );
}

export async function writei18Config() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'next-i18next.config.js'],
    `
  module.exports = {
      i18n: {
        defaultLocale: "en",
        locales: ["en"],
      },
    };
  `,
    'typescript'
  );
}

export async function writeRoutes() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'routes.ts'],
    `
    import { IRoutes, GenerateRoutes } from '@guild-docs/server';

    export function getRoutes(): IRoutes {
      const Routes: IRoutes = {
        _: {
          index: {
            $name: 'Home',
            $routes: [['index', 'Home Page']],
          },
          docs: {
            $name: 'Docs',
            $routes: [['index', 'Getting Started']],
          },
        },
      };
      GenerateRoutes({
        Routes,
        folderPattern: 'docs',
        basePath: 'docs',
        basePathLabel: 'Documentation',
      });
    
      return Routes;
    }
        `,

    'typescript'
  );
}

export async function writeTranslations() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'public/locales/en/common.json'],
    `
  {
    "greeting": "Hello!"
  }
  
  `,
    'json'
  );
}

export async function writeApp() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'src/pages/_app.tsx'],
    `
    import 'remark-admonitions/styles/infima.css';
    import 'prism-themes/themes/prism-atom-dark.css';
    
    import { appWithTranslation } from 'next-i18next';
    import { ReactNode, useMemo } from 'react';
    
    import { Box, ChakraProvider, extendTheme, theme as chakraTheme, Stack, chakra } from '@chakra-ui/react';
    
    import { NextNProgress, MdxInternalProps, MDXNavigation, iterateRoutes, ExtendComponents } from '@guild-docs/client';
    
    import type { AppProps } from 'next/app';
    
    const theme = extendTheme({
      fonts: {
        heading: '"Poppins", sans-serif',
        body: '"Poppins", sans-serif',
      },
      config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
      },
    } as typeof chakraTheme);

    const a = chakra('a', {
      baseStyle: {
        fontWeight: 'bold',
        color: 'blue.600',
      },
    });
    
    ExtendComponents({
      HelloWorld() {
        return <p>Hello World!</p>;
      },
      a
    });
    
    export function AppThemeProvider({ children }: { children: ReactNode }) {
      return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
    }
    
    const serializedMdx = process.env.SERIALIZED_MDX_ROUTES;
    let mdxRoutesData = serializedMdx && JSON.parse(serializedMdx);
    
    function App({ Component, pageProps }: AppProps) {
      const mdxRoutes: MdxInternalProps['mdxRoutes'] | undefined = pageProps.mdxRoutes;
      const Navigation = useMemo(() => {
        const paths = mdxRoutes === 1 ? mdxRoutesData : (mdxRoutesData = mdxRoutes || mdxRoutesData);
    
        return <MDXNavigation paths={iterateRoutes(paths)} />;
      }, [mdxRoutes]);
      return (
        <>
          <NextNProgress />
          <AppThemeProvider>
            <Stack isInline>
              <Box maxW="280px" width="100%">
                {Navigation}
              </Box>
              <Component {...pageProps} />
            </Stack>
          </AppThemeProvider>
        </>
      );
    }
    
    export default appWithTranslation(App);
        `,
    'typescript'
  );
}

export async function writeDocPages() {
  const w1 = writeFileFormatIfNotExists(
    [config.cwd, 'src/pages/docs/[[...slug]].tsx'],
    `
    import Head from 'next/head';

    import { DocsContent, DocsTOC, MDXPage } from '@guild-docs/client';
    import { MDXPaths, MDXProps } from '@guild-docs/server';
    
    import { getRoutes } from '../../../routes';
    
    import type { GetStaticPaths, GetStaticProps } from 'next';
    
    export default MDXPage(function PostPage({ content, TOC, MetaHead, BottomNavigation }) {
      return (
        <>
          <Head>{MetaHead}</Head>
          <DocsContent>{content}</DocsContent>
          <DocsTOC>
            <TOC />
            <BottomNavigation />
          </DocsTOC>
        </>
      );
    });
    
    export const getStaticProps: GetStaticProps = ctx => {
      return MDXProps(
        ({ readMarkdownFile, getArrayParam }) => {
          return readMarkdownFile('docs/', getArrayParam('slug'));
        },
        ctx,
        {
          getRoutes,
        }
      );
    };
    
    export const getStaticPaths: GetStaticPaths = ctx => {
      return MDXPaths('docs', { ctx });
    };
            `,
    'typescript'
  );

  const w2 = writeFileFormatIfNotExists(
    [config.cwd, 'src/pages/index.tsx'],
    `
  export default function Index() {
    return <p>Welcome!</p>;
  }
  
  `,
    'typescript'
  );

  await Promise.all([w1, w2]);
}

export async function writeDocsDirectory() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'docs/index.mdx'],
    `
---
title: Docs Index
---

# Index Docs Page

<Translated>greeting</Translated> This is the Index of the Documentation Page!

<HelloWorld />

## Heading 2

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nascetur ridiculus mus mauris vitae ultricies leo integer. Duis at consectetur lorem donec massa sapien. Ipsum dolor sit amet consectetur adipiscing. Habitasse platea dictumst vestibulum rhoncus est pellentesque. Est pellentesque elit ullamcorper dignissim cras tincidunt. Gravida dictum fusce ut placerat orci nulla. Augue lacus viverra vitae congue eu. Risus quis varius quam quisque id diam vel. Imperdiet massa tincidunt nunc pulvinar. Amet tellus cras adipiscing enim eu turpis. Velit scelerisque in dictum non consectetur. In fermentum posuere urna nec.

### Heading 3

Lobortis mattis aliquam faucibus purus. Aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices. In tellus integer feugiat scelerisque varius morbi enim. In ante metus dictum at tempor. Nunc faucibus a pellentesque sit amet porttitor eget dolor. Eu turpis egestas pretium aenean pharetra magna ac placerat vestibulum. Porttitor rhoncus dolor purus non enim praesent elementum facilisis leo. Lectus vestibulum mattis ullamcorper velit sed ullamcorper. Enim praesent elementum facilisis leo vel fringilla est ullamcorper eget. Suspendisse potenti nullam ac tortor vitae purus faucibus ornare. In dictum non consectetur a erat. Faucibus interdum posuere lorem ipsum dolor. Morbi tristique senectus et netus et malesuada fames ac.

Senectus et netus et malesuada fames. Ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Lacus luctus accumsan tortor posuere ac ut consequat. Velit laoreet id donec ultrices. Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Interdum velit euismod in pellentesque. Mauris in aliquam sem fringilla ut morbi tincidunt. Aliquet nec ullamcorper sit amet risus nullam eget felis. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. Dui nunc mattis enim ut tellus. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Mauris nunc congue nisi vitae suscipit tellus. Duis convallis convallis tellus id. Ultricies integer quis auctor elit sed. Vitae congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Faucibus a pellentesque sit amet porttitor eget dolor morbi. Et malesuada fames ac turpis egestas sed tempus. Ut sem nulla pharetra diam sit. Ultricies integer quis auctor elit sed.

Rhoncus mattis rhoncus urna neque. Habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim. Ultricies mi quis hendrerit dolor magna eget est lorem ipsum. Urna et pharetra pharetra massa massa ultricies. Amet purus gravida quis blandit turpis cursus in hac habitasse. Leo vel orci porta non. Consectetur lorem donec massa sapien faucibus. Nibh venenatis cras sed felis eget velit aliquet sagittis id. Laoreet sit amet cursus sit amet dictum. Eros donec ac odio tempor orci dapibus. Enim nec dui nunc mattis enim ut tellus elementum sagittis. Hac habitasse platea dictumst quisque sagittis purus sit amet. Tellus id interdum velit laoreet id. Adipiscing tristique risus nec feugiat in. Ligula ullamcorper malesuada proin libero. Gravida dictum fusce ut placerat orci nulla pellentesque dignissim enim. Pulvinar etiam non quam lacus suspendisse faucibus interdum. Sit amet aliquam id diam maecenas. Arcu odio ut sem nulla pharetra. Tempor nec feugiat nisl pretium fusce id.

Odio ut enim blandit volutpat maecenas volutpat blandit. Fermentum et sollicitudin ac orci phasellus egestas. Ut tortor pretium viverra suspendisse potenti nullam ac tortor. Risus nec feugiat in fermentum. Cursus sit amet dictum sit. Dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc. Nisi vitae suscipit tellus mauris a. Aliquam sem fringilla ut morbi tincidunt. Ornare lectus sit amet est placerat in egestas. Sit amet luctus venenatis lectus magna fringilla. A lacus vestibulum sed arcu non odio. Ut enim blandit volutpat maecenas volutpat blandit aliquam. Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi.

Eget mi proin sed libero enim sed. Vitae sapien pellentesque habitant morbi tristique senectus. Elit eget gravida cum sociis natoque penatibus et magnis dis. Pellentesque diam volutpat commodo sed egestas. Faucibus scelerisque eleifend donec pretium vulputate. Adipiscing elit ut aliquam purus sit. Duis ultricies lacus sed turpis tincidunt id. In vitae turpis massa sed. Eget lorem dolor sed viverra ipsum nunc aliquet bibendum enim. Augue eget arcu dictum varius duis at consectetur lorem. Quam quisque id diam vel quam elementum pulvinar etiam. Nunc mattis enim ut tellus elementum sagittis. Praesent elementum facilisis leo vel fringilla est. Urna cursus eget nunc scelerisque viverra mauris in aliquam. Nisl rhoncus mattis rhoncus urna. Sit amet dictum sit amet justo. Donec ac odio tempor orci dapibus ultrices in. Facilisis leo vel fringilla est ullamcorper eget nulla facilisi. Adipiscing commodo elit at imperdiet dui. A diam sollicitudin tempor id eu nisl nunc.

#### Heading 4

Volutpat ac tincidunt vitae semper quis lectus. Risus viverra adipiscing at in. Et malesuada fames ac turpis egestas integer eget aliquet. Sed nisi lacus sed viverra tellus in hac habitasse platea. In iaculis nunc sed augue. Ornare massa eget egestas purus viverra accumsan in. Eu mi bibendum neque egestas congue quisque egestas diam. Placerat orci nulla pellentesque dignissim enim. Augue interdum velit euismod in pellentesque. Lobortis elementum nibh tellus molestie nunc non blandit massa enim. Pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Non blandit massa enim nec. Placerat in egestas erat imperdiet. Nisl pretium fusce id velit ut. Urna molestie at elementum eu facilisis sed odio. Maecenas volutpat blandit aliquam etiam erat velit scelerisque. Curabitur vitae nunc sed velit dignissim sodales ut. A cras semper auctor neque vitae tempus quam. Diam volutpat commodo sed egestas egestas. Tempus iaculis urna id volutpat.

## New Item

Senectus et netus et malesuada fames. Ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Lacus luctus accumsan tortor posuere ac ut consequat. Velit laoreet id donec ultrices. Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Interdum velit euismod in pellentesque. Mauris in aliquam sem fringilla ut morbi tincidunt. Aliquet nec ullamcorper sit amet risus nullam eget felis. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. Dui nunc mattis enim ut tellus. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Mauris nunc congue nisi vitae suscipit tellus. Duis convallis convallis tellus id. Ultricies integer quis auctor elit sed. Vitae congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Faucibus a pellentesque sit amet porttitor eget dolor morbi. Et malesuada fames ac turpis egestas sed tempus. Ut sem nulla pharetra diam sit. Ultricies integer quis auctor elit sed.

Dolor sit amet consectetur adipiscing elit ut aliquam. Venenatis tellus in metus vulputate eu scelerisque felis imperdiet proin. Iaculis eu non diam phasellus. In dictum non consectetur a erat nam. Est placerat in egestas erat imperdiet sed euismod nisi. Erat imperdiet sed euismod nisi porta lorem mollis. Urna et pharetra pharetra massa massa ultricies mi quis. Pulvinar neque laoreet suspendisse interdum consectetur libero id faucibus nisl. Pellentesque elit ullamcorper dignissim cras. Pellentesque elit eget gravida cum. Dictumst quisque sagittis purus sit amet volutpat consequat. Justo laoreet sit amet cursus sit amet dictum sit. Nibh mauris cursus mattis molestie a iaculis at erat. Malesuada pellentesque elit eget gravida cum sociis. Nunc scelerisque viverra mauris in. Diam quam nulla porttitor massa id neque aliquam vestibulum. At auctor urna nunc id cursus metus aliquam eleifend mi.
          `,
    'mdx'
  );
}

export async function writeTSConfig() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'tsconfig.json'],
    `
{
  "compilerOptions": {
    "target": "es2019",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "noEmit": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
      `,
    'json'
  );
}

export async function writeDocument() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'src/pages/_document.tsx'],
    `
  import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';

import { ColorModeScript } from '@chakra-ui/react';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: any) => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <ColorModeScript initialColorMode="light" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
  `,
    'typescript'
  );
}
