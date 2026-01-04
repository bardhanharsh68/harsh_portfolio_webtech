/*
  script.js
  External JavaScript for Harsh Vardhan portfolio
  - Smooth scroll, sticky nav active link, scroll reveal
  - Form validation, resume download, button ripple, scroll-to-top
  - Beginner-friendly comments included
*/

// Helper: smooth scroll to an element by ID
function smoothTo(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior: 'smooth', block: 'start'});
}

// NAV: wire up navigation links for smooth scroll and active class
document.addEventListener('DOMContentLoaded', function(){
  const navLinks = document.querySelectorAll('a.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e){
      e.preventDefault();
      const target = this.getAttribute('href').slice(1);
      smoothTo(target);
      // close mobile nav if used (simple toggle)
      document.querySelector('nav')?.classList.remove('open');
    });
  });

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  toggle?.addEventListener('click', function(){
    const nav = document.querySelector('nav');
    if(nav) nav.classList.toggle('open');
  });

  // Active nav link highlight on scroll
  const sections = document.querySelectorAll('main, section, #hero');
  function highlightNav(){
    let fromTop = window.scrollY + 120; // offset for sticky nav
    navLinks.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if(section && section.offsetTop <= fromTop && (section.offsetTop + section.offsetHeight) > fromTop){
        link.classList.add('active');
      } else { link.classList.remove('active'); }
    });
  }
  window.addEventListener('scroll', highlightNav);
  highlightNav();

  // Scroll reveal: add .visible to elements with .reveal when they enter viewport
  const reveals = document.querySelectorAll('.reveal, .card, .proj-card, .skill, .timeline-item');
  function revealOnScroll(){
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight - 60){ el.classList.add('visible'); }
    });
  }
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('load', revealOnScroll);

  // Staggered reveal using IntersectionObserver for projects and skills
  const projCards = document.querySelectorAll('.proj-card');
  projCards.forEach((card,i)=> card.dataset.index = i);
  const skillCards = document.querySelectorAll('.skill');
  skillCards.forEach((s,i)=> s.dataset.index = i);

  const observerOpts = {threshold: 0.2};
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const idx = parseInt(el.dataset.index || 0, 10);
        // stagger by index for a nicer sequence
        setTimeout(()=> el.classList.add('visible'), idx * 120);
        obs.unobserve(el);
      }
    });
  }, observerOpts);
  projCards.forEach(c=>observer.observe(c));
  skillCards.forEach(s=>observer.observe(s));

  // animate title and glass visual on load with small delays
  const title = document.querySelector('.animate-title');
  const glass = document.querySelector('.glass-card');
  setTimeout(()=>{ if(title) title.classList.add('visible','title-anim'); }, 120);
  setTimeout(()=>{ if(glass) glass.classList.add('visible'); }, 300);

  // Animate progress bars when visible
  const progresses = document.querySelectorAll('.progress');
  function animateProgress(){
    progresses.forEach(p => {
      const rect = p.getBoundingClientRect();
      if(rect.top < window.innerHeight - 60){
        const percent = p.getAttribute('data-percent') || '60';
        const fill = p.querySelector('.fill');
        if(fill) fill.style.width = percent + '%';
      }
    });
  }
  window.addEventListener('scroll', animateProgress);
  window.addEventListener('load', animateProgress);

  // Resume download: create a simple text resume file and prompt download
  const resumeBtn = document.getElementById('downloadResume');
 resumeBtn?.addEventListener('click', function () {
  const a = document.createElement('a');
  a.href = 'resume_harsh.pdf';   // path to your PDF file
  a.download = 'resume_harsh.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
});

  // Form validation (no backend) — show inline messages and success banner
  const form = document.getElementById('contactForm');
  const errName = document.getElementById('err-name');
  const errEmail = document.getElementById('err-email');
  const errMessage = document.getElementById('err-message');
  const successBox = document.getElementById('contactSuccess');

  function clearErrors(){
    [errName, errEmail, errMessage].forEach(el=>{ if(el){ el.style.display='none'; el.textContent=''; } });
    if(successBox) successBox.style.display = 'none';
  }

  form?.addEventListener('submit', function(e){
    e.preventDefault();
    clearErrors();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    let valid = true;
    if(!name){ errName.style.display='block'; errName.textContent='Please enter your name.'; valid=false; }
    if(!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ errEmail.style.display='block'; errEmail.textContent='Please enter a valid email address.'; valid=false; }
    if(!message){ errMessage.style.display='block'; errMessage.textContent='Please write a short message.'; valid=false; }
    if(!valid) return;

    // Show inline success message instead of alert
    if(successBox){
      successBox.textContent = `Thanks ${name}! Your message has been received. (Demo)`;
      successBox.style.display = 'block';
      // hide after a few seconds
      setTimeout(()=>{ successBox.style.display='none'; }, 5000);
    }
    form.reset();
  });
  // Clear form button
  document.getElementById('clearForm')?.addEventListener('click', function(){ form.reset(); clearErrors(); });

  // Scroll-to-top button
  const scrollTop = document.getElementById('scrollTop');
  function toggleTop(){ if(window.scrollY > 300) scrollTop.style.display = 'block'; else scrollTop.style.display = 'none'; }
  window.addEventListener('scroll', toggleTop); toggleTop();
  scrollTop?.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}); });

  // Simple button ripple effect
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.style.position = 'absolute';
      circle.style.borderRadius = '50%';
      circle.style.background = 'rgba(255,255,255,0.35)';
      circle.style.transform = 'scale(0)';
      circle.style.transition = 'transform 600ms, opacity 800ms';
      circle.style.pointerEvents = 'none';
      this.appendChild(circle);
      requestAnimationFrame(()=>{ circle.style.transform = 'scale(1)'; circle.style.opacity = '0'; });
      setTimeout(()=>{ circle.remove(); }, 900);
    });
  });

  // Small reveal for elements marked with .reveal
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('reveal'));
});

// End of script
