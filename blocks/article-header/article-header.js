import { formatDate, toClassName } from '../../scripts/scripts.js';

function applyClasses(styles, elements, prefix) {
  [...elements].forEach((row, i) => {
    row.classList.add(`${prefix}-${styles[i] || 'extra'}`);
  });
}

function createSharing() {
  const { title } = document;
  const url = window.location.href;
  const shares = [
    { icon: 'facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { icon: 'twitter', url: `http://twitter.com/share?&url=${url}` },
    { icon: 'linkedin', url: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
    { icon: 'email', url: `mailto:?subject=${title}&body=${url}` },
    { icon: 'rss', url: '#' },
  ];
  const div = document.createElement('div');
  div.className = 'article-header-share';
  shares.forEach((button) => {
    const a = document.createElement('a');
    a.href = button.url;
    a.target = '_blank';
    a.innerHTML = `<img src="/icons/${button.icon}.svg" class="icon icon-${button.icon}">`;
    div.append(a);
  });
  return (div);
}

export default async function decorateArticleHeader($block, blockName) {
  applyClasses(['image', 'eyebrow', 'title', 'author-pub'], $block.children, blockName);
  applyClasses(['category', 'read-time'], $block.querySelector('.article-header-eyebrow').firstChild.children, blockName);
  applyClasses(['author', 'publication-date', 'updated-date'], $block.querySelector('.article-header-author-pub').firstChild.children, blockName);

  // link author
  const $author = $block.querySelector(`.${blockName}-author`);
  const author = $author.textContent;
  const a = document.createElement('a');
  a.href = `/blog/author/${toClassName(author)}`;
  a.textContent = author;
  $author.textContent = '';
  $author.append(a);

  // format dates
  const $pubdate = $block.querySelector(`.${blockName}-publication-date`);
  $pubdate.textContent = formatDate($pubdate.textContent);

  const $update = $block.querySelector(`.${blockName}-updated-date`);
  if ($update.textContent) $update.textContent = formatDate($update.textContent);

  // sharing
  $block.append(createSharing());
}
