export default function decorate(block) {
  const byline = block.querySelector('em');
  const company = block.querySelector('h4');
  if (block.classList.contains('full-width')) block.parentElement.classList.add('full-width');
  if (block.classList.contains('normal-width')) block.parentElement.classList.add('normal-width');

  // Adding image class to block children
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) =>
      cell.classList.add(cell.querySelector('img') ? 'image' : 'content')
    );
  });

  // if company
  if (company) {
    company.classList.add('company');
  }

  // if byline
  if (byline) {
    byline.parentNode.classList.add('byline');
    byline.parentNode.textContent = byline.textContent;
  }
}
