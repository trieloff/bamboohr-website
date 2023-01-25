import { buildBlock, getMetadata } from './scripts.js';

function buildFormBlock(main) {
  const formBlockData = [];
  const category = getMetadata('category').substring(0, getMetadata('category').length-1);
  const customFormTitle = getMetadata('custom-form-title');
  const customFormSubheading = getMetadata('custom-form-subheading');

  // const tabs = main.querySelectorAll('h2');
  // tabs.forEach((tab) => {
  //   const content = document.createElement('div');
  //   let sibling = tab.nextElementSibling;
  //   while (sibling && ![...tabs].includes(sibling)) {
  //     content.append(sibling.cloneNode(true));
  //     sibling = sibling.nextElementSibling;
  //   }
  //   content.prepend(tab);
  //   // if (content) blockContent.push([content.innerHTML]);
  //   console.log(content);
  // });

  const partners = main.querySelectorAll('h2');
  console.log(partners);
  partners.forEach((partner) => {
    console.log(partner);
  });
  
  
  formBlockData.push(main.innerHTML);

  

  main.innerHTML = '';
  const formTitle = customFormTitle || `Download your free ${category}.`;
  const formSubheading = customFormSubheading || 'All you need to do is complete the form below.';
  formBlockData.push(`<p><strong>${formTitle}</strong></p><p>${formSubheading}</p><p>form</p>`);

  if (formBlockData.length > 0) {
    const section = document.createElement('div');
    const formBlock = buildBlock('form', [formBlockData]);
    formBlock?.classList?.add('has-content', 'grid-7-5', 'old-style');
    section.prepend(formBlock);
    main.prepend(section);
  }
}

function buildSuccessDownload(main, category) {
  const resourceImgUrl = new URL(getMetadata('og:image'));
  const resourceImgPath = resourceImgUrl.href.replace(resourceImgUrl.origin, '');

  const resourceThumbImg = document.createElement('img');
  const resourceTitle = getMetadata('og:title').split(' | ')[0];
  const pdfPath = window.location.pathname.replace('/resources/','/resources/assets/');
  const pdfDownload = `${pdfPath}.pdf`;
  const columnData = [];

  resourceThumbImg.classList.add('resource-image');
  resourceThumbImg.alt = resourceTitle;
  resourceThumbImg.src = resourceImgPath;
  
  if(category === 'videos') {
    const wistiaVideoId = getMetadata('wistia-video-id');
    const wistiaVideoUrl = `https://bamboohr.wistia.com/medias/${wistiaVideoId}`;
    if (wistiaVideoId) {
      columnData.push(`<p><a href="${wistiaVideoUrl}"></a></p>`);
      columnData.push(`<h1>Success! ${resourceTitle} is coming your way.</h1>`);
    }
  } else {
    columnData.push(resourceThumbImg);
    columnData.push(`<h1>Success! ${resourceTitle} is coming your way.</h1><p>Thank you for downloading ${resourceTitle}—we think you’re going to love it. It should start downloading automatically, but if it doesn’t, please <a href="${pdfDownload}" target="_blank" rel="noopener noreferrer" aria-label="Click here to download ${resourceTitle} - Opens in a new window">click here</a></p>`);
  }

  if (columnData.length > 0) {
    const section = document.createElement('div');
    const columns = buildBlock('columns', [columnData]);
    columns?.classList?.add('6-6', 'success-download');
    section.prepend(columns);
    main.prepend(section);
  }
}

function buildSuccessMoreTitle(main) {
  const title = 'Want even more from BambooHR?';

  const titleBlock = buildBlock('title', title);
  titleBlock?.classList.add('title1', 'color-gray-12');
  titleBlock?.querySelector('div').setAttribute('data-align', 'center');

  main.querySelector('.columns')?.after(titleBlock);
}

function buildSuccessMore(main) {
  const moreData = [];
  moreData.push(`<img src="/icons/rocketship.svg" alt="rocketship icon" /><h4>Performance Management</h4><p>Get real results with more frequent communication, meaningful feedback, and valuable insights.</p><p class="button-container"><a href="https://www.bamboohr.com/expansion/performance-management/" title="Learn more about Performance Management" class="button accent">Learn More</a></p>`);
  moreData.push(`<img src="/icons/calendar-clock.svg" alt="calendar clock icon" /><h4>Time Tracking</h4><p>Make time entry, timesheet management, and reporting a breeze for employees and managers alike.</p><p class="button-container"><a href="https://www.bamboohr.com/expansion/time-tracking-software/" title="Learn more about Time Tracking" class="button accent">Learn More</a></p>`);
  moreData.push(`<img src="/icons/advantage.svg" alt="advantage icon" /><h4>Upgrade to Advantage</h4><p>Unlock all the tools you need to tackle the strategic challenges of your growing organization.</p><p class="button-container"><a href="https://www.bamboohr.com/expansion/advantage/" title="Learn more about Upgrade to Advantage" class="button accent">Learn More</a></p>`);
  moreData.push(`<img src="/icons/money.svg" alt="money icon" /><h4>Payroll</h4><p>Pay your people accurately, save valuable time, and preserve your sanity all at once.</p><p class="button-container"><a href="https://www.bamboohr.com/expansion/payroll/" title="Learn more about Payroll" class="button accent">Learn More</a></p>`);

  if (moreData.length > 0) {
    const moreBlock = buildBlock('columns', [moreData]);
    moreBlock?.classList?.add('style-4-columns', 'want-more-columns');
    main.querySelector('.title')?.after(moreBlock);
  }
}

function downloadPdf() {
  const {origin} = window.location;
  const path = window.location.pathname.split('/')
  const fileName = path[path.length - 1];
  const pdfPath = window.location.pathname.replace('/resources/','/resources/assets/');
  const url = `${origin}${pdfPath}.pdf`;

  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.setAttribute('target', '_blank');
      link.click();
      link.remove();
      // in case the Blob uses a lot of memory
      setTimeout(() => URL.revokeObjectURL(link.href), 7000);
  });
}


export default async function decorateTemplate(main) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const formSubmit = urlParams.get('formSubmit');
    if (formSubmit && formSubmit === 'success') {
      main.innerHTML = '';
      document.body.classList.add('content-library-success');
      const category = getMetadata('category');
      buildSuccessDownload(main, category);
      buildSuccessMoreTitle(main);
      buildSuccessMore(main);
      if (category !== 'videos') {
        window.onload = downloadPdf();
      }
    } else {
      buildFormBlock(main);
    }
}
