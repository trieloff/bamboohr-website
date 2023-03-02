/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

const createTitleBlock = (main, document) => {
  main.querySelectorAll('h1').forEach((heading) => {
    const cells = [['Title']];
    const titleContainer = document.createElement('div');
    const title = document.querySelector('h1');
    if (title) {
      const h = document.createElement('h1');
      h.innerHTML = title.innerHTML;
      titleContainer.append(h);
    }
    cells.push([titleContainer]);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    heading.replaceWith(table);
  });
}

const createSubtitleBlock = (main, document) => {
  main.querySelectorAll('.ProductBanner__subTitle').forEach((heading) => {
    const cells = [['Title']];
    const titleContainer = document.createElement('div');
    const title = document.querySelector('.ProductBanner__subTitle');
    if (title) {
      const h = document.createElement('h2');
      h.innerHTML = title.innerHTML;
      titleContainer.append(h);
    }
    cells.push([titleContainer]);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    heading.replaceWith(table);
  });
}

const createQuoteBlock = (main, document) => {
  main.querySelectorAll('.ProductCustomerContainer').forEach((quote) => {
    const cells = [['Quote']];
    const container = document.createElement('div');

    const quoteText = document.querySelector('.ProductCustomer__quote');
    if (quoteText) {
      const q = document.createElement('p');
      q.innerHTML = quoteText.innerHTML;
      container.append(q);
    }

    const quoteInfo = document.querySelector('.ProductCustomer__name');
    if (quoteInfo) {
      const i = document.createElement('p');
      i.innerHTML = quoteInfo.innerHTML;
      container.append(i);
    }

    cells.push([container]);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    quote.replaceWith(table);
  });
}

const createCalloutBlock = (main, document) => {
  main.querySelectorAll('.HrGlossaryTerm__contentCta').forEach((callout) => {
    const cells = [['Callout']];

    const container = document.createElement('div');

    const firstText = callout.querySelector('.HrGlossaryTerm__contentCtaTitle');
    if (firstText) {
      const h = document.createElement('h3');
      h.innerHTML = firstText.textContent;
      container.append(h);
    }

    const sub = callout.querySelector('.HrGlossaryTerm__contentCtaSubheading');
    if (sub) {
      const p = document.createElement('p');
      p.innerHTML = sub.innerHTML.replace(/[\r\n\t]/gm, '');
      container.append(p);
    }

    cells.push([container]);

    const cta = callout.querySelector('.HrGlossaryTerm__contentCtaBtn');
    if (cta) {
      cells.push([cta]);
    }
    const table = WebImporter.DOMUtils.createTable(cells, document);
    callout.replaceWith(table);
  });
};

const fixGeneralContent = (main) => {
  // const pageContent = main.querySelector('.Product');
  // pageContent.innerHTML = pageContent.innerHTML.replaceAll(' href="/', ' href="https://www.bamboohr.com/');

  const buttons = main.querySelectorAll('.ProductFeatureBlock__button');
	buttons.forEach(button => {
    button.innerHTML = button.innerHTML.replaceAll(' href="/', ' href="https://www.bamboohr.com/');
  });
};

const createProductFeatureBlock = (main, document) => {
	main.querySelectorAll('.ProductFeatureBlock').forEach((container) => {
		const cells = [
			['Columns'],
			[['col1'],['col2']]
		];
		console.log(cells);
		// const cellsBelow = [];

		container.querySelectorAll('.ProductFeatureBlock__copy').forEach((copyBlock) => {
      const wrapper = document.createElement('div');

      // const image = copyBlock.querySelector('.ProductMoreRowBlock__image');
      // if (image) {
      //   wrapper.append(image);
      // }

      const heading = copyBlock.querySelector('h2');
      if (heading) {
        const h = document.createElement('h2');
        h.innerHTML = heading.innerHTML.replace(/[\r\n\t]/gm, '');
        wrapper.append(h);
      }

      const description = copyBlock.querySelector('p');
      if (description) {
        const p = document.createElement('p');
        p.innerHTML = description.innerHTML.replace(/[\r\n\t]/gm, '');
        wrapper.append(p);
      }

      const button = copyBlock.querySelector('a');
      if (button) {
        wrapper.append(button);
      }

      // cells[1][0].push([wrapper.innerHTML]);
      cells.push([wrapper]);
    });

    const table = WebImporter.DOMUtils.createTable(cells, document);
    container.replaceWith(table);
	});
};

const createReferenceBlock = (main, document) => {
  main.querySelectorAll('.ProductMoreRow').forEach((container) => {

    const cells = [['Cards (image top, 3 columns)']];

    container.querySelectorAll('.ProductMoreRowBlock').forEach((reference) => {
      const wrapper = document.createElement('div');

      const image = reference.querySelector('.ProductMoreRowBlock__image');
      if (image) {
        wrapper.append(image);
      }

      const description = reference.querySelector('.ProductMoreRowBlock__copy');
      if (description) {
        const p = document.createElement('p');
        p.innerHTML = description.innerHTML.replace(/[\r\n\t]/gm, '');
        wrapper.append(p);
      }

      const button = reference.querySelector('a');
      if (button) {
        wrapper.append(button);
      }

      cells.push([wrapper]);
    });

    const table = WebImporter.DOMUtils.createTable(cells, document);
    container.replaceWith(table);
  });

};


const createMetadata = (main, document) => {
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.innerHTML.replace(/[\n\t]/gm, '');
  }

  const description = document.querySelector('[property="og:description"]');
  if (description) {
    meta.Description = description.content.replace(/[\r\n\t]/gm, '');
  }

  const img = document.querySelector('[property="og:image"]');
  if (img) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  const term = document.querySelector('h1');
  if (term) {
    meta.Term = term.innerHTML.replace(/[\n\t]/gm, '');
  }

  meta.Template = 'HR Software';
  meta.Theme = 'green';

  meta.Category = '';

  meta.Robots = '';

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(document.body, [
      'header',
      'footer',
      '.NavbarMobile',
      '.acc-out-of-view',
      '.Footer',
    ]);
    const main = document.querySelector('.Product');
    // createCalloutBlock(main, document);
    createTitleBlock(main, document);
    createSubtitleBlock(main, document);
    createQuoteBlock(main, document);
    createReferenceBlock(main, document);
		// createProductFeatureBlock(main, document);
    createMetadata(main, document);
    // fixGeneralContent(main);
    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, ''),
};
