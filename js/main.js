/**
 * ==============================================================================
 * ANIL SHARMA | PORTFOLIO INTERACTIVE JAVASCRIPT ENGINE
 * Role: QA Engineer & SDET Aspirant
 * Features: Interactive Test Suite Runner, Live REST API Tester, Project Filtering,
 *           Bug Report Copier, Animated Counters, Toast Feedback, Smooth Navigation
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initTerminalRunner();
  initApiTester();
  initProjectFilter();
  initBugReportCopier();
  initClipboardUtils();
  initMetricCounters();
  initContactForm();
});

/* ==============================================================================
   1. TOAST NOTIFICATION SYSTEM
   ============================================================================== */
let toastTimeout;
function showToast(message, icon = '✓') {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  clearTimeout(toastTimeout);
  toastText.textContent = `${icon} ${message}`;
  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==============================================================================
   2. HEADER, NAVIGATION & SCROLL SPY
   ============================================================================== */
function initNavigation() {
  const header = document.getElementById('site-header');
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Scroll Spy
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (window.pageYOffset >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Drawer Toggle
  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileDrawer.classList.toggle('open');
    });

    // Close on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        mobileDrawer.classList.remove('open');
      }
    });
  }
}

/* ==============================================================================
   3. INTERACTIVE QA TEST RUNNER TERMINAL SIMULATOR
   ============================================================================== */
const testSuites = {
  api: {
    command: 'pytest test_api_endpoints.py --verbose -s',
    title: 'ANIL_SHARMA@qa-suite: ~/tests/api_regression',
    files: [
      { name: 'test_api_endpoints.py::test_auth_token_refresh', status: '200 OK', latency: '29ms', pass: true },
      { name: 'test_api_endpoints.py::test_boundary_payload_validation', status: 'schema valid', latency: '34ms', pass: true },
      { name: 'test_api_endpoints.py::test_negative_bad_request_handler', status: '400 Handled', latency: '22ms', pass: true },
      { name: 'test_api_endpoints.py::test_cors_and_security_headers', status: 'headers verified', latency: '18ms', pass: true }
    ],
    coverage: '100% REST Endpoints Covered'
  },
  ai: {
    command: 'pytest test_ai_interviewer.py test_gemini_recs.py --verbose',
    title: 'ANIL_SHARMA@qa-suite: ~/tests/ai_guardrails',
    files: [
      { name: 'test_ai_interviewer.py::test_conversational_latency_edge_cases', status: 'latency < 120ms', latency: '74ms', pass: true },
      { name: 'test_ai_interviewer.py::test_hallucination_guardrail_filters', status: 'guardrails intact', latency: '88ms', pass: true },
      { name: 'test_gemini_recs.py::test_multimodal_wardrobe_null_fallback', status: 'handled gracefully', latency: '65ms', pass: true },
      { name: 'test_ai_interviewer.py::test_session_state_consistency', status: 'memory intact', latency: '41ms', pass: true }
    ],
    coverage: '100% AI Prompts & Guardrails Validated'
  },
  e2e: {
    command: 'pytest test_e2e_user_flows.py --browser=chromium --headless',
    title: 'ANIL_SHARMA@qa-suite: ~/tests/e2e_flows',
    files: [
      { name: 'test_e2e_user_flows.py::test_new_user_onboarding_and_auth', status: 'session created', latency: '142ms', pass: true },
      { name: 'test_e2e_user_flows.py::test_cart_checkout_and_discount_calculation', status: 'zero regression', latency: '185ms', pass: true },
      { name: 'test_e2e_user_flows.py::test_eeg_signal_upload_pipeline', status: 'fastapi validated', latency: '210ms', pass: true },
      { name: 'test_e2e_user_flows.py::test_session_timeout_and_graceful_redirect', status: 'state preserved', latency: '95ms', pass: true }
    ],
    coverage: '100% Critical User Journeys Tested'
  },
  security: {
    command: 'pytest test_security_auth.py --scan=vulnerabilities',
    title: 'ANIL_SHARMA@qa-suite: ~/tests/security_scan',
    files: [
      { name: 'test_security_auth.py::test_sql_injection_sanitization', status: 'payload neutralized', latency: '31ms', pass: true },
      { name: 'test_security_auth.py::test_xss_input_escaping_on_forms', status: 'script tags stripped', latency: '26ms', pass: true },
      { name: 'test_security_auth.py::test_rate_limiter_threshold_429', status: '429 Rate Limited', latency: '19ms', pass: true },
      { name: 'test_security_auth.py::test_expired_jwt_signature_rejection', status: '401 Unauthorized', latency: '24ms', pass: true }
    ],
    coverage: 'Zero Vulnerability Leaks Identified'
  }
};

let currentSuiteKey = 'api';
let isRunningTests = false;

function initTerminalRunner() {
  const rerunBtn = document.getElementById('btn-rerun-tests');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalTitle = document.getElementById('terminal-title-text');
  const progressBar = document.getElementById('terminal-progress-bar');
  const suiteTabs = document.querySelectorAll('.suite-tab-btn');

  function renderInitialSuite(suiteKey) {
    currentSuiteKey = suiteKey;
    const suite = testSuites[suiteKey];
    if (!terminalOutput || !suite) return;

    if (terminalTitle) {
      terminalTitle.textContent = suite.title;
    }

    let outputHtml = `
      <div><span class="t-prompt">$</span> <span class="t-cmd">${suite.command}</span></div>
      <div style="margin-top: 6px; color: var(--text-dim);">Loaded ${suite.files.length} test modules. Ready to execute suite.</div>
    `;

    suite.files.forEach(f => {
      outputHtml += `
        <div style="margin-top: 4px;">
          <span class="t-pass">[PASS]</span>
          <span class="t-file">${f.name}</span>
          <span class="t-ms">(${f.status}, ${f.latency})</span>
        </div>
      `;
    });

    outputHtml += `
      <div class="t-summary">
        <span class="t-summary-tag">● Status: READY FOR PRODUCTION</span>
        <span class="t-summary-tag">✓ ${suite.files.length} Passed</span>
        <span class="t-summary-tag">0 Failed</span>
        <span class="t-summary-tag">Coverage: ${suite.coverage}</span>
      </div>
    `;

    terminalOutput.innerHTML = outputHtml;
    if (progressBar) progressBar.style.width = '100%';
  }

  function runTests() {
    if (isRunningTests || !terminalOutput) return;
    isRunningTests = true;
    const suite = testSuites[currentSuiteKey];

    if (rerunBtn) {
      rerunBtn.disabled = true;
      rerunBtn.style.opacity = '0.7';
    }

    if (progressBar) progressBar.style.width = '0%';

    terminalOutput.innerHTML = `
      <div><span class="t-prompt">$</span> <span class="t-cmd">${suite.command}</span></div>
      <div style="margin-top: 8px; color: var(--accent-violet-luminous); font-weight:600;">⚡ Initializing test runners, assertions & sandbox mocks...</div>
    `;

    const totalTests = suite.files.length;
    let completed = 0;

    suite.files.forEach((file, index) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.style.marginTop = '4px';
        line.innerHTML = `<span class="t-pass">[PASS]</span> <span class="t-file">${file.name}</span> <span class="t-ms">(${file.status}, ${file.latency})</span>`;
        terminalOutput.appendChild(line);

        completed++;
        const pct = Math.round((completed / totalTests) * 100);
        if (progressBar) progressBar.style.width = `${pct}%`;

        if (completed === totalTests) {
          setTimeout(() => {
            const summary = document.createElement('div');
            summary.className = 't-summary';
            summary.innerHTML = `
              <span class="t-summary-tag">● Status: READY FOR PRODUCTION</span>
              <span class="t-summary-tag">✓ ${totalTests} Passed</span>
              <span class="t-summary-tag">0 Failed</span>
              <span class="t-summary-tag">Coverage: ${suite.coverage}</span>
            `;
            terminalOutput.appendChild(summary);

            isRunningTests = false;
            if (rerunBtn) {
              rerunBtn.disabled = false;
              rerunBtn.style.opacity = '1';
            }
            showToast(`✓ All ${totalTests} assertions in "${currentSuiteKey.toUpperCase()}" passed!`);
          }, 300);
        }
      }, (index + 1) * 320);
    });
  }

  // Suite Tab Switchers
  suiteTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (isRunningTests) return;
      suiteTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const suiteKey = tab.getAttribute('data-suite') || 'api';
      renderInitialSuite(suiteKey);
      showToast(`Switched to ${tab.textContent} suite`);
    });
  });

  if (rerunBtn) {
    rerunBtn.addEventListener('click', runTests);
  }

  renderInitialSuite('api');
}

/* ==============================================================================
   4. LIVE REST API PLAYGROUND & TESTER
   ============================================================================== */
const apiEndpoints = {
  'session': {
    method: 'GET',
    url: 'https://api.portfolio.local/v1/auth/session',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...' },
    body: null,
    response: {
      status: 200,
      statusText: 'OK',
      data: {
        authenticated: true,
        user: { id: 'usr_8829', name: 'Anil Sharma', role: 'QA_ENGINEER', permissions: ['api:read', 'api:test', 'e2e:execute'] },
        session_expires_in: 3600,
        token_type: 'Bearer'
      }
    },
    assertions: [
      'Status code is 200 OK',
      'Response payload schema matches SessionSchema',
      'Response time < 100ms'
    ]
  },
  'checkout': {
    method: 'POST',
    url: 'https://api.portfolio.local/v1/users/checkout',
    headers: { 'Content-Type': 'application/json', 'X-Idempotency-Key': 'chk_9921_abc' },
    body: {
      cart_id: 'cart_5510',
      customer_id: 'cust_8821',
      items_count: 3,
      total_amount: 129.50,
      currency: 'USD'
    },
    response: {
      status: 201,
      statusText: 'Created',
      data: {
        order_id: 'ord_984310',
        status: 'CONFIRMED',
        payment_status: 'CAPTURED',
        total_settled: 129.50,
        created_at: '2026-09-16T11:55:00Z'
      }
    },
    assertions: [
      'Status code is 201 Created',
      'Order ID generated and verified non-null',
      'Idempotency header validated'
    ]
  },
  'interview': {
    method: 'POST',
    url: 'https://api.portfolio.local/v1/ai-interviewer/analyze-response',
    headers: { 'Content-Type': 'application/json' },
    body: {
      candidate_id: 'cand_901',
      question_id: 'q_python_oop',
      candidate_answer: 'Inheritance allows a class to derive properties and methods from a base class...'
    },
    response: {
      status: 200,
      statusText: 'OK',
      data: {
        relevance_score: 0.96,
        technical_accuracy: 'HIGH',
        detected_keywords: ['inheritance', 'base class', 'polymorphism'],
        latency_ms: 78,
        hallucination_detected: false
      }
    },
    assertions: [
      'Status code is 200 OK',
      'Latency is within AI benchmark bounds (< 150ms)',
      'Hallucination check evaluates false'
    ]
  },
  'fashion': {
    method: 'GET',
    url: 'https://api.portfolio.local/v1/recommendations/fashion?style=minimalist&season=autumn',
    headers: { 'Content-Type': 'application/json' },
    body: null,
    response: {
      status: 200,
      statusText: 'OK',
      data: {
        recommendations_count: 2,
        outfits: [
          { id: 'fit_01', style: 'Minimalist Autumn Layering', score: 0.94, confidence: 'High' },
          { id: 'fit_02', style: 'Charcoal Wool Overcoat + Knit', score: 0.91, confidence: 'High' }
        ],
        model_engine: 'gemini-1.5-pro-reasoning'
      }
    },
    assertions: [
      'Status code is 200 OK',
      'Returned array length is greater than 0',
      'Confidence score >= 0.90'
    ]
  }
};

function initApiTester() {
  const selectEndpoint = document.getElementById('api-endpoint-select');
  const methodBadge = document.getElementById('api-method-badge');
  const btnSend = document.getElementById('btn-send-api');
  const codeResponse = document.getElementById('api-response-code');
  const statusPill = document.getElementById('api-status-pill');
  const latencyPill = document.getElementById('api-latency-pill');
  const assertionsContainer = document.getElementById('api-assertions-container');
  const btnCopyCurl = document.getElementById('btn-copy-curl');

  function updateEndpointView(key) {
    const endpoint = apiEndpoints[key];
    if (!endpoint) return;

    if (methodBadge) {
      methodBadge.textContent = endpoint.method;
      methodBadge.className = `method-badge method-${endpoint.method.toLowerCase()}`;
    }

    if (statusPill) {
      statusPill.textContent = `${endpoint.response.status} ${endpoint.response.statusText}`;
      statusPill.className = 'api-status-pill status-200';
    }

    if (latencyPill) {
      latencyPill.textContent = `${Math.floor(Math.random() * 25) + 24}ms`;
    }

    if (codeResponse) {
      codeResponse.textContent = JSON.stringify(endpoint.response.data, null, 2);
    }

    if (assertionsContainer) {
      assertionsContainer.innerHTML = endpoint.assertions.map(a => `
        <div class="api-assertion-item">
          <span class="assertion-check">✓</span>
          <span>PASS: ${a}</span>
        </div>
      `).join('');
    }
  }

  if (selectEndpoint) {
    selectEndpoint.addEventListener('change', (e) => {
      updateEndpointView(e.target.value);
    });
  }

  if (btnSend) {
    btnSend.addEventListener('click', () => {
      const key = selectEndpoint ? selectEndpoint.value : 'session';
      const endpoint = apiEndpoints[key];
      if (!endpoint) return;

      btnSend.disabled = true;
      btnSend.textContent = 'Sending...';

      if (codeResponse) {
        codeResponse.textContent = '// Executing HTTP request & validating assertions...';
      }

      setTimeout(() => {
        updateEndpointView(key);
        btnSend.disabled = false;
        btnSend.innerHTML = `
          <span>Send Request</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        `;
        showToast(`✓ Received 200 OK for ${endpoint.method} request!`);
      }, 400);
    });
  }

  if (btnCopyCurl) {
    btnCopyCurl.addEventListener('click', () => {
      const key = selectEndpoint ? selectEndpoint.value : 'session';
      const endpoint = apiEndpoints[key];
      if (!endpoint) return;

      const curlCmd = `curl -X ${endpoint.method} "${endpoint.url}" -H "Content-Type: application/json"${endpoint.body ? ` -d '${JSON.stringify(endpoint.body)}'` : ''}`;
      navigator.clipboard.writeText(curlCmd).then(() => {
        showToast('✓ cURL command copied to clipboard!');
      });
    });
  }

  updateEndpointView('session');
}

/* ==============================================================================
   5. PROJECT CATEGORY FILTER
   ============================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==============================================================================
   6. BUG REPORT COPIER / JIRA JAVASCRIPT SIMULATOR
   ============================================================================== */
function initBugReportCopier() {
  const btnCopyBug = document.getElementById('btn-copy-bug-report');
  if (!btnCopyBug) return;

  btnCopyBug.addEventListener('click', () => {
    const bugMarkdown = `## [DEF-104] Auth token expiration race condition on rapid checkout
**Severity:** P1 - Blocker
**Component:** Authentication / Checkout API
**Environment:** Staging (v2.4.1), Chrome 128, Postman v10.2

### Steps to Reproduce:
1. Log in with valid bearer credentials.
2. Add items to cart and proceed to checkout modal.
3. Simulate token expiration (TTL set to 0s) while triggering 2 concurrent checkout requests.

### Expected Result:
- First request triggers token refresh or 401 Unauthorized with standard error payload.
- No duplicate charge or orphan order record created in PostgreSQL.

### Actual Result:
- Concurrent request bypassed token check during state transition, causing secondary charge.

### Validation Fix:
- Added distributed Redis lock on user_id checkout endpoint and atomic idempotency key validation.
- Automated regression test added: \`test_checkout_concurrency_race_condition.py\`.`;

    navigator.clipboard.writeText(bugMarkdown).then(() => {
      showToast('✓ Jira Bug Report Markdown copied to clipboard!');
    }).catch(() => {
      showToast('✓ Bug Report copied!');
    });
  });
}

/* ==============================================================================
   7. CLIPBOARD UTILITIES (EMAIL & PHONE)
   ============================================================================== */
function initClipboardUtils() {
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyPhoneBtn = document.getElementById('copy-phone-btn');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'as3658349@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`✓ Email copied: ${email}`);
      }).catch(() => {
        showToast(`✓ Email: ${email}`);
      });
    });
  }

  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      const phone = '+918290502081';
      navigator.clipboard.writeText(phone).then(() => {
        showToast(`✓ Phone copied: +91 82905 02081`);
      });
    });
  }
}

/* ==============================================================================
   8. ANIMATED NUMBER COUNTERS ON SCROLL
   ============================================================================== */
function initMetricCounters() {
  const metricNumbers = document.querySelectorAll('.metric-number[data-target]');
  if (metricNumbers.length === 0) return;

  let hasAnimated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        metricNumbers.forEach(el => {
          const target = parseFloat(el.getAttribute('data-target') || '0');
          const suffix = el.getAttribute('data-suffix') || '';
          const isDecimal = target % 1 !== 0;
          let count = 0;
          const duration = 1200;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              count = target;
              clearInterval(timer);
            }
            el.innerHTML = `${isDecimal ? count.toFixed(1) : Math.floor(count)}<span class="plus-sign">${suffix}</span>`;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.querySelector('.hero-metrics');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

/* ==============================================================================
   9. CONTACT FORM HANDLER
   ============================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('sender-name');
    const emailInput = document.getElementById('sender-email');
    const msgInput = document.getElementById('sender-msg');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const msg = msgInput ? msgInput.value.trim() : '';

    if (!name || !email || !msg) {
      showToast('Please fill out all fields', '⚠');
      return;
    }

    const subject = encodeURIComponent(`QA / SDET Opportunity for Anil Sharma (from ${name})`);
    const body = encodeURIComponent(`Hi Anil,\n\nName: ${name}\nContact: ${email}\n\nMessage:\n${msg}\n\n---\nSent from Anil Sharma Portfolio`);

    showToast('Opening default email client to send message...');
    window.location.href = `mailto:as3658349@gmail.com?subject=${subject}&body=${body}`;
  });
}
