import { getMetadata, lookupArticles } from '../../scripts/scripts.js';
import { filterArticles } from '../article-feed/article-feed.js';
import { createCard } from '../featured-articles/featured-articles.js';

export default async function decorate(block) {
  const pathnames = [...block.querySelectorAll('a')].map((a) => {
    let { pathname } = new URL(a.href);
    if (pathname.endsWith('/')) pathname = pathname.slice(0, -1);
    return pathname;
  });
  block.textContent = '';
  let articles = await lookupArticles(pathnames);
  if (!articles.length) {
    const feed = { data: [], complete: false, cursor: 0 };
    await filterArticles({ category: getMetadata('category') }, feed, 4, 0);
    articles = feed.data.slice(0, 4);
  }
  articles.forEach((article) => {
    block.append(createCard(article, 'related-posts'));
  });
}
