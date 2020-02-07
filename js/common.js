function syncElementStyles(destEls, srcEl, propertyNames) {
  if (typeof srcEl === 'string') srcEl = document.querySelector(srcEl);
  destEls.forEach(destEl => {
    if (typeof destEl === 'string') destEl = document.querySelector(destEl);
    syncElementStyle(destEl, srcEl, propertyNames)
  });
}

function syncElementStyle(destEl, srcEl, propertyNames) {
  if (typeof destEl === 'string') destEl = document.querySelector(destEl);
  let css = window.getComputedStyle(srcEl ,null);
  propertyNames.forEach(propertyName => {
    destEl.style[propertyName] = css.getPropertyValue(camelToKebabCase(propertyName));
  });
  return destEl;
}

function camelToKebabCase(camelCaseStr) {
  return camelCaseStr.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

function triggerEvent(el, eventName) {
  if (typeof el === 'string') el = document.querySelector(el);
  let event = document.createEvent('HTMLEvents');
  event.initEvent(eventName, true, false);
  el.dispatchEvent(event);
}