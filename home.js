(() => {
  const body = document.body;
  const button = document.getElementById('motionToggle');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = preference.matches;
  function updateMotion() {
    body.classList.toggle('motion-paused', paused);
    if (!button) return;
    button.setAttribute('aria-pressed', String(paused));
    button.querySelector('span').textContent = paused ? 'Activar movimiento' : 'Pausar movimiento';
    button.querySelector('i').className = paused ? 'fas fa-play' : 'fas fa-pause';
    button.disabled = preference.matches;
    if (preference.matches) button.querySelector('span').textContent = 'Movimiento reducido';
  }
  if (button) button.addEventListener('click', () => { paused = !paused; updateMotion(); });
  preference.addEventListener('change', () => { paused = preference.matches; updateMotion(); });
  document.addEventListener('visibilitychange', () => body.classList.toggle('page-hidden', document.hidden));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('offscreen', !entry.isIntersecting));
    });
    document.querySelectorAll('main > section').forEach(section => observer.observe(section));
  }
  updateMotion();

  // Keep native details semantics; animate only the opening/closing transition.
  document.querySelectorAll('.info-detail').forEach(detail => {
    const summary = detail.querySelector('summary');
    let animation;
    let expanded = detail.open;
    summary.addEventListener('click', event => {
      if (preference.matches || paused || !detail.animate) return;
      event.preventDefault();
      const startHeight = detail.getBoundingClientRect().height;
      if (animation) animation.cancel();
      expanded = !expanded;
      detail.open = true;
      const endHeight = expanded ? detail.getBoundingClientRect().height : summary.getBoundingClientRect().height + 2;
      detail.style.overflow = 'hidden';
      animation = detail.animate({ height: [startHeight + 'px', endHeight + 'px'] }, {
        duration: 300, easing: 'cubic-bezier(.16,1,.3,1)'
      });
      animation.onfinish = () => {
        detail.open = expanded;
        detail.style.overflow = '';
        animation = null;
      };
    });
    detail.addEventListener('toggle', () => { if (!animation) expanded = detail.open; });
  });

  // Bounded pointer depth on desktop; brief feedback on touch without blocking scrolling.
  document.querySelectorAll('.testimonial-card, .stat-box, .service-card, .store-card, .step-card').forEach(card => {
    let frame;
    let touchTimer;
    card.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || preference.matches || paused) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--tilt-x', ((.5 - (event.clientY - rect.top) / rect.height) * 4) + 'deg');
        card.style.setProperty('--tilt-y', (((event.clientX - rect.left) / rect.width - .5) * 4) + 'deg');
      });
    });
    const reset = () => {
      cancelAnimationFrame(frame);
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    };
    card.addEventListener('pointerleave', reset);
    card.addEventListener('pointercancel', () => { reset(); card.classList.remove('touch-feedback'); });
    card.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse') return;
      clearTimeout(touchTimer);
      card.classList.add('touch-feedback');
      touchTimer = setTimeout(() => card.classList.remove('touch-feedback'), 650);
    }, { passive: true });
  });

  const track = document.getElementById('reviewTrack');
  const cards = track ? [...track.querySelectorAll('.testimonial-card')] : [];
  const previous = document.getElementById('reviewPrev');
  const next = document.getElementById('reviewNext');
  const position = document.getElementById('reviewPosition');
  if (track) track.closest('section').classList.add('reviews-ready');
  const reviewControls = document.querySelector('.review-controls');
  if (reviewControls) reviewControls.hidden = false;
  let scrollFrame;
  function updateReviews() {
    if (!track || cards.length < 2) return;
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    const stride = cards[1].offsetLeft - cards[0].offsetLeft;
    const index = Math.round(track.scrollLeft / stride);
    previous.disabled = track.scrollLeft < 3;
    next.disabled = track.scrollLeft >= max - 3;
    const first = Math.min(cards.length, index + 1);
    const last = Math.min(cards.length, first + Math.max(1, Math.floor((track.clientWidth + 24) / stride)) - 1);
    position.textContent = (first === last ? first : first + '–' + last) + ' / ' + cards.length;
  }
  function moveReview(direction) {
    if (!track || cards.length < 2) return;
    const stride = cards[1].offsetLeft - cards[0].offsetLeft;
    track.scrollBy({ left: direction * stride, behavior: preference.matches || paused ? 'instant' : 'smooth' });
  }
  if (previous) previous.addEventListener('click', () => moveReview(-1));
  if (next) next.addEventListener('click', () => moveReview(1));
  if (track) track.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(updateReviews);
  }, { passive: true });
  if (track && 'ResizeObserver' in window) new ResizeObserver(updateReviews).observe(track);
  updateReviews();

  document.querySelectorAll('header a, header button').forEach(control => {
    let timer;
    control.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse') return;
      clearTimeout(timer);
      control.classList.add('touch-feedback');
      timer = setTimeout(() => control.classList.remove('touch-feedback'), 450);
    }, { passive: true });
    control.addEventListener('pointercancel', () => control.classList.remove('touch-feedback'));
  });
  const menuButton = document.getElementById('hamburgerBtn');
  const menu = document.getElementById('navLinks');
  if (menuButton && menu) menuButton.setAttribute('aria-controls', 'navLinks');
  document.addEventListener('keydown', event => {
    if (!menuButton || !menu || event.key !== 'Escape' || !menu.classList.contains('nav-open')) return;
    menu.classList.remove('nav-open');
    menuButton.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.focus();
  });

})();
