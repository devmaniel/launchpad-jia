import React, { useEffect, useRef, useCallback, useState } from "react";
import { sanitizeHtml } from "@/lib/utils/sanitize";

interface SecretPromptInputProps {
  secretPrompt: string;
  setSecretPrompt: (val: string) => void;
  placeholder?: string;
}

const SecretPromptInput = ({ secretPrompt, setSecretPrompt, placeholder = "Enter a secret prompt (e.g. Give higher fit scores to candidates who participate in hackathons or competitions.)" }: SecretPromptInputProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const sanitize = (html: string) => {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  };

  const convertTextToHTML = useCallback((text: string) => {
    const lines = text.split(/\r?\n/);
    const htmlParts: string[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const ulMatch = /^\s*(?:[-*•])\s+(.+)$/.exec(line);
      const olMatch = /^\s*(\d+)[\.)]\s+(.+)$/.exec(line);
      if (ulMatch) {
        htmlParts.push('<ul>');
        while (i < lines.length) {
          const m = /^\s*(?:[-*•])\s+(.+)$/.exec(lines[i]);
          if (!m) break;
          htmlParts.push(`<li>${sanitize(m[1])}</li>`);
          i++;
        }
        htmlParts.push('</ul>');
        continue;
      }
      if (olMatch) {
        htmlParts.push('<ol>');
        while (i < lines.length) {
          const m = /^\s*(\d+)[\.)]\s+(.+)$/.exec(lines[i]);
          if (!m) break;
          htmlParts.push(`<li>${sanitize(m[2])}</li>`);
          i++;
        }
        htmlParts.push('</ol>');
        continue;
      }
      if (line.trim().length === 0) {
        htmlParts.push('<br>');
      } else {
        htmlParts.push(`<p>${sanitize(line)}</p>`);
      }
      i++;
    }
    return htmlParts.join('');
  }, []);

  const hasContent = (el: HTMLElement) => {
    const html = el.innerHTML.replace(/<br\s*\/?>/gi, '').replace(/&nbsp;/g, '').trim();
    if (html.length === 0) return false;
    if (/<li[\s>]/i.test(html)) return true;
    return (el.textContent || '').replace(/\u00A0/g, ' ').trim().length > 0;
  };

  const cleanHtml = (html: string): string => {
    if (typeof window === 'undefined') return html;
    
    const container = document.createElement('div');
    container.innerHTML = html;
    
    // Remove empty paragraphs and paragraphs with only whitespace
    const paragraphs = container.querySelectorAll('p');
    paragraphs.forEach((p) => {
      const text = p.textContent?.trim() || '';
      if (text.length === 0) {
        p.remove();
      }
    });
    
    // Remove trailing <br> tags
    let cleaned = container.innerHTML;
    cleaned = cleaned.replace(/(<br\s*\/?>)+$/gi, '');
    
    // Remove leading/trailing whitespace from the entire HTML
    cleaned = cleaned.trim();
    
    return cleaned;
  };

  const handleInput = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = cleanHtml(el.innerHTML);
    // Apply XSS sanitization before saving
    const sanitized = sanitizeHtml(html);
    setSecretPrompt(sanitized);
    const has = hasContent(el);
    el.setAttribute('data-has-content', String(has));
    setShowPlaceholder(!has);
  }, [setSecretPrompt]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    // Sanitize pasted text to prevent XSS
    const sanitized = sanitize(text);
    document.execCommand('insertHTML', false, sanitized);
    // after paste, recompute placeholder visibility
    const el = editorRef.current;
    if (el) {
      const has = hasContent(el);
      el.setAttribute('data-has-content', String(has));
      setShowPlaceholder(!has);
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== ' ') return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    let block: Node | null = sel.anchorNode as Node;
    while (block && block !== editorRef.current && !(block instanceof HTMLElement && /^(DIV|P|LI)$/.test(block.tagName))) {
      block = block.parentNode;
    }
    if (!block || !editorRef.current) return;
    const probe = document.createRange();
    probe.setStart(block, 0);
    probe.setEnd(range.startContainer, range.startOffset);
    const before = probe.toString();
    if (/^\s*[-*•]$/.test(before)) {
      e.preventDefault();
      const del = document.createRange();
      del.setStart(block, 0);
      del.setEnd(range.startContainer, range.startOffset);
      del.deleteContents();
      document.execCommand('insertUnorderedList');
      const el = editorRef.current as HTMLElement | null;
      if (el) {
        const has = hasContent(el);
        el.setAttribute('data-has-content', String(has));
        setShowPlaceholder(!has);
      }
    } else if (/^\s*\d+[\.)]$/.test(before)) {
      e.preventDefault();
      const del = document.createRange();
      del.setStart(block, 0);
      del.setEnd(range.startContainer, range.startOffset);
      del.deleteContents();
      document.execCommand('insertOrderedList');
      const el = editorRef.current as HTMLElement | null;
      if (el) {
        const has = hasContent(el);
        el.setAttribute('data-has-content', String(has));
        setShowPlaceholder(!has);
      }
    }
  }, []);

  const looksLikeHtml = useCallback((s: string) => /<(ul|ol|li|p|br|div|strong|em|b|i|u)\b/i.test(s), []);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (looksLikeHtml(secretPrompt || '')) {
      if (el.innerHTML !== (secretPrompt || '')) {
        el.innerHTML = secretPrompt || '';
      }
    } else {
      const currentText = el.innerText.replace(/\u00A0/g, ' ');
      if (currentText !== secretPrompt) {
        const html = convertTextToHTML(secretPrompt || '');
        el.innerHTML = html || '';
      }
    }
    const has = hasContent(el);
    el.setAttribute('data-has-content', String(has));
    setShowPlaceholder(!has);
  }, [secretPrompt, convertTextToHTML, looksLikeHtml]);

  // Initialize placeholder visibility on mount
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const has = hasContent(el);
    el.setAttribute('data-has-content', String(has));
    setShowPlaceholder(!has);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={editorRef}
        contentEditable
        className="sp-input custom-scrollbar"
        style={{
          width: "100%",
          borderRadius: 10,
          border: "1px solid #E5E7EB",
          padding: 16,
          outline: "none",
          fontSize: 16,
          lineHeight: '24px',
          color: '#1F2937',
          backgroundColor: '#fff',
          minHeight: '120px',
          maxHeight: 180,
          overflowY: 'auto',
          position: 'relative'
        }}
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          const el = editorRef.current;
          if (!el) return;
          const has = hasContent(el);
          el.setAttribute('data-has-content', String(has));
          setShowPlaceholder(!has);
        }}
      />
      {showPlaceholder && (
        <div className="sp-placeholder">
          {placeholder}
        </div>
      )}
      <style jsx>{`
        .sp-input:focus {
          border-color: rgb(59, 30, 246) !important;
        }
        :global(.sp-input ul), :global(.sp-input ol) {
          margin: 0 0 8px 0 !important;
          margin-block-start: 0 !important;
          margin-block-end: 8px !important;
          padding-left: 0 !important;
          padding-inline-start: 0 !important;
          margin-left: 0 !important;
          margin-inline-start: 0 !important;
          list-style-position: inside !important;
        }
        :global(.sp-input ul:first-child), :global(.sp-input ol:first-child) { margin-top: 0 !important; }
        :global(.sp-input li) { margin: 0 !important; padding-left: 0 !important; }
        :global(.sp-input li > p) { margin: 0 !important; }
        :global(.sp-input p) { margin: 0 0 8px 0 !important; }
        .sp-placeholder {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          color: #9CA3AF;
          pointer-events: none;
          font-size: 16px;
          line-height: 24px;
          z-index: 1;
        }
        :global(.custom-scrollbar) {
          scrollbar-width: thin;
          scrollbar-color: #E9EAEB transparent;
          border-radius: 10px !important;
        }
        :global(.custom-scrollbar::-webkit-scrollbar) {
          width: 8px;
          height: 20px;
          border-radius: 10px !important;
        }
        :global(.custom-scrollbar::-webkit-scrollbar-thumb) {
          background-color: #E9EAEB;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default SecretPromptInput;


