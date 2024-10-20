import Head from 'next/head';

import { DocsContent, DocsTOC, MDXPage } from '@pablosz/guild-docs-client';
import { MDXPaths, MDXProps } from '@pablosz/guild-docs-server';

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
      return readMarkdownFile('docs/', getArrayParam('slug'), { importPartialMarkdown: true });
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
