document.addEventListener('DOMContentLoaded', () => {
  const CV = window.CV;
  if (!CV) {
    console.error("CV data not found!");
    return;
  }
  const htmlTag = document.documentElement;
  const langBtn = document.getElementById('lang-switch');
  
  let currentLang = 'ar';
  try {
    currentLang = localStorage.getItem('lang') || 'ar';
  } catch (e) {
    console.warn("localStorage not available");
  }

  let scrollObserver;
  function initScrollObserver() {
    if (scrollObserver) {
      scrollObserver.disconnect();
    }
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    scrollObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      scrollObserver.observe(el);
    });
  }

  function renderCV() {
    htmlTag.setAttribute('lang', currentLang);
    htmlTag.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

    // Title and Meta
    document.title = `${CV.personal.name[currentLang]} | ${CV.personal.title[currentLang]}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `Portfolio of ${CV.personal.name[currentLang]}, ${CV.personal.title[currentLang]}. ${CV.personal.summary[currentLang]}`);
    }

    // Update translations
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (CV.translations[currentLang][key]) {
        const text = CV.translations[currentLang][key];
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.setAttribute('placeholder', text);
          el.setAttribute('aria-label', text);
        } else if (el.tagName === 'OPTION') {
          el.textContent = text;
          if (el.selected && el.disabled) {
             el.parentElement.setAttribute('aria-label', text);
          }
        } else {
          el.textContent = text;
        }
      }
    });

    // Populate Hero
    const heroTitle = document.querySelector('.hero-badge span');
    if (heroTitle) heroTitle.textContent = CV.personal.title[currentLang];
    const heroName = document.querySelector('.text-gradient');
    if (heroName) heroName.textContent = CV.personal.name[currentLang];
    const heroDesc = document.querySelector('.hero-desc-dynamic');
    if (heroDesc) heroDesc.textContent = CV.personal.summary[currentLang];

    // Populate Dash stats
    const dashTitle = document.querySelector('.dash-header-title span');
    if (dashTitle) dashTitle.textContent = CV.dashboard.title[currentLang];
    
    const flightPoints = document.querySelectorAll('.flight-point');
    if (flightPoints.length === 2) {
      const fromPoint = flightPoints[0];
      if (fromPoint.querySelector('h3')) fromPoint.querySelector('h3').textContent = CV.dashboard.flights.from.code;
      if (fromPoint.querySelector('p')) fromPoint.querySelector('p').textContent = CV.dashboard.flights.from.name;
      
      const toPoint = flightPoints[1];
      if (toPoint.querySelector('h3')) toPoint.querySelector('h3').textContent = CV.dashboard.flights.to.code;
      if (toPoint.querySelector('p')) toPoint.querySelector('p').textContent = CV.dashboard.flights.to.name;
    }

    const dashStats = document.querySelector('.dash-stats');
    if (dashStats) {
      dashStats.innerHTML = '';
      CV.dashboard.stats.forEach(stat => {
        dashStats.innerHTML += `
          <div class="stat-item">
            <div class="stat-icon">${stat.icon}</div>
            <span>${stat.text[currentLang]}</span>
          </div>
        `;
      });
    }

    const heroVisual = document.querySelector('.hero-visual-container');
    if (heroVisual) {
      CV.dashboard.floating.forEach((float, i) => {
        const fe = heroVisual.querySelector(`.fe-${i + 1}`);
        if (fe) {
          fe.innerHTML = `${float.icon}<span>${float.text[currentLang]}</span>`;
        }
      });
    }

    // Populate About
    const aboutGrid = document.querySelector('.about-grid');
    if (aboutGrid) {
      aboutGrid.innerHTML = '';
      CV.about.forEach((item, index) => {
        const delay = index * 100;
        aboutGrid.innerHTML += `
          <div class="about-card animate-on-scroll ${delay > 0 ? 'delay-' + delay : ''}">
            <div class="about-icon">${item.icon}</div>
            <h3>${item.title[currentLang]}</h3>
            <p>${item.desc[currentLang]}</p>
          </div>
        `;
      });
    }

    // Populate Experience
    const expTimeline = document.querySelector('#experience .timeline');
    if (expTimeline) {
      expTimeline.innerHTML = '';
      CV.experience.forEach((exp, index) => {
        const descHtml = exp.desc.map(d => `<li>${d[currentLang]}</li>`).join('');
        expTimeline.innerHTML += `
          <div class="timeline-item animate-on-scroll">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <span class="timeline-date">${exp.date[currentLang]}</span>
              <h3 class="timeline-title">${exp.title[currentLang]}</h3>
              <span class="timeline-company">${exp.company[currentLang]}</span>
              <ul class="timeline-desc">${descHtml}</ul>
            </div>
          </div>
        `;
      });
    }

    // Populate Education
    const eduTimeline = document.querySelector('#education .timeline');
    if (eduTimeline) {
      eduTimeline.innerHTML = '';
      CV.education.forEach((edu, index) => {
        const descHtml = edu.desc.map(d => `<li>${d[currentLang]}</li>`).join('');
        eduTimeline.innerHTML += `
          <div class="timeline-item animate-on-scroll">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <span class="timeline-date">${edu.date[currentLang]}</span>
              <h3 class="timeline-title">${edu.title[currentLang]}</h3>
              <span class="timeline-company">${edu.company[currentLang]}</span>
              <ul class="timeline-desc">${descHtml}</ul>
            </div>
          </div>
        `;
      });
    }

    // Populate Skills
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
      skillsGrid.innerHTML = '';
      CV.skills.forEach((skill, index) => {
        const delay = (index % 3) * 100;
        skillsGrid.innerHTML += `
          <div class="skill-card animate-on-scroll ${delay > 0 ? 'delay-' + delay : ''}">
            <div class="skill-icon">${skill.icon}</div>
            <div class="skill-info">
              <h3>${skill.name[currentLang]}</h3>
              <p>${skill.desc[currentLang]}</p>
            </div>
          </div>
        `;
      });
    }

    // Populate Certificates
    const certGrid = document.querySelector('.cert-grid');
    if (certGrid) {
      certGrid.innerHTML = '';
      CV.certificates.forEach((cert, index) => {
        const delay = (index % 2) * 100;
        certGrid.innerHTML += `
          <div class="cert-card animate-on-scroll ${delay > 0 ? 'delay-' + delay : ''}">
            <div class="cert-icon">${cert.icon}</div>
            <h3>${cert.title[currentLang]}</h3>
            <p>${cert.date}</p>
          </div>
        `;
      });
    }

    // Update Contact Links
    document.querySelectorAll('a[href^="mailto:"]').forEach(el => el.href = `mailto:${CV.settings.email}`);
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(el => el.href = `https://wa.me/${CV.settings.whatsappNumber}`);
    
    const linkedinBtn = document.querySelector('a[aria-label="LinkedIn"]');
    if(linkedinBtn) linkedinBtn.href = CV.settings.linkedin;
    
    const cvBtn = document.querySelector('.hero-buttons a.btn-primary');
    if(cvBtn && CV.settings.cvLink) {
      cvBtn.href = CV.settings.cvLink;
      cvBtn.setAttribute('download', 'CV.pdf');
      cvBtn.setAttribute('target', '_blank');
    }

    // Update footer name
    const footerText = document.querySelector('.footer-bottom p');
    if (footerText) {
      footerText.innerHTML = `&copy; <span id="year">${new Date().getFullYear()}</span> ${CV.personal.name[currentLang]}. <span data-i18n="footer_rights">${CV.translations[currentLang]['footer_rights']}</span>`;
    }

    // Re-initialize observer for dynamically added elements
    initScrollObserver();
  }

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      currentLang = currentLang === 'ar' ? 'en' : 'ar';
      try {
        localStorage.setItem('lang', currentLang);
      } catch (e) {
        console.warn("localStorage set failed");
      }
      renderCV();
    });
  }

  // Initial render
  renderCV();

  // Sticky Navigation & Scroll Spy
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
    
    // Scroll progress
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = `${scrollPx / winHeightPx * 100}%`;
      scrollProgress.style.width = scrolled;
    }
  });

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      try {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      } catch (err) {
        // Ignore invalid selectors
      }
    });
  });

  // Contact Form WhatsApp Logic
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;

      let text = `Hello, my name is ${name}.%0A`;
      if(currentLang === 'ar') {
         text = `مرحباً، اسمي ${name}.%0A`;
      }
      text += `Phone: ${phone}%0AEmail: ${email}%0ASubject: ${subject}%0AMessage: ${message}`;
      
      const whatsappUrl = `https://wa.me/${CV.settings.whatsappNumber}?text=${text}`;
      window.open(whatsappUrl, '_blank');
    });
  }
  
  // Back to top button
  const bttBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (bttBtn) {
      if(window.scrollY > 500) {
        bttBtn.classList.add('visible');
      } else {
        bttBtn.classList.remove('visible');
      }
    }
  });
  
  if (bttBtn) {
    bttBtn.addEventListener('click', () => {
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  }

  // Mouse Parallax for Hero Elements
  const heroVisual = document.querySelector('.hero-visual-container');
  if(heroVisual) {
    document.addEventListener('mousemove', (e) => {
      const x = (window.innerWidth - e.pageX * 2) / 100;
      const y = (window.innerHeight - e.pageY * 2) / 100;
      heroVisual.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
});
