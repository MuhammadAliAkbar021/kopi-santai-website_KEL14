// Centralized small scripts for the site
(function(){
  // Set the footer year for any page that uses <span id="year"></span>
  try{
    const el = document.getElementById('year');
    if(el) el.textContent = new Date().getFullYear();
  }catch(e){
    // silent fail - non-critical
    console.error('scripts.js error:', e);
  }
})();

/* Interactions for about.html: read-more, accordion, gallery lightbox, scroll-to-top */
(function(){
  // Read more toggle
  try{
    const btn = document.querySelector('.read-more');
    const more = document.querySelector('.more');
    if(btn && more){
      btn.addEventListener('click', function(){
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        if(expanded){
          more.setAttribute('aria-hidden','true');
        } else {
          more.setAttribute('aria-hidden','false');
        }
        btn.textContent = expanded ? 'Baca Selengkapnya' : 'Tutup';
        // smooth scroll to keep context
        if(!expanded){ btn.scrollIntoView({behavior:'smooth', block:'center'}); }
      });
    }
  }catch(e){ console.error(e); }

  // Accordion for values
  try{
    document.querySelectorAll('.value-toggle').forEach(function(toggle){
      toggle.addEventListener('click', function(){
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        const desc = toggle.nextElementSibling;
        if(desc){
          if(expanded){ desc.hidden = true; } else { desc.hidden = false; }
        }
      });
    });
  }catch(e){ console.error(e); }

  // Lightbox gallery
  try{
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox && lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox && lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox && lightbox.querySelector('.lightbox-close');

    function openLightbox(src, caption){
      if(!lightbox) return;
      if(lightboxImage) lightboxImage.src = src;
      if(lightboxCaption) lightboxCaption.textContent = caption || '';
      lightbox.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox(){
      if(!lightbox) return;
      lightbox.setAttribute('aria-hidden','true');
      if(lightboxImage) lightboxImage.src = '';
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.gallery-grid .lightbox-item img').forEach(function(img){
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function(){
        const full = img.getAttribute('data-full') || img.src;
        const caption = img.alt || img.getAttribute('title') || '';
        openLightbox(full, caption);
      });
    });

    if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if(lightbox) lightbox.addEventListener('click', function(e){ if(e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeLightbox(); });
  }catch(e){ console.error(e); }

  // Scroll to top
  try{
    const st = document.getElementById('scrollTop');
    if(st){
      function toggleButton(){
        if(window.scrollY > 240) st.classList.add('show'); else st.classList.remove('show');
      }
      st.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}); });
      window.addEventListener('scroll', toggleButton);
      // init
      toggleButton();
    }
  }catch(e){ console.error(e); }

})();

/* Menu filter functionality: show/hide .card elements based on data-category */
(function(){
  try{
    const filterNav = document.querySelector('.filter');
    const cards = document.querySelectorAll('.menu-grid .card');
    if(!filterNav || !cards.length) return;

    filterNav.addEventListener('click', function(e){
      const btn = e.target.closest('[data-filter]');
      if(!btn) return;
      const filter = btn.getAttribute('data-filter');
      // toggle active class on buttons
      filterNav.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));

      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || 'all';
        if(filter === 'all' || filter === cat){
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }catch(e){ console.error('menu filter error', e); }
})();

// Image load fallback: if an <img> fails to load, replace with a stable Unsplash photo
(function(){
  try{
    const fallbackMap = {
      // keywords we might match from alt or filename -> fallback image
      default: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80',
      'interior': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      'barista': 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=80',
      'exterior': 'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1200&q=80',
      'communal': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80',
      'coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      'cup': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      'night': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80'
    };

    document.querySelectorAll('img').forEach(img => {
      // add lazy loading when missing
      if(!img.hasAttribute('loading')) img.setAttribute('loading','lazy');

      img.addEventListener('error', function onErr(){
        // prevent infinite loop
        if(img.dataset._fallbackApplied) return;
        img.dataset._fallbackApplied = '1';

        const alt = (img.alt || '').toLowerCase();
        let chosen = fallbackMap.default;
        for(const key in fallbackMap){
          if(key === 'default') continue;
          if(alt.includes(key) || (img.src || '').toLowerCase().includes(key)){
            chosen = fallbackMap[key];
            break;
          }
        }
        console.warn('Image failed to load, applying fallback:', img.src, '->', chosen);
        img.src = chosen;
      });
    });
  }catch(e){ console.error('image fallback error', e); }
})();