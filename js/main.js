// ===== Header Scroll Effect =====
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

// ===== Mobile Menu Toggle =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  sections.forEach(section => {
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

// ===== Back to Top Button =====
const backToTopBtn = document.querySelector('.back-to-top-btn');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== Scroll Animations =====
const fadeElements = document.querySelectorAll('.fade-in');
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

fadeElements.forEach(el => observer.observe(el));

// ===== Counter Animation =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-count'));
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000;
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
  }, { threshold: 0.25 });

  heroObserver.observe(heroSection);
}

// ===== Contact Form Handling & WhatsApp Redirect =====
const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

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
      waText += ` Note: ${message}`;
    }

    const waUrl = `https://wa.me/919440687315?text=${encodeURIComponent(waText)}`;

    setTimeout(() => {
      if (formStatus) {
        formStatus.textContent = 'Opening WhatsApp with your enquiry details...';
        formStatus.className = 'form-status success';
      }
      window.open(waUrl, '_blank');
      contactForm.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2500);
    }, 600);
  });
}

// ===== Smooth Scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId && targetId !== '#') {
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});
