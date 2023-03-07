import { buildBlock, getMetadata } from './scripts.js';

function buildIntroMeta() {
  const releaseDate = getMetadata('release-date');
  const planType = getMetadata('plan-type');
  const topicPrimary = getMetadata('topic-primary');
  const h1 = document.querySelector('h1');

  if (releaseDate) {
    const introMetaData = [];
    introMetaData.push(`<span class="intro-meta-cat">${planType} | ${topicPrimary}</span><span class="intro-meta-date">Date of release: ${releaseDate}</span>`);
    const introMetaBlock = buildBlock('title', [introMetaData]);
    introMetaBlock?.classList?.add('medium-info', 'intro-meta');
    h1.after(introMetaBlock);
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