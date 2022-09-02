export default function decorate(block) {
  const cards = block.querySelectorAll(':scope > div > div');
  const cols = block.firstElementChild.children.length;

  // add grid cols class
  block.classList.add(`cols-${cols}`);

  // convert "number" classes
  [...block.classList].forEach((name) => {
    const first = name.split('').at(0);
    if (!Number.isNaN(+first)) {
      block.classList.remove(name);
      block.classList.add(`style-${name}`);
    }
  });

  // empty block
  block.textContent = '';
  cards.forEach((card) => {
    const image = card.querySelector('picture');
    const title = card.querySelector('h4');

    image.classList.add('image');
    card.prepend(image);

    title.classList.add('title');

    // clear out empties
    card.querySelectorAll(':scope > p').forEach((empty) => {
      if (empty.textContent.trim() === '') empty.remove();
    });

    // add card to block
    card.classList.add('card');
    block.append(card);
  });
}
