/* ==========================================================================
   FROXIMPORT - script.js
   ========================================================================== */

// Número de WhatsApp Business de Froximport.
// Formato: código de país + número, SIN "+" ni espacios.
const WHATSAPP_NUMBER = "51991657904";
const WHATSAPP_MENSAJE = "¡Hola, Frox Import! Estoy interesado/a en importar unos productos y quisiera más información sobre el servicio.";

// ⚠️ CONFIGURACIÓN DE WEB3FORMS (formulario "Cotiza tu Envío")
// Obtén tu API key gratis en https://web3forms.com
const WEB3FORMS_ACCESS_KEY = "be15bb0d-1ba7-4721-846d-ff43d3218ebe";

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- 2. MENÚ HAMBURGUESA (MÓVIL) ---------- */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('nav-open');
            hamburgerBtn.classList.toggle('active', isOpen);
            hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Cierra el menú al tocar cualquier link (mejora UX en móvil)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-open');
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---------- 3. BOTONES DE WHATSAPP (mensaje prellenado) ---------- */
    function actualizarLinksWhatsapp() {
        document.querySelectorAll('.wa-link').forEach(link => {
            link.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`);
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener');
        });
    }

    actualizarLinksWhatsapp();

    /* ---------- 4. CARRUSEL PRINCIPAL DEL HERO (fondo + titular, flechas + autoplay 7s) ---------- */
    const heroSlideEls = document.querySelectorAll('.hero-slide-bg');
    const heroDotEls = document.querySelectorAll('.hero-dot');
    const heroHeadline = document.getElementById('heroHeadline');
    const heroSubtext = document.getElementById('heroSubtext');
    const heroPrev = document.getElementById('heroPrev');
    const heroNext = document.getElementById('heroNext');

    const heroSlidesData = [
        {
            headline: 'Tu Casillero Internacional<br>Seguro en Lima',
            subtext: 'Te damos una dirección postal física en Miami. Consolidamos tus compras y las traemos a Lima sin sorpresas en la aduana.'
        },
        {
            headline: 'Consolidamos Compras<br>y Envíos',
            subtext: 'Compra en Miami o China cuando quieras. Consolidamos todo en un solo envío y pagas un único flete sin cargos extra.'
        },
        {
            headline: 'Del Almacén en Miami<br>a Tu Puerta en Lima',
            subtext: 'Seguimos tu carga en cada etapa del viaje. Te avisamos por WhatsApp, sin sistemas de rastreo confusos ni esperas eternas.'
        }
    ];

    if (heroSlideEls.length && heroHeadline && heroSubtext) {
        let heroIndex = 0;
        let heroAutoplayTimer = null;

        function renderHeroSlide(index) {
            heroIndex = (index + heroSlidesData.length) % heroSlidesData.length;

            // Fondo: crossfade entre capas
            heroSlideEls.forEach((el, i) => el.classList.toggle('active', i === heroIndex));

            // Puntos indicadores
            heroDotEls.forEach((dot, i) => dot.classList.toggle('active', i === heroIndex));

            // Texto: fade-out, cambio de contenido, fade-in
            heroHeadline.style.opacity = 0;
            heroSubtext.style.opacity = 0;
            setTimeout(() => {
                heroHeadline.innerHTML = heroSlidesData[heroIndex].headline;
                heroSubtext.textContent = heroSlidesData[heroIndex].subtext;
                heroHeadline.style.opacity = 1;
                heroSubtext.style.opacity = 1;
            }, 350);
        }

        function startHeroAutoplay() {
            clearInterval(heroAutoplayTimer);
            heroAutoplayTimer = setInterval(() => renderHeroSlide(heroIndex + 1), 7000);
        }

        if (heroNext) heroNext.addEventListener('click', () => { renderHeroSlide(heroIndex + 1); startHeroAutoplay(); });
        if (heroPrev) heroPrev.addEventListener('click', () => { renderHeroSlide(heroIndex - 1); startHeroAutoplay(); });
        heroDotEls.forEach((dot, i) => dot.addEventListener('click', () => { renderHeroSlide(i); startHeroAutoplay(); }));

        startHeroAutoplay();
    }

    /* ---------- 5. ANIMACIÓN REVEAL AL HACER SCROLL ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: si el navegador no soporta IntersectionObserver, muestra todo directo
        revealEls.forEach(el => el.classList.add('visible'));
    }

    /* ---------- 5B. CONTADOR ANIMADO DE STATS ---------- */
    const statNumbers = document.querySelectorAll('.stat-box .stat-number[data-target]');
    if (statNumbers.length && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target);
                    let current = 0;
                    const increment = Math.ceil(target / 60);
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = current.toLocaleString('es-PE') + '+';
                    }, 30);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(el => statsObserver.observe(el));
    }

    /* ---------- 6. FORMULARIO "COTIZA TU ENVÍO" (Web3Forms) ---------- */
    const quoteForm = document.getElementById('quoteForm');
    const quoteSubmitBtn = document.getElementById('quoteSubmitBtn');
    const quoteFormMsg = document.getElementById('quoteFormMsg');

    if (quoteForm) {
        quoteForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const nombre = document.getElementById('quoteNombre').value.trim();
            const correo = document.getElementById('quoteCorreo').value.trim();
            const telefono = document.getElementById('quoteTelefono').value.trim();

            if (!nombre || !correo || !telefono) return;

            quoteSubmitBtn.disabled = true;
            quoteSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            quoteFormMsg.style.display = 'none';

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        access_key: WEB3FORMS_ACCESS_KEY,
                        nombre: nombre,
                        correo: correo,
                        telefono: telefono,
                        subject: 'Nuevo cliente interesado en Frox Import',
                        from_name: 'Frox Import Web'
                    })
                });

                const result = await response.json();

                if (result.success) {
                    quoteFormMsg.textContent = '¡Listo! Te estamos redirigiendo a WhatsApp...';
                    quoteFormMsg.className = 'quote-form-msg success';
                    quoteFormMsg.style.display = 'block';
                    quoteForm.reset();

                    const waMsg = encodeURIComponent('Acabo de llenar mi cotización, deseo más información por favor');
                    setTimeout(() => {
                        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`, '_blank');
                    }, 1500);
                } else {
                    throw new Error('Error de Web3Forms');
                }
            } catch (err) {
                console.error('Web3Forms error:', err);
                quoteFormMsg.textContent = 'Algo salió mal. Escríbenos directo por WhatsApp y te ayudamos ahí mismo.';
                quoteFormMsg.className = 'quote-form-msg error';
                quoteFormMsg.style.display = 'block';
            } finally {
                quoteSubmitBtn.disabled = false;
                quoteSubmitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar y Recibir Requisitos';
            }
        });
    }

});
