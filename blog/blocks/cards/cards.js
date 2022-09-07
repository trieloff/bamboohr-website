export default function decorate(block) {
  const cards = block.querySelectorAll(':scope > div > div');
  const cols = block.firstElementChild.children.length;
  if (block.classList.contains('full-width')) block.parentElement.classList.add('full-width');

  // add grid cols class
  block.classList.add(`cols-${cols}`);

  // convert "number" classes
  [...block.classList].forEach((name) => {
    if (!Number.isNaN(+name.split('').at(0))) {
      block.classList.remove(name);
      block.classList.add(`style-${name}`);
    }
  });

  // empty block
  block.textContent = '';
  cards.forEach((card) => {
    const icon = card.querySelector('span.icon');
    const image = card.querySelector('picture');
    const title = card.querySelector('h4');

    if (image) {
      image.classList.add('image');
      card.prepend(image);
    }

    if (icon) card.prepend(icon);

    if (title) title.classList.add('title');

    // clear out empties
    card.querySelectorAll(':scope > p').forEach((empty) => {
      if (empty.textContent.trim() === '') empty.remove();
    });

    // add card to block
    card.classList.add('card');
    block.append(card);
  });
}
