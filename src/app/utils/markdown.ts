import {marked} from 'marked';
import hljs from 'highlight.js/lib/core';
import DOMPurify from 'dompurify';

// Import specific languages
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import json from 'highlight.js/lib/languages/json';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';

// Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('json', json);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', xml);

// Custom highlight function with proper typing
const highlightCode = (code: string, lang?: string): string => {
    if (!lang || !hljs.getLanguage(lang)) {
        try {
            return hljs.highlightAuto(code).value;
        } catch {
            return code;
        }
    }

    try {
        return hljs.highlight(code, {language: lang, ignoreIllegals: true}).value;
    } catch {
        return code;
    }
};

// Configure marked
const markedOptions: {
    highlight: (code: string, lang?: string) => string;
    breaks: boolean;
    gfm: boolean
} = {
    highlight: highlightCode,
    breaks: true,
    gfm: true,
};

marked.setOptions(markedOptions);

// Declare global interface for window
declare global {
    interface Window {
        copyCode: (button: HTMLElement) => Promise<void>;
    }
}

export function renderMarkdown(text: string): string {
    try {
        // Parse markdown
        const rawHtml = marked.parse(text);

        // Handle promise case (newer versions of marked might return Promise)
        if (rawHtml instanceof Promise) {
            console.warn('Marked returned a promise, using synchronous fallback');
            return text; // Fallback to original text
        }

        // Process in browser only
        if (typeof document === 'undefined') {
            return DOMPurify.sanitize(rawHtml, {
                USE_PROFILES: {html: true},
                ADD_TAGS: ['kbd'],
                ADD_ATTR: ['onclick']
            });
        }

        // Create temporary element for DOM manipulation
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, 'text/html');

        // Process code blocks
        doc.querySelectorAll('pre').forEach(pre => {
            const code = pre.querySelector('code');
            if (code) {
                processCodeBlock(pre, code);
            }
        });

        return DOMPurify.sanitize(doc.body.innerHTML, {
            USE_PROFILES: {html: true},
            ADD_TAGS: ['kbd'],
            ADD_ATTR: ['onclick']
        });
    } catch (error) {
        console.error('Error rendering markdown:', error);
        return DOMPurify.sanitize(text);
    }
}

function processCodeBlock(pre: HTMLPreElement, code: HTMLElement): void {
    const lang = code.className.replace('language-', '') || 'code';

    // Create header
    const header = document.createElement('div');
    header.className = 'code-header bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700';

    // Use textContent for safety
    const langSpan = document.createElement('span');
    langSpan.className = 'text-xs font-semibold text-blue-400 uppercase';
    langSpan.textContent = lang;

    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'code-copy-btn flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-700 text-gray-300 rounded hover:bg-blue-600 hover:text-white transition-colors';
    copyButton.setAttribute('onclick', 'copyCode(this)');
    copyButton.innerHTML = 'Copy';

    header.appendChild(langSpan);
    header.appendChild(copyButton);

    // Style the pre and code elements
    pre.insertBefore(header, pre.firstChild);
    pre.className += ' bg-gray-900 border border-gray-700 rounded-lg overflow-hidden my-4 hover:border-blue-500 transition-colors';
    code.className += ' block p-4 text-sm font-mono text-gray-100';
}

// Global copy function
if (typeof window !== 'undefined') {
    window.copyCode = async (button: HTMLElement) => {
        const pre = button.closest('pre');
        const code = pre!.querySelector("code")!;

        if (code) {
            try {
                await navigator.clipboard.writeText(code.textContent || '');

                // Visual feedback
                const originalHTML = button.innerHTML;
                const originalClass = button.className;

                button.innerHTML = '✓ Copied!';
                button.className = button.className.replace('bg-gray-700', 'bg-green-600');

                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.className = originalClass;
                }, 1500);
            } catch (err) {
                console.error('Failed to copy code:', err);
            }
        }
    };
}
