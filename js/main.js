// ===== Power Fitness Gym — Interactive JavaScript v2.0 =====

// 1. Header Sticky Scroll Effect
const siteHeader = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (siteHeader) {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }
});

// 2. Mobile Menu Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    // Prevent body scroll when menu is open
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu when tapping outside on mobile
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
      navToggle.focus();
    }
  });

  // Swipe-left to close mobile menu
  let touchStartX = 0;
  navLinks.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  navLinks.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (diff < -60) { // swipe right → close (since panel is on right)
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  }, { passive: true });
}

// 3. Active Nav Link on Scroll
const trackedSections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  trackedSections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
    if (link) {
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
});

// 4. Back to Top Button
const backToTopBtn = document.getElementById('backToTop') || document.querySelector('.back-to-top') || document.querySelector('.fab-top');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 5. Stat Counter Animation
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-count'));
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 1800;
    const isDecimal = String(target).includes('.');
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
      }
    };
    updateCounter();
  });
}

// Trigger counter animation when hero is visible
const heroSection = document.querySelector('.hero');
if (heroSection) {
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  heroObserver.observe(heroSection);
}

// 6. Contact Form Handling & WhatsApp Redirect
const contactForm = document.querySelector('.contact-form');
const formNotification = document.querySelector('.form-notification');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    const name = contactForm.querySelector('#name').value.trim();
    const phone = contactForm.querySelector('#phone').value.trim();
    const interest = contactForm.querySelector('#interest').value;
    const message = contactForm.querySelector('#message').value.trim();

    submitBtn.innerHTML = 'Connecting to WhatsApp...';
    submitBtn.disabled = true;

    // Create WhatsApp text message
    let waText = `Hi Power Fitness Gym! My name is ${name}. Mobile: ${phone}.`;
    if (interest) {
      waText += ` I am interested in: ${interest}.`;
    }
    if (message) {
      waText += ` Questions: ${message}`;
    }

    const waUrl = `https://wa.me/919440687315?text=${encodeURIComponent(waText)}`;

    if (formNotification) {
      formNotification.className = 'form-notification success';
      formNotification.innerHTML = '✓ Redirecting to WhatsApp chat with Gym Desk...';
    }

    setTimeout(() => {
      window.open(waUrl, '_blank');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      contactForm.reset();
    }, 800);
  });
}

// 7. Scroll-reveal fade-in animation for section cards
const fadeElements = document.querySelectorAll(
  '.offer-card, .branch-card, .service-card, .gallery-card, .testimonial-card, .feature-box, .contact-item-row'
);

if ('IntersectionObserver' in window && fadeElements.length) {
  fadeElements.forEach(el => el.classList.add('fade-in'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeElements.forEach(el => revealObserver.observe(el));
}

// 8. Dynamic hero padding on resize (accounts for variable header height)
function adjustHeroPadding() {
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  if (header && hero) {
    const headerH = header.offsetHeight;
    hero.style.paddingTop = (headerH + 24) + 'px';
  }
}

adjustHeroPadding();
window.addEventListener('resize', adjustHeroPadding);
