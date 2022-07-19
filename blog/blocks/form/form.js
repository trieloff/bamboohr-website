function createSelect(fd) {
  const select = document.createElement('select');
  select.id = fd.Field;
  if (fd.Mandatory === 'x') {
    select.setAttribute('required', '');
  }

  if (fd.Placeholder) {
    const ph = document.createElement('option');
    ph.textContent = fd.Placeholder;
    ph.setAttribute('selected', '');
    ph.setAttribute('disabled', '');
    ph.value = '';
    select.append(ph);
  }
  fd.Options.split(',').forEach((o) => {
    const option = document.createElement('option');
    option.textContent = o.trim();
    option.value = o.trim();
    select.append(option);
  });
  return select;
}

function getURLParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

function createRadios(fd) {
  const options = document.createElement('div');
  options.classList.add('form-radio-options');
  fd.Options.split(',').forEach((o) => {
    const option = document.createElement('div');
    option.classList.add('form-radio-option');
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = fd.Field;
    // set radio data to url params if exists
    const param = getURLParam(o.trim().toLowerCase());
    if (param) {
      label.setAttribute('for', param.trim());
      label.textContent = param.trim();
      input.value = param.trim();
    } else {
      label.setAttribute('for', o.trim());
      label.textContent = o.trim();
      input.value = o.trim();
    }
    option.append(input, label);
    options.append(option);
  });
  return options;
}

async function addValidationError(el) {
  el.parentNode.classList.add('error');
}

function constructPayload(form) {
  const payload = {};
  [...form.elements].forEach((fe) => {
    if (fe.type === 'checkbox') {
      if (fe.checked) payload[fe.id] = fe.value;
    } else if (fe.id) {
      payload[fe.id] = fe.value;
    }
  });
  return payload;
}

async function submitForm(form) {
  let isError = false;
  const payload = {};
  [...form.elements].forEach((fe) => {
    if (fe.required && fe.value === '') {
      isError = true;
      addValidationError(fe);
    }
    if (fe.type === 'checkbox') {
      if (fe.checked) payload[fe.id] = fe.value;
    } else if (fe.id) {
      payload[fe.id] = fe.value;
    }
  });

  return isError ? false : payload;
}

function createButton(fd) {
  const button = document.createElement('a');
  button.classList.add('button');
  button.href = '';
  button.textContent = fd.Label;
  if (fd.Field === 'submit') {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      button.setAttribute('disabled', '');
      const payload = await submitForm(button.closest('form'));

      if (!payload) {
        button.removeAttribute('disabled');
        return;
      }

      const resp = await fetch(button.closest('form').dataset.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: payload }),
      });

      if (resp.ok) {
        window.location.href = fd.Extra;
      } else {
        // eslint-disable-next-line no-console
        console.error(`Error submitting form: ${resp.status}`, resp);
      }
    });
  }
  return button;
}

function createInput(fd) {
  const input = document.createElement('input');
  input.type = fd.Type;
  input.id = fd.Field;

  const param = getURLParam(input.id);
  if (param) {
    input.value = param;
  }

  input.setAttribute('placeholder', fd.Placeholder);

  if (fd.Mandatory === 'x') {
    input.setAttribute('required', '');
  }

  input.addEventListener('change', () => {
    const errorSpan = input.parentNode.querySelector('span.error');
    if (errorSpan) {
      input.parentNode.classList.remove('error');
      errorSpan.remove();
    }
  });

  return input;
}

function createTextarea(fd) {
  const textarea = document.createElement('textarea');
  textarea.id = fd.Field;
  textarea.setAttribute('placeholder', fd.Placeholder);

  if (fd.Mandatory === 'x') {
    textarea.setAttribute('required', '');
  }

  textarea.addEventListener('change', () => {
    const errorSpan = textarea.parentNode.querySelector('span.error');
    if (errorSpan) {
      textarea.parentNode.classList.remove('error');
      errorSpan.remove();
    }
  });

  return textarea;
}

function createLabel(fd) {
  const label = document.createElement('label');
  label.setAttribute('for', fd.Field);
  if (fd.Extra) {
    label.innerHTML = `<a href="${fd.Extra}">${fd.Label}</a>`;
  } else {
    label.textContent = fd.Label;
  }

  if (fd.Mandatory === 'x') {
    label.insertAdjacentHTML('beforeend', '<span class="required">*</span>');
  }
  return label;
}

function applyRules(form, rules) {
  const payload = constructPayload(form);
  rules.forEach((field) => {
    const { type, condition: { key, operator, value } } = field.rule;
    if (type === 'visible') {
      if (operator === 'eq') {
        if (payload[key] === value) {
          form.querySelector(`.${field.fieldId}`).classList.remove('hidden');
        } else {
          form.querySelector(`.${field.fieldId}`).classList.add('hidden');
        }
      }
    }
  });
}

async function createForm(formURL) {
  const { pathname } = new URL(formURL);
  const resp = await fetch(pathname);
  const json = await resp.json();
  const form = document.createElement('form');
  const rules = [];

  // eslint-disable-next-line prefer-destructuring
  form.dataset.action = pathname.split('.json')[0];
  json.data.forEach((fd) => {
    fd.Type = fd.Type || 'text';
    const fieldWrapper = document.createElement('div');
    const style = fd.Style ? ` form-${fd.Style}` : '';
    fieldWrapper.className = `form-${fd.Type}-wrapper${style}`;
    const fieldId = `form-${fd.Field}-wrapper${style}`;
    fieldWrapper.className = fieldId;
    switch (fd.Type) {
      case 'select':
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createSelect(fd));
        break;
      case 'button':
        fieldWrapper.append(createButton(fd));
        break;
      case 'checkbox':
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createInput(fd));
        break;
      case 'radio':
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createRadios(fd));
        break;
      case 'textarea':
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createTextarea(fd));
        break;
      default:
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createInput(fd));
    }
    form.append(fieldWrapper);

    if (fd.Rules) {
      try {
        rules.push({ fieldId, rule: JSON.parse(fd.Rules) });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`Invalid Rule ${fd.Rules}: ${e}`);
      }
    }
  });

  form.addEventListener('change', () => applyRules(form, rules));
  applyRules(form, rules);

  return (form);
}

export default async function decorate(block) {
  const formUrl = block.innerText.trim();

  if (formUrl) {
    const formEl = await createForm(formUrl);
    block.classList.add('form-container');
    block.firstElementChild.replaceWith(formEl);
  }
}
