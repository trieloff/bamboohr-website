export default function decorate(block) {
  if (block.classList.contains('full-width')) block.parentElement.classList.add('full-width');
  if (block.classList.contains('normal-width')) block.parentElement.classList.add('normal-width');
}
