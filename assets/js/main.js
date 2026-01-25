(function () {
  const toggle = document.querySelector('[data-mobile-toggle]');
  const nav = document.querySelector('[data-navlinks]');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // Set current nav link automatically
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('a[data-nav]').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path) a.setAttribute('aria-current', 'page');
  });

  document.querySelectorAll('[data-ai-chat]').forEach(widget => {
    const toggle = widget.querySelector('.ai-chat-toggle');
    const panel = widget.querySelector('.ai-chat-panel');
    const close = widget.querySelector('.ai-chat-close');
    const body = widget.querySelector('.ai-chat-body');

    if (!toggle || !panel || !body) return;

    const questions = [
      {
        id: 'revenue',
        text: 'What’s your monthly revenue range?',
        type: 'single',
        options: [
          { value: 'under-5k', label: 'Under $5k', score: { foundation: 2 } },
          { value: '5k-20k', label: '$5k–$20k', score: { foundation: 1, performance: 2 } },
          { value: '20k-50k', label: '$20k–$50k', score: { performance: 2, scale: 1 } },
          { value: '50k-plus', label: '$50k+', score: { scale: 2 } }
        ]
      },
      {
        id: 'industry',
        text: 'What industry are you in?',
        type: 'single',
        options: [
          { value: 'local-service', label: 'Local service', score: { foundation: 1 } },
          { value: 'ecom', label: 'eCom', score: { performance: 1 } },
          { value: 'restaurant', label: 'Restaurant', score: { foundation: 1 } },
          { value: 'other', label: 'Other', score: { performance: 1 } }
        ]
      },
      {
        id: 'source',
        text: 'Where do most customers currently come from?',
        type: 'single',
        options: [
          { value: 'referrals', label: 'Referrals', score: { foundation: 1 } },
          { value: 'google', label: 'Google', score: { performance: 1 } },
          { value: 'social', label: 'Social', score: { performance: 1 } },
          { value: 'paid-ads', label: 'Paid ads', score: { scale: 1 } },
          { value: 'walk-ins', label: 'Walk-ins', score: { foundation: 1 } }
        ]
      },
      {
        id: 'leads',
        text: 'Are you consistently getting new leads weekly?',
        type: 'single',
        options: [
          { value: 'no', label: 'No', score: { foundation: 2 } },
          { value: 'sometimes', label: 'Sometimes', score: { performance: 2 } },
          { value: 'yes', label: 'Yes', score: { scale: 2 } }
        ]
      },
      {
        id: 'visibility-problem',
        text: 'What’s your #1 visibility problem?',
        type: 'single',
        condition: (answers) => answers.leads === 'no',
        options: [
          { value: 'unknown', label: 'Nobody knows we exist', score: { foundation: 2 } },
          { value: 'content', label: 'Content sucks', score: { performance: 1 } },
          { value: 'time', label: 'No time', score: { performance: 1 } },
          { value: 'targeting', label: 'Bad targeting', score: { performance: 2 } }
        ]
      },
      {
        id: 'booking-speed',
        text: 'If someone visits your IG or site, can they book in under 15 seconds?',
        type: 'single',
        options: [
          { value: 'no', label: 'No', score: { foundation: 1 } },
          { value: 'kinda', label: 'Kinda', score: { performance: 1 } },
          { value: 'yes', label: 'Yes', score: { scale: 1 } }
        ]
      },
      {
        id: 'assets',
        text: 'Do you have:',
        helper: 'Select all that apply.',
        type: 'multi',
        options: [
          { value: 'booking-link', label: 'Booking link' },
          { value: 'landing-page', label: 'Landing page' },
          { value: 'clear-offer', label: 'Clear offer (what you do + who for + outcome)' },
          { value: 'reviews', label: 'Reviews visible' }
        ]
      },
      {
        id: 'booking-blocker',
        text: 'What stops you from adding a booking link?',
        type: 'single',
        condition: (answers) => !((answers.assets || []).includes('booking-link')),
        options: [
          { value: 'dont-know', label: 'Don’t know how', score: { foundation: 1 } },
          { value: 'no-time', label: 'No time', score: { performance: 1 } },
          { value: 'no-calls', label: 'Don’t want calls', score: { foundation: 1 } },
          { value: 'not-ready', label: 'Not ready', score: { foundation: 1 } }
        ]
      },
      {
        id: 'offer',
        text: 'What are you selling?',
        type: 'single',
        options: [
          { value: 'clear-package', label: 'Clear package', score: { scale: 1 } },
          { value: 'custom-quotes', label: 'Custom quotes', score: { performance: 1 } },
          { value: 'dm-us', label: '“DM us”', score: { foundation: 1 } },
          { value: 'not-sure', label: 'Not sure', score: { foundation: 1 } }
        ]
      },
      {
        id: 'aov',
        text: 'What’s your average customer value?',
        type: 'single',
        options: [
          { value: 'under-200', label: '<$200', score: { foundation: 2 } },
          { value: '200-1k', label: '$200–$1k', score: { performance: 2 } },
          { value: '1k-5k', label: '$1k–$5k', score: { scale: 2 } },
          { value: '5k-plus', label: '$5k+', score: { scale: 3 } }
        ]
      },
      {
        id: 'posting',
        text: 'How often do you post short-form video?',
        type: 'single',
        options: [
          { value: 'never', label: 'Never', score: { foundation: 2 } },
          { value: '1-2', label: '1–2x wk', score: { foundation: 1, performance: 1 } },
          { value: '3-5', label: '3–5x wk', score: { performance: 2 } },
          { value: 'daily', label: 'Daily', score: { scale: 2 } }
        ]
      },
      {
        id: 'repeatable',
        text: 'Do you have a repeatable content format?',
        type: 'single',
        options: [
          { value: 'no', label: 'No', score: { foundation: 1 } },
          { value: 'somewhat', label: 'Somewhat', score: { performance: 1 } },
          { value: 'yes', label: 'Yes', score: { scale: 1 } }
        ]
      },
      {
        id: 'response-time',
        text: 'Do you respond to inquiries within 1 hour during business hours?',
        type: 'single',
        options: [
          { value: 'no', label: 'No', score: { foundation: 1 } },
          { value: 'sometimes', label: 'Sometimes', score: { performance: 1 } },
          { value: 'yes', label: 'Yes', score: { scale: 1 } }
        ]
      },
      {
        id: 'kpis',
        text: 'Do you track any KPIs monthly?',
        type: 'single',
        options: [
          { value: 'none', label: 'None', score: { foundation: 1 } },
          { value: 'basic', label: 'Basic (likes, follows)', score: { performance: 1 } },
          { value: 'leads', label: 'Leads + bookings', score: { performance: 2 } },
          { value: 'revenue', label: 'Revenue + CAC + close rate', score: { scale: 2 } }
        ]
      }
    ];

    const state = {
      index: 0,
      answers: {}
    };

    const setOpen = (isOpen) => {
      panel.hidden = !isOpen;
      toggle.setAttribute('aria-expanded', String(isOpen));
    };

    const getVisibleQuestions = (answers) => (
      questions.filter(question => (question.condition ? question.condition(answers) : true))
    );

    const getRecommendation = (answers) => {
      const scoreMap = {
        revenue: {
          'under-5k': 0,
          '5k-20k': 1,
          '20k-50k': 2,
          '50k-plus': 3
        },
        source: {
          referrals: 0,
          'walk-ins': 0,
          google: 1,
          social: 1,
          'paid-ads': 2
        },
        leads: {
          no: 0,
          sometimes: 1,
          yes: 2
        },
        'booking-speed': {
          no: 0,
          kinda: 1,
          yes: 2
        },
        offer: {
          'dm-us': 0,
          'not-sure': 0,
          'custom-quotes': 1,
          'clear-package': 2
        },
        aov: {
          'under-200': 0,
          '200-1k': 1,
          '1k-5k': 2,
          '5k-plus': 3
        },
        posting: {
          never: 0,
          '1-2': 1,
          '3-5': 2,
          daily: 3
        },
        repeatable: {
          no: 0,
          somewhat: 1,
          yes: 2
        },
        'response-time': {
          no: 0,
          sometimes: 1,
          yes: 2
        },
        kpis: {
          none: 0,
          basic: 1,
          leads: 2,
          revenue: 3
        }
      };

      const assetsScore = (assets = []) => {
        if (assets.length <= 1) return 0;
        if (assets.length === 2) return 1;
        if (assets.length === 3) return 2;
        return 3;
      };

      let totalScore = 0;
      Object.entries(scoreMap).forEach(([key, map]) => {
        const value = answers[key];
        if (value && map[value] !== undefined) {
          totalScore += map[value];
        }
      });
      totalScore += assetsScore(answers.assets || []);

      const ranges = {
        foundation: { min: 0, max: 9 },
        performance: { min: 10, max: 18 },
        scale: { min: 19, max: 99 }
      };

      const selection = Object.keys(ranges).find(key => (
        totalScore >= ranges[key].min && totalScore <= ranges[key].max
      )) || 'performance';

      const messaging = {
        foundation: {
          package: 'Foundation',
          message: 'You need consistent visibility and a clean conversion path.'
        },
        performance: {
          package: 'Performance',
          message: 'You are ready for a content-to-conversion system that drives leads.'
        },
        scale: {
          package: 'Scale',
          message: 'You are primed for high-volume growth with stronger systems.'
        }
      };

      return messaging[selection];
    };

    const renderResult = () => {
      const result = getRecommendation(state.answers);
      body.innerHTML = `
        <div class="ai-chat-message ai-chat-message--bot">
          Best fit: <strong>${result.package}</strong>. ${result.message}
        </div>
        <div class="ai-chat-actions">
          <a class="ai-chat-action" href="services.html">View pricing</a>
          <a class="ai-chat-action secondary" href="contact.html">Book a call</a>
          <button class="ai-chat-action ghost" type="button" data-quiz-reset>Start over</button>
        </div>
      `;

      const resetButton = body.querySelector('[data-quiz-reset]');
      if (resetButton) {
        resetButton.addEventListener('click', () => {
          state.index = 0;
          state.answers = {};
          renderQuestion();
        });
      }
    };

    const renderQuestion = () => {
      const visible = getVisibleQuestions(state.answers);
      if (state.index >= visible.length) {
        renderResult();
        return;
      }

      const question = visible[state.index];
      const progress = `${state.index + 1} of ${visible.length}`;
      const helper = question.helper ? `<div class="ai-chat-helper">${question.helper}</div>` : '';

      if (question.type === 'multi') {
        body.innerHTML = `
          <div class="ai-chat-progress">Question ${progress}</div>
          <div class="ai-chat-message ai-chat-message--bot">${question.text}</div>
          ${helper}
          <div class="ai-chat-checkboxes">
            ${question.options.map(option => `
              <label class="ai-chat-checkbox">
                <input type="checkbox" value="${option.value}">
                <span>${option.label}</span>
              </label>
            `).join('')}
          </div>
          <div class="ai-chat-actions">
            <button class="ai-chat-action secondary" type="button" data-quiz-back>Back</button>
            <button class="ai-chat-action" type="button" data-quiz-next>Continue</button>
          </div>
        `;

        const selected = new Set(state.answers[question.id] || []);
        body.querySelectorAll('input[type="checkbox"]').forEach(input => {
          if (selected.has(input.value)) input.checked = true;
        });

        const back = body.querySelector('[data-quiz-back]');
        const next = body.querySelector('[data-quiz-next]');

        if (back) {
          back.addEventListener('click', () => {
            state.index = Math.max(0, state.index - 1);
            renderQuestion();
          });
        }

        if (next) {
          next.addEventListener('click', () => {
            const values = Array.from(body.querySelectorAll('input[type="checkbox"]'))
              .filter(input => input.checked)
              .map(input => input.value);
            state.answers[question.id] = values;
            state.index += 1;
            renderQuestion();
          });
        }
        return;
      }

      body.innerHTML = `
        <div class="ai-chat-progress">Question ${progress}</div>
        <div class="ai-chat-message ai-chat-message--bot">${question.text}</div>
        ${helper}
        <div class="ai-chat-options">
          ${question.options.map(option => `
            <button class="ai-chat-option" type="button" data-value="${option.value}">
              ${option.label}
            </button>
          `).join('')}
        </div>
        <div class="ai-chat-actions">
          <button class="ai-chat-action secondary" type="button" data-quiz-back>Back</button>
        </div>
      `;

      const back = body.querySelector('[data-quiz-back]');
      if (back) {
        back.disabled = state.index === 0;
        back.addEventListener('click', () => {
          state.index = Math.max(0, state.index - 1);
          renderQuestion();
        });
      }

      body.querySelectorAll('.ai-chat-option').forEach(button => {
        button.addEventListener('click', () => {
          state.answers[question.id] = button.getAttribute('data-value');
          state.index += 1;
          renderQuestion();
        });
      });
    };

    toggle.addEventListener('click', () => {
      setOpen(panel.hidden);
    });

    if (close) {
      close.addEventListener('click', () => {
        setOpen(false);
      });
    }

    renderQuestion();
  });
})();
