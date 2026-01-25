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
    const optionsContainer = widget.querySelector('[data-quiz-options]');
    const result = widget.querySelector('[data-quiz-result]');
    const optionButtons = widget.querySelectorAll('.ai-chat-option');

    if (!toggle || !panel || !optionsContainer || !result) return;

    const setOpen = (isOpen) => {
      panel.hidden = !isOpen;
      toggle.setAttribute('aria-expanded', String(isOpen));
    };

    const resetQuiz = () => {
      optionsContainer.hidden = false;
      result.hidden = true;
      result.innerHTML = '';
    };

    const renderResult = (stage) => {
      const recommendations = {
        starting: {
          package: 'Foundation',
          message: 'You are building consistent visibility and inbound readiness.'
        },
        growing: {
          package: 'Performance',
          message: 'You want a content-to-conversion system that drives leads.'
        },
        scaling: {
          package: 'Scale',
          message: 'You need volume, speed, and conversion optimization.'
        }
      };
      const choice = recommendations[stage];
      if (!choice) return;

      optionsContainer.hidden = true;
      result.hidden = false;
      result.innerHTML = `
        <div class="ai-chat-message ai-chat-message--bot">
          Best fit: <strong>${choice.package}</strong>. ${choice.message}
        </div>
        <div class="ai-chat-actions">
          <a class="ai-chat-action" href="services.html">View pricing</a>
          <a class="ai-chat-action secondary" href="contact.html">Book a call</a>
          <button class="ai-chat-action ghost" type="button" data-quiz-reset>Start over</button>
        </div>
      `;

      const resetButton = result.querySelector('[data-quiz-reset]');
      if (resetButton) {
        resetButton.addEventListener('click', resetQuiz);
      }
    };

    toggle.addEventListener('click', () => {
      setOpen(panel.hidden);
    });

    if (close) {
      close.addEventListener('click', () => {
        setOpen(false);
      });
    }

    optionButtons.forEach(button => {
      button.addEventListener('click', () => {
        renderResult(button.getAttribute('data-stage'));
      });
    });

    resetQuiz();
  });
})();
