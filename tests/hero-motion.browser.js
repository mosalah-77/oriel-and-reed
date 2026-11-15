// Paste into the homepage's console, then call checkHeroMotion() before and after scrolling.
function checkHeroMotion() {
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const eligible = matchMedia('(min-width: 800px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches
    && CSS.supports('animation-timeline', 'scroll(root block)')
    && CSS.supports('animation-range', '0px 12rem');
  const frames = ['.hero-title', '.hero-image'].map((selector) => {
    const element = document.querySelector(selector);
    assert(element, `Missing ${selector}; run this on the homepage.`);
    const style = getComputedStyle(element);
    assert((style.animationName !== 'none') === eligible, `${selector}: motion eligibility is wrong.`);
    assert(style.opacity === '1' && style.visibility === 'visible', `${selector}: content is hidden.`);
    assert(style.transitionProperty !== 'all' || style.transitionDuration === '0s', `${selector}: avoid transition: all.`);
    if (!eligible) assert(style.transform === 'none', `${selector}: static fallback is transformed.`);
    return {
      selector,
      transform: style.transform,
      layoutWidth: element.offsetWidth,
      layoutHeight: element.offsetHeight,
      animation: style.animationName,
    };
  });
  assert(document.documentElement.scrollWidth <= innerWidth, 'The page overflows horizontally.');
  return { eligible, scrollY, frames };
}

// Run on Home, Projects or Services/About after scrolling a section into view.
function checkSectionMotion() {
  const eligible = matchMedia('(min-width: 800px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches
    && CSS.supports('animation-timeline', 'scroll(root block)')
    && CSS.supports('animation-range', '0px 12rem')
    && CSS.supports('animation-timeline', 'view()');
  return [...document.querySelectorAll('.studio-intro > div, .section-heading, .services-intro, .process-list > li, .consultation-invitation > *')].map(element => {
    const style = getComputedStyle(element);
    if ((style.animationName === 'section-arrive') !== eligible) throw new Error('Section motion eligibility is wrong.');
    if (style.opacity !== '1' || style.visibility !== 'visible') throw new Error('Section content must stay visible.');
    if (!eligible && style.transform !== 'none') throw new Error('Static section fallback is transformed.');
    return { text: element.textContent.trim().slice(0,55), eligible, transform: style.transform,
      width: element.offsetWidth, height: element.offsetHeight };
  });
}
