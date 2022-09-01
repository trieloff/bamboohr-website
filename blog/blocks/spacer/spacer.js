function createSpacer(spacerVal, block) {
  const spacerDiv = document.createElement('div');
  spacerDiv.style.height = `${spacerVal}px`;
  block.append(spacerDiv);
  return spacerDiv;
}

export default function decorate(block) {
  // Remove 'spacer' and 'block' classes
  const options = [...block.classList].filter((c) => c !== 'spacer' && c !== 'block');

  // The rest should be: mobile-XX, tablet-XX, laptop-XX, or desktop-XX OR a single number.
  const values = {
    mobile: '', tablet: '', laptop: '', desktop: ''
  };
  let simpleVal = '';
  options.forEach((o) => {
    const val = o.split('-');
    if (val.length === 2) {
      [, values[val[0]]] = val;
    } else [simpleVal] = val;
  });

  if (simpleVal) {
    createSpacer(simpleVal, block);
  } else {
    const keys = Object.keys(values);

    // Count the input values. Remember last val in case there's only 1.
    const valueCnt = keys.reduce((cnt, key) => {
      simpleVal = values[key];
      return values[key] ? cnt + 1 : cnt;
    }, 0);

    if (valueCnt === 1) createSpacer(simpleVal, block);
    else {
      keys.forEach((key, i) => {
        // Create a spacer div for each size, fill in if any are absent.
        // valid sizes are: mobile, tablet, laptop, desktop.
        if (values[key]) {
          const spacerDiv = createSpacer(values[key], block);
          spacerDiv.classList.add(`${key}-spacer`);
        } else {
          // Fill in from next adjacent first, if not there fill in from previous adjacent.
          let nextKey = i + 1;
          while (nextKey < keys.length && !values[keys[nextKey]]) nextKey += 1;
          
          let fillInKey = -1;
          if (nextKey < keys.length) {
            fillInKey = nextKey;
          } else {
            let prevKey = i - 1;
            while (prevKey >= 0 && !values[keys[prevKey]]) prevKey -= 1;
            fillInKey = prevKey;
          }

          if (fillInKey >= 0) {
            const spacerDiv = createSpacer(values[keys[fillInKey]], block);
            spacerDiv.classList.add(`${key}-spacer`);
          }
        }
      });
    }
  }
}
