import { createOptimizedPicture, getMetadata, toClassName } from '../../scripts/scripts.js';

export default async function decorate(block) {
  let speakers = getMetadata('speaker');
  block.innerHTML = '';
  if (speakers) {
    speakers = speakers.split(',').map((speaker) => toClassName(speaker.trim()));

    const promises = speakers.map(async (speaker) => {
      const speakerPath = `/fragments/speaker/${speaker}`;
      const resp = await fetch(`${speakerPath}.plain.html`);
      const text = await resp.text();
      const dom = new DOMParser().parseFromString(text, 'text/html');
      const fragment = dom.querySelector('body>div');
      const fullname = fragment.querySelector('h1').textContent;
      const position = fragment.querySelector('h2').textContent;
      const img = fragment.querySelector('img');
      const speakerImg = createOptimizedPicture(img.src, fullname, false, [{ width: '80' }]);
      fragment.querySelector('picture').parentElement.remove();

      const bioEl = fragment.querySelector('h2').nextElementSibling;
      const bio = bioEl.textContent || '';
      return `<div class="speaker-profile"><div class="speaker-image">${speakerImg.outerHTML}</div><div class="speaker-name">${fullname}</div><p class="speaker-position">${position}</p><p class="speaker-bio">${bio}</p></div>`;
    });
 
    const speakersData = await Promise.all(promises);
    speakersData.forEach((speaker) => {
      block.innerHTML += speaker;
    });
  }
}
