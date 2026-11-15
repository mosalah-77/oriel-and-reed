// Run after filtering or changing focus in the viewer: checkProjectGallery().
function checkProjectGallery() {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const filters = [...document.querySelectorAll('.project-filters button')];
  const selected = filters.filter(button => button.getAttribute('aria-pressed') === 'true');
  const cards = [...document.querySelectorAll('.project-card')];
  if (filters.length) {
    assert(selected.length === 1, 'Exactly one room filter should be selected.');
    const room = selected[0].textContent;
    if (room !== 'All rooms') {
      assert(cards.every(card => card.querySelector('.eyebrow').textContent.endsWith(room)), 'A different room is visible.');
    }
    assert(document.querySelector('.project-count').textContent.startsWith(`${cards.length} `), 'The result count is wrong.');
  }
  const viewer = document.querySelector('.image-viewer');
  if (viewer?.open) {
    assert(viewer.matches(':modal'), 'The image viewer must be modal.');
    assert(viewer.contains(document.activeElement), 'Focus escaped the image viewer.');
    assert(document.body.style.overflow === 'hidden', 'The background should not scroll.');
    assert(viewer.scrollWidth <= viewer.clientWidth, 'The viewer overflows horizontally.');
  }
  assert(document.documentElement.scrollWidth <= innerWidth, 'The page overflows horizontally.');
  return { room: selected[0]?.textContent, cards: cards.length, viewerOpen: Boolean(viewer?.open), focus: document.activeElement?.textContent };
}
