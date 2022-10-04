import { decorateBackgrounds } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('bg-center-page-cta');
  decorateBackgrounds(block);
}
