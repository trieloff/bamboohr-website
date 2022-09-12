export default function decorate(block) {
  const byline = block.querySelector('em');
  if (block.classList.contains('full-width')) block.parentElement.classList.add('full-width');
  if (block.classList.contains('normal-width')) block.parentElement.classList.add('normal-width');

  // Adding image class to block children
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => cell.classList.add(cell.querySelector('img') ? 'image' : 'content'));
  });

  // if byline
  if (byline) {
    byline.parentNode.classList.add('byline');
    byline.parentNode.textContent = byline.textContent;
  }
}
