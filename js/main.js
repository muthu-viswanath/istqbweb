/**
 * ISTQB CTFL v4.0 Landing Page Interactive Engine
 * Designed for Greens Technologies
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initBatchCountdown();
  initCurriculumAccordion();
  initQuizSimulator();
  initReadinessCalculator();
  initStickyBar();
  initLeadForms();
  initTestimonialsScroller();
  initVideoPlayers();
});

/* -------------------------------------------------------------
 * 1. Navbar Scroll Effect
 * ----------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.custom-navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* -------------------------------------------------------------
 * 2. Next Upcoming Batch Countdown Timer
 * ----------------------------------------------------------- */
function initBatchCountdown() {
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');

  if (!daysEl) return;

  // Target date: Next Monday 9:00 AM
  const now = new Date();
  const nextBatch = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon
  const daysUntilMonday = (1 + 7 - dayOfWeek) % 7 || 7;
  nextBatch.setDate(now.getDate() + daysUntilMonday);
  nextBatch.setHours(9, 0, 0, 0);

  function updateTimer() {
    const currentTime = new Date().getTime();
    const distance = nextBatch.getTime() - currentTime;

    if (distance < 0) {
      daysEl.innerText = '00';
      hoursEl.innerText = '00';
      minsEl.innerText = '00';
      secsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = String(days).padStart(2, '0');
    hoursEl.innerText = String(hours).padStart(2, '0');
    minsEl.innerText = String(minutes).padStart(2, '0');
    secsEl.innerText = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* -------------------------------------------------------------
 * 3. Curriculum Chapter Accordion
 * ----------------------------------------------------------- */
function initCurriculumAccordion() {
  const cards = document.querySelectorAll('.curriculum-card');

  cards.forEach((card) => {
    const header = card.querySelector('.chapter-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = card.classList.contains('active');
      
      // Close other cards for sleek single-open feel
      cards.forEach((c) => c.classList.remove('active'));

      if (!isActive) {
        card.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------
 * 4. Interactive ISTQB CTFL Mini-Quiz Simulator
 * ----------------------------------------------------------- */
const quizQuestions = [
  {
    chapter: "Chapter 1: Fundamentals of Testing",
    level: "K1 (Remember)",
    question: "Which of the following statements correctly expresses one of the 7 universal principles of testing?",
    options: [
      "Exhaustive testing is achievable with modern test automation tools.",
      "Testing shows the presence of defects, not their absence.",
      "Defects are evenly distributed across all functional modules.",
      "Testing activities should always begin after coding is 100% complete."
    ],
    answer: 1,
    explanation: "Correct! ISTQB Principle #1 states that testing can show that defects are present, but cannot prove that there are no defects. Even with exhaustive runs, testing reduces the probability of undiscovered defects."
  },
  {
    chapter: "Chapter 2: SDLC & Test Levels",
    level: "K2 (Understand)",
    question: "In an Agile development framework, which statement best characterizes the testing mindset?",
    options: [
      "Testing is exclusively performed during a hardening sprint at the end of the project.",
      "Developers should never participate in any test activities.",
      "A 'Whole-Team Approach' is adopted where testing happens continuously throughout each iteration.",
      "Static testing is omitted to maintain high sprint velocity."
    ],
    answer: 2,
    explanation: "Correct! In modern Agile and DevOps, quality is the responsibility of the entire team (Whole-Team Approach). Testing starts at the beginning of the iteration alongside user story grooming."
  },
  {
    chapter: "Chapter 4: Test Analysis & Design",
    level: "K3 (Apply - BVA)",
    question: "A bank loan application system accepts applicant ages between 21 and 60 (inclusive). Applying standard 2-value Boundary Value Analysis (BVA), which set of test values should be selected?",
    options: [
      "20, 21, 60, 61",
      "21, 22, 59, 60",
      "18, 21, 60, 65",
      "20, 21, 35, 60"
    ],
    answer: 0,
    explanation: "Correct! In 2-value BVA, boundary values include the boundary point itself and its immediate outside adjacent neighbor. For the range [21, 60], the lower boundaries are 20 (invalid) & 21 (valid), and upper boundaries are 60 (valid) & 61 (invalid)."
  },
  {
    chapter: "Chapter 3: Static Testing",
    level: "K2 (Understand)",
    question: "Which of the following defects is most effectively and economically discovered using Static Testing rather than Dynamic Testing?",
    options: [
      "Memory leak during 24-hour load execution.",
      "Unreachable code or deviations from coding standards in the design/code.",
      "Third-party payment gateway HTTP 504 gateway timeout.",
      "Database connection pooling bottleneck under high concurrency."
    ],
    answer: 1,
    explanation: "Correct! Static testing (reviews, walkthroughs, inspections, and static analysis) finds defects in work products without executing code, such as unreachable code, missing requirements, and coding standard violations."
  },
  {
    chapter: "Chapter 5: Managing Test Activities",
    level: "K2 (Understand - Defect Management)",
    question: "A minor spelling mistake occurs on the company's publicly visible homepage logo banner. What is the most appropriate classification for Severity and Priority?",
    options: [
      "High Severity, Low Priority",
      "High Severity, High Priority",
      "Low Severity, High Priority",
      "Low Severity, Low Priority"
    ],
    answer: 2,
    explanation: "Correct! Severity measures technical system impact (the typo doesn't crash any functionality -> Low Severity). Priority measures business urgency (it impacts public brand reputation and executive visibility -> High Priority)."
  }
];

let currentQuizIndex = 0;
let userScore = 0;
let answeredQuestions = [];

function initQuizSimulator() {
  renderQuestion(currentQuizIndex);

  const nextBtn = document.getElementById('quiz-next-btn');
  const restartBtn = document.getElementById('quiz-restart-btn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentQuizIndex < quizQuestions.length - 1) {
        currentQuizIndex++;
        renderQuestion(currentQuizIndex);
      } else {
        showQuizResults();
      }
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      currentQuizIndex = 0;
      userScore = 0;
      answeredQuestions = [];
      document.getElementById('quiz-result-view').classList.add('d-none');
      document.getElementById('quiz-active-view').classList.remove('d-none');
      renderQuestion(0);
    });
  }
}

function renderQuestion(index) {
  const q = quizQuestions[index];
  const questionNumEl = document.getElementById('quiz-q-num');
  const chapterBadgeEl = document.getElementById('quiz-chapter-badge');
  const levelBadgeEl = document.getElementById('quiz-level-badge');
  const textEl = document.getElementById('quiz-question-text');
  const optionsContainer = document.getElementById('quiz-options-container');
  const feedbackBox = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('quiz-next-btn');
  const progressBar = document.getElementById('quiz-progress-bar');

  if (!textEl || !optionsContainer) return;

  questionNumEl.innerText = `Question ${index + 1} of ${quizQuestions.length}`;
  chapterBadgeEl.innerText = q.chapter;
  levelBadgeEl.innerText = q.level;
  textEl.innerText = q.question;

  // Update progress bar
  const progressPercent = ((index) / quizQuestions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;

  // Reset feedback
  feedbackBox.style.display = 'none';
  feedbackBox.className = 'quiz-feedback-box';
  feedbackBox.innerHTML = '';
  nextBtn.disabled = true;
  nextBtn.innerText = index === quizQuestions.length - 1 ? 'See Final Score' : 'Next Question';

  // Render options
  optionsContainer.innerHTML = '';
  q.options.forEach((opt, optIdx) => {
    const btn = document.createElement('div');
    btn.className = 'quiz-option';
    btn.innerHTML = `<span class="fw-bold me-2">${String.fromCharCode(65 + optIdx)}.</span> ${opt}`;

    btn.addEventListener('click', () => {
      // If already answered this question, don't re-answer
      if (feedbackBox.style.display === 'block') return;

      const isCorrect = optIdx === q.answer;
      if (isCorrect) {
        userScore++;
        btn.classList.add('correct');
        feedbackBox.className = 'quiz-feedback-box bg-success-subtle border border-success text-success-emphasis';
        feedbackBox.innerHTML = `<strong><i class="bi bi-check-circle-fill me-1"></i> Correct!</strong> ${q.explanation}`;
      } else {
        btn.classList.add('wrong');
        // highlight correct answer
        const allOpts = optionsContainer.querySelectorAll('.quiz-option');
        if (allOpts[q.answer]) allOpts[q.answer].classList.add('correct');
        feedbackBox.className = 'quiz-feedback-box bg-danger-subtle border border-danger text-danger-emphasis';
        feedbackBox.innerHTML = `<strong><i class="bi bi-x-circle-fill me-1"></i> Incorrect.</strong> ${q.explanation}`;
      }

      feedbackBox.style.display = 'block';
      nextBtn.disabled = false;
      progressBar.style.width = `${((index + 1) / quizQuestions.length) * 100}%`;
    });

    optionsContainer.appendChild(btn);
  });
}

function showQuizResults() {
  document.getElementById('quiz-active-view').classList.add('d-none');
  const resultView = document.getElementById('quiz-result-view');
  resultView.classList.remove('d-none');

  const finalScoreEl = document.getElementById('quiz-final-score');
  const finalMsgEl = document.getElementById('quiz-final-message');
  const scorePercent = (userScore / quizQuestions.length) * 100;

  finalScoreEl.innerText = `${userScore} / ${quizQuestions.length} (${scorePercent}%)`;

  if (scorePercent >= 65) {
    finalMsgEl.innerHTML = `
      <div class="alert alert-success border-success text-start mb-4">
        <h5 class="fw-bold mb-1"><i class="bi bi-trophy-fill text-warning me-2"></i> Congratulations! You cleared the CTFL Passing Benchmark!</h5>
        <p class="mb-0 small">The official ISTQB pass mark is 65% (26/40). With Greens Technologies' comprehensive 40-hour mentorship, you're on track for a 95%+ first-attempt score!</p>
      </div>
    `;
    triggerConfetti();
  } else {
    finalMsgEl.innerHTML = `
      <div class="alert alert-warning border-warning text-start mb-4">
        <h5 class="fw-bold mb-1"><i class="bi bi-lightbulb-fill text-warning me-2"></i> Great start! That's why this 40-hour course exists.</h5>
        <p class="mb-0 small">ISTQB scenario questions can be tricky without systematic training in Boundary Value Analysis, Decision Tables, and syllabus traps. Our structured 40-hour coaching will take you to guaranteed mastery!</p>
      </div>
    `;
  }
}

/* -------------------------------------------------------------
 * 5. Fresher Readiness & Career Calculator
 * ----------------------------------------------------------- */
function initReadinessCalculator() {
  const manualKnowledge = document.getElementById('calc-knowledge');
  const studyHours = document.getElementById('calc-hours');
  const hoursDisplay = document.getElementById('calc-hours-val');
  const passProbEl = document.getElementById('calc-probability');
  const salaryEstEl = document.getElementById('calc-salary-range');
  const trackRecEl = document.getElementById('calc-track-rec');

  if (!manualKnowledge || !studyHours) return;

  function recalculate() {
    const hours = parseInt(studyHours.value, 10);
    hoursDisplay.innerText = `${hours} hrs/week`;

    const knowledgeVal = manualKnowledge.value; // 'none', 'basic', 'strong'
    let baseScore = 78; // Minimum baseline for freshers
    let salaryMin = 4.2;
    let salaryMax = 6.5;
    let track = "4-Week Fast Track (Weekday)";

    if (knowledgeVal === 'basic') {
      baseScore += 8;
      salaryMin += 0.6;
      salaryMax += 0.8;
    } else if (knowledgeVal === 'strong') {
      baseScore += 14;
      salaryMin += 1.2;
      salaryMax += 1.5;
    }

    if (hours >= 15) {
      baseScore += 6;
    } else if (hours < 8) {
      baseScore -= 3;
      track = "6-Week Weekend Intensive (Self-Paced Practice)";
    }

    // Minimum strictly 75% score as per requirement
    const finalScore = Math.min(99, Math.max(75, baseScore));
    passProbEl.innerText = `${finalScore}%`;
    salaryEstEl.innerText = `₹${salaryMin.toFixed(1)}L - ₹${salaryMax.toFixed(1)}L / yr`;
    trackRecEl.innerText = track;
  }

  manualKnowledge.addEventListener('change', recalculate);
  studyHours.addEventListener('input', recalculate);
  recalculate();
}

/* -------------------------------------------------------------
 * 6. Sticky Bottom Enroll Bar
 * ----------------------------------------------------------- */
function initStickyBar() {
  const bar = document.querySelector('.sticky-bottom-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    // Show after scrolling 500px down and hide near the very bottom footer
    const scrollPos = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollPos > 500 && scrollPos < documentHeight - 300) {
      bar.classList.add('show');
    } else {
      bar.classList.remove('show');
    }
  });
}

/* -------------------------------------------------------------
 * 7. Lead Forms, WhatsApp Forwarding & Automated PDF Download
 * ----------------------------------------------------------- */
function initLeadForms() {
  const WHATSAPP_NUMBER = '918939915577';
  const PDF_URL = 'assets/ISTQB-CTFL-Curriculum.pdf';
  const PDF_FILENAME = 'ISTQB-CTFL-Curriculum.pdf';

  // Handle pre-selecting batch when clicking batch buttons
  document.querySelectorAll('[data-batch]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const batchName = btn.getAttribute('data-batch');
      const modalBatch = document.getElementById('modal-batch');
      if (modalBatch && batchName) {
        for (let i = 0; i < modalBatch.options.length; i++) {
          if (modalBatch.options[i].value.toLowerCase().includes(batchName.toLowerCase()) || 
              modalBatch.options[i].text.toLowerCase().includes(batchName.toLowerCase())) {
            modalBatch.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  // 1. Main Page Form: fresherEnrollForm
  const fresherForm = document.getElementById('fresherEnrollForm');
  if (fresherForm) {
    fresherForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById('fresher-name')?.value || '',
        email: document.getElementById('fresher-email')?.value || '',
        phone: document.getElementById('fresher-phone')?.value || '',
        year: document.getElementById('fresher-year')?.value || '2025 Graduate',
        batch: document.getElementById('fresher-batch')?.value || 'Weekday Fast-Track (4 Wks)',
        knowledge: document.getElementById('fresher-knowledge')?.value || 'Basic Knowledge',
        formType: 'Full Course Enrollment & Brochure Request'
      };
      processLeadSubmission(fresherForm, data);
    });
  }

  // 2. Modal Form: modalEnrollForm
  const modalForm = document.getElementById('modalEnrollForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById('modal-name')?.value || '',
        email: document.getElementById('modal-email')?.value || '',
        phone: document.getElementById('modal-phone')?.value || '',
        year: document.getElementById('modal-year')?.value || 'Fresher',
        batch: document.getElementById('modal-batch')?.value || 'Weekday Fast-Track',
        knowledge: document.getElementById('modal-knowledge')?.value || 'Basic Knowledge (Added Advantage)',
        formType: 'Modal Enrollment Request'
      };
      processLeadSubmission(modalForm, data);
    });
  }

  // 3. Curriculum Download Modal Form: syllabusDownloadForm
  const syllabusForm = document.getElementById('syllabusDownloadForm');
  if (syllabusForm) {
    syllabusForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById('syllabus-name')?.value || '',
        phone: document.getElementById('syllabus-phone')?.value || '',
        email: document.getElementById('syllabus-email')?.value || '',
        year: 'Fresher Graduate',
        batch: 'ISTQB CTFL v4.0 (40 Hours)',
        knowledge: document.getElementById('syllabus-knowledge')?.value || 'Basic Knowledge (Added Advantage)',
        formType: 'Syllabus PDF Instant Download'
      };
      processLeadSubmission(syllabusForm, data);
    });
  }

  function processLeadSubmission(form, data) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Dispatching WhatsApp & Preparing PDF...`;

    // Construct the WhatsApp Message
    const message = 
`*NEW ISTQB CTFL COURSE ENQUIRY*
----------------------------------------
👤 *Candidate Name:* ${data.name}
📱 *Mobile / WhatsApp:* ${data.phone}
📧 *Email Address:* ${data.email}
🎓 *Graduation Year:* ${data.year}
⏱️ *Preferred Batch:* ${data.batch}
💡 *Manual Testing Knowledge:* ${data.knowledge}
📄 *Requested File:* ${PDF_FILENAME}
🏢 *Institute:* Greens Technologies
👨‍🏫 *Chief Faculty:* Muthu Viswanathan (M.Sc., M.Tech)
----------------------------------------
_Submitted via Greens Technologies ISTQB CTFL Portal_`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      // 1. Open WhatsApp in new tab with complete candidate enquiry details
      window.open(whatsappUrl, '_blank');

      // 2. Trigger automatic download of /assets/ISTQB-CTFL-Curriculum.pdf
      const downloadLink = document.createElement('a');
      downloadLink.href = PDF_URL;
      downloadLink.download = PDF_FILENAME;
      downloadLink.target = '_blank';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // 3. Reset form and restore button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      // 4. Close any open input modals
      ['enrollModal', 'curriculumModal'].forEach((modalId) => {
        const el = document.getElementById(modalId);
        if (el) {
          const instance = bootstrap.Modal.getInstance(el);
          if (instance) instance.hide();
        }
      });

      // 5. Update success modal WhatsApp action button link
      const successWaBtn = document.getElementById('successWhatsAppBtn');
      if (successWaBtn) {
        successWaBtn.href = whatsappUrl;
      }

      // 6. Display Success Modal & trigger celebration
      const successModalEl = document.getElementById('successModal');
      if (successModalEl) {
        const successModal = bootstrap.Modal.getOrCreateInstance(successModalEl);
        successModal.show();
        triggerConfetti();
      }
    }, 700);
  }
}

/* -------------------------------------------------------------
 * 8. Confetti Trigger Helper
 * ----------------------------------------------------------- */
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

/* -------------------------------------------------------------
 * 9. Scrolled Testimonials Carousel & Interactive Drag
 * ----------------------------------------------------------- */
function initTestimonialsScroller() {
  const viewport = document.getElementById('testimonialsViewport');
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('testiPrevBtn');
  const nextBtn = document.getElementById('testiNextBtn');
  const dotsContainer = document.getElementById('testimonialsDots');

  if (!viewport || !track) return;

  const slides = track.querySelectorAll('.testimonial-slide');
  if (slides.length === 0) return;

  // Generate pagination dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `testi-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => {
        scrollToSlide(i);
      });
      dotsContainer.appendChild(dot);
    });
  }

  function getStep() {
    const slide = slides[0];
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 22;
    return (slide ? slide.offsetWidth : 350) + gap;
  }

  function scrollToSlide(index) {
    const step = getStep();
    viewport.scrollTo({
      left: index * step,
      behavior: 'smooth'
    });
  }

  function updateActiveDot() {
    if (!dotsContainer) return;
    const step = getStep();
    const activeIndex = Math.min(
      slides.length - 1,
      Math.max(0, Math.round(viewport.scrollLeft / step))
    );
    const dots = dotsContainer.querySelectorAll('.testi-dot');
    dots.forEach((d, idx) => {
      d.classList.toggle('active', idx === activeIndex);
    });
  }

  viewport.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateActiveDot);
  }, { passive: true });

  // Navigation button clicks
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const step = getStep();
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      if (viewport.scrollLeft >= maxScroll - 20) {
        viewport.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        viewport.scrollBy({ left: step, behavior: 'smooth' });
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const step = getStep();
      if (viewport.scrollLeft <= 20) {
        viewport.scrollTo({ left: viewport.scrollWidth - viewport.clientWidth, behavior: 'smooth' });
      } else {
        viewport.scrollBy({ left: -step, behavior: 'smooth' });
      }
    });
  }

  // Auto-scrolling timer with pause on hover/interaction
  let isHovered = false;
  let autoScrollTimer = null;

  function startAutoScroll() {
    stopAutoScroll();
    autoScrollTimer = setInterval(() => {
      if (isHovered) return;
      const step = getStep();
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      if (viewport.scrollLeft >= maxScroll - 20) {
        viewport.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        viewport.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 4000);
  }

  function stopAutoScroll() {
    if (autoScrollTimer) {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }
  }

  viewport.addEventListener('mouseenter', () => { isHovered = true; });
  viewport.addEventListener('mouseleave', () => { isHovered = false; });
  viewport.addEventListener('touchstart', () => { isHovered = true; }, { passive: true });
  viewport.addEventListener('touchend', () => { 
    setTimeout(() => { isHovered = false; }, 2000); 
  }, { passive: true });

  // Drag to scroll for mouse users
  let isDown = false;
  let startX = 0;
  let scrollLeftStart = 0;

  viewport.addEventListener('mousedown', (e) => {
    isDown = true;
    isHovered = true;
    startX = e.pageX - viewport.offsetLeft;
    scrollLeftStart = viewport.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      setTimeout(() => { isHovered = false; }, 2000);
    }
  });

  viewport.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.5;
    viewport.scrollLeft = scrollLeftStart - walk;
  });

  startAutoScroll();
}

/* -------------------------------------------------------------
 * 10. Sample Video Players UX (One-at-a-time playback)
 * ----------------------------------------------------------- */
function initVideoPlayers() {
  const videos = document.querySelectorAll('.sample-video-player');
  if (videos.length === 0) return;

  videos.forEach((video) => {
    video.addEventListener('play', () => {
      videos.forEach((otherVideo) => {
        if (otherVideo !== video && !otherVideo.paused) {
          otherVideo.pause();
        }
      });
    });
  });
}

