import type { Visitor } from 'unist-util-visit';

import type { Transformer } from 'unified';
import type { Highlighter, Lang } from 'shiki';

export interface Options {
  highlighter: Highlighter;
  /** @default true */
  ignoreUnknownLanguage?: boolean;
}

const LANGUAGE_ALIASES: Record<string, string> = {
  'gql': 'graphql',
  'yml': 'yaml',
};

export async function withShiki(): Promise<(options: Options) => Transformer> {
  const { visit } = await import('unist-util-visit');

  return options => {
    const highlighter = options.highlighter;
    const loadedLanguages = highlighter.getLoadedLanguages();
    const ignoreUnknownLanguage = options.ignoreUnknownLanguage == null ? true : options.ignoreUnknownLanguage;

    const transformer: Transformer = async function transformer(tree) {
      const visitor: Visitor = function visitor(nodeArg: any) {
        const node: { value: string; lang: Lang; type: string } = nodeArg;
        const lang = ignoreUnknownLanguage && !loadedLanguages.includes(node.lang) ? undefined : node.lang;

        const highlighted = highlighter.codeToHtml(node.value, lang || LANGUAGE_ALIASES[node.lang]);
        node.type = 'html';
        node.value = highlighted;
      };

      visit(tree, 'code', visitor);
    };

    return transformer;
  };
}
