export default function decorate(block) {
  if (block.classList.contains('normal-width')) block.parentElement.classList.add('normal-width');
  if (block.classList.contains('med-width')) block.parentElement.classList.add('med-width');
  if (block.classList.contains('extra-small-width')) block.parentElement.classList.add('extra-small-width');
}
