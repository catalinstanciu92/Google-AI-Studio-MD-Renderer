console.log('[Google AI Studio MD Renderer] Extension loaded');

let isEnabled = true;
let intervalId = null;

function parseMarkdown(text) {
  if (!text || typeof text !== 'string') return '';

  let html = text;

  html = html.replace(/&/g, '&amp;');
  html = html.replace(/</g, '&lt;');
  html = html.replace(/>/g, '&gt;');
  html = html.replace(/"/g, '&quot;');
  html = html.replace(/'/g, '&#39;');

  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
  html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  html = html.replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>');
  html = html.replace(/^\s*\d+\.\s+(.*)$/gm, '<li>$1</li>');

  html = html.replace(/^\s*>\s+(.*)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^---$/gm, '<hr>');

  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ol>)/g, '$1');
  html = html.replace(/(<\/ol>)<\/p>/g, '$1');
  html = html.replace(/<p>(<li>)/g, '$1');
  html = html.replace(/(<\/li>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre>)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
  html = html.replace(/<p>(<hr\/?>)/g, '$1');

  return html;
}

function renderMarkdown() {
  if (!isEnabled) {
    console.log('[Google AI Studio MD Renderer] Skipping render - disabled');
    return;
  }

  console.log('[Google AI Studio MD Renderer] Checking for sections...');

  const sections = document.querySelectorAll('section.chunk-editor-main');
  console.log('[Google AI Studio MD Renderer] Found sections:', sections.length);

  if (sections.length === 0) {
    return;
  }

  sections.forEach((section, sectionIndex) => {
    const divs = section.querySelectorAll('div.very-large-text-container:not(.cs-markdown-rendered)');
    console.log(`[Google AI Studio MD Renderer] Section ${sectionIndex}: Found ${divs.length} unrendered divs`);

    divs.forEach((div, divIndex) => {
      const rawText = div.innerText.trim();
      console.log(`[Google AI Studio MD Renderer] Div ${divIndex}: text length = ${rawText.length}`);

      if (rawText.length > 0) {
        try {
          const rendered = parseMarkdown(rawText);
          div.innerHTML = rendered;
          div.classList.add('cs-markdown-rendered');
          console.log(`[Google AI Studio MD Renderer] Successfully rendered div ${divIndex}`);
        } catch (err) {
          console.error('[Google AI Studio MD Renderer] Error rendering:', err);
        }
      }
    });
  });
}

function startMonitoring() {
  console.log('[Google AI Studio MD Renderer] Starting monitoring...');
  renderMarkdown();
  intervalId = setInterval(renderMarkdown, 5000);
}

function stopMonitoring() {
  console.log('[Google AI Studio MD Renderer] Stopping monitoring...');
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

chrome.storage.local.get(['enabled'], (result) => {
  isEnabled = result.enabled !== false;
  console.log('[Google AI Studio MD Renderer] Initial state:', isEnabled);

  if (isEnabled) {
    startMonitoring();
  }
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    isEnabled = changes.enabled.newValue;
    console.log('[Google AI Studio MD Renderer] State changed to:', isEnabled);

    if (isEnabled) {
      startMonitoring();
    } else {
      stopMonitoring();
    }
  }
});

console.log('[Google AI Studio MD Renderer] Script initialized');
