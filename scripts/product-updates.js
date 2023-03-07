import { buildBlock, getMetadata } from './scripts.js';

function buildIntroMeta() {
  const releaseDate = getMetadata('release-date');
  const h1 = document.querySelector('h1');

  if (releaseDate) {
    const introMetaEl = document.createElement('p');
    introMetaEl.classList.add('intro-meta')
    introMetaEl.innerHTML = `<p>Date of release: ${releaseDate}</p>`;
    h1.after(introMetaEl);
  }
}

function buildWistiaEmbed(main) {
  const wistiaVideoId = getMetadata('wistia-video-id');
  if (wistiaVideoId) {
    const wistiaVideoUrl = `https://bamboohr.wistia.com/medias/${wistiaVideoId}`;
    const wistiaData = [];
    wistiaData.push(`<p><a href="${wistiaVideoUrl}"></a></p>`);

    const wistiaBlock = buildBlock('wistia', [wistiaData]);
    const wistiaSection = document.createElement('div');
    wistiaSection.prepend(wistiaBlock);
    const introMetaEl = main.querySelector('.intro-meta');
    introMetaEl.after(wistiaSection);
  }
}

export default async function decorateTemplate(main) {
  buildIntroMeta(main);
  buildWistiaEmbed(main)
}