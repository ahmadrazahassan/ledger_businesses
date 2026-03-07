'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { uploadImageWithCompression } from '@/lib/upload';

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

type EditorTab = 'write' | 'html' | 'preview';

export function RichEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
  className = '',
}: RichEditorProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('write');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [fontFamily, setFontFamily] = useState('Inter, sans-serif');
  const [fontSize, setFontSize] = useState('4');
  const [blockType, setBlockType] = useState('p');
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectionRef = useRef<Range | null>(null);

  useEffect(() => {
    document.execCommand('styleWithCSS', false, 'true');
  }, []);

  useEffect(() => {
    if (activeTab === 'write' && editorRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [activeTab, value]);

  const syncContent = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      if (html !== value) {
        onChange(html);
      }
    }
  }, [onChange, value]);

  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    selectionRef.current = selection.getRangeAt(0).cloneRange();
  }, []);

  const restoreSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || !selectionRef.current) return;
    selection.removeAllRanges();
    selection.addRange(selectionRef.current);
  }, []);

  const focusAndRestoreSelection = useCallback(() => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();
  }, [restoreSelection]);

  const runCommand = useCallback(
    (command: string, commandValue?: string) => {
      focusAndRestoreSelection();
      document.execCommand(command, false, commandValue);
      saveSelection();
      syncContent();
    },
    [focusAndRestoreSelection, saveSelection, syncContent]
  );

  const insertImageAtCursor = useCallback(
    (url: string, alt = 'Image') => {
      if (!editorRef.current || !url.trim()) return;

      focusAndRestoreSelection();
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        const wrapper = document.createElement('figure');
        wrapper.className = 'my-6';
        const img = document.createElement('img');
        img.src = url.trim();
        img.alt = alt;
        img.className = 'max-w-full h-auto rounded-2xl';
        wrapper.appendChild(img);
        editorRef.current.appendChild(wrapper);
        syncContent();
        return;
      }

      const range = selection.getRangeAt(0);
      range.deleteContents();

      const wrapper = document.createElement('figure');
      wrapper.className = 'my-6';
      const img = document.createElement('img');
      img.src = url.trim();
      img.alt = alt;
      img.className = 'max-w-full h-auto rounded-2xl';
      wrapper.appendChild(img);
      range.insertNode(wrapper);

      const newRange = document.createRange();
      newRange.setStartAfter(wrapper);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
      saveSelection();
      syncContent();
    },
    [focusAndRestoreSelection, saveSelection, syncContent]
  );

  const insertImage = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const result = await uploadImageWithCompression(file, 'covers', 'posts');

        if (result.success && result.url) {
          insertImageAtCursor(result.url, 'Uploaded image');
        } else {
          alert(result.error || 'Upload failed');
        }
      } catch (error) {
        console.error('Image upload error:', error);
        alert('Failed to upload image');
      } finally {
        setUploading(false);
      }
    },
    [insertImageAtCursor]
  );

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLDivElement>) => {
      const clipboardFiles = e.clipboardData?.files;
      if (clipboardFiles && clipboardFiles.length > 0) {
        const imageFile = Array.from(clipboardFiles).find((file) => file.type.startsWith('image/'));
        if (imageFile) {
          e.preventDefault();
          await insertImage(imageFile);
          return;
        }
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) await insertImage(file);
          return;
        }
      }

      const html = e.clipboardData?.getData('text/html');
      if (html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const pastedImage = doc.querySelector('img');
        if (pastedImage?.src) {
          e.preventDefault();
          insertImageAtCursor(pastedImage.src, pastedImage.alt || 'Pasted image');
          return;
        }
      }
    },
    [insertImage, insertImageAtCursor]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer?.files;
      if (!files) return;

      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/')) {
          insertImage(files[i]);
          break;
        }
      }
    },
    [insertImage]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      insertImage(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageUrlInsert = () => {
    if (!imageUrl.trim()) return;
    insertImageAtCursor(imageUrl.trim(), 'Inserted image');
    setImageUrl('');
    setShowImageUrlInput(false);
  };

  const applyBlockType = (value: string) => {
    setBlockType(value);
    runCommand('formatBlock', value);
  };

  const applyFontFamily = (value: string) => {
    setFontFamily(value);
    runCommand('fontName', value);
  };

  const applyFontSize = (value: string) => {
    setFontSize(value);
    runCommand('fontSize', value);
  };

  const dockButtonClass =
    'flex flex-col items-center justify-center gap-1 h-[42px] px-2 text-[10px] font-medium text-ink/65 border border-ink/[0.08] rounded-xl bg-white hover:border-ink/20 hover:text-ink transition-all';

  return (
    <div className={`pb-36 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 p-1.5 bg-ink/[0.04] rounded-2xl border border-ink/[0.06]">
          {(['write', 'html', 'preview'] as EditorTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-[13px] font-semibold capitalize rounded-xl transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-ink text-white shadow-sm'
                  : 'text-ink/50 hover:text-ink/80 hover:bg-white/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'write' && (
          <p className="text-[12px] text-ink/45">Use the bottom dock for formatting controls</p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {activeTab === 'write' && (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={syncContent}
          onBlur={saveSelection}
          onMouseUp={saveSelection}
          onKeyUp={saveSelection}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-full min-h-[400px] px-6 py-5 bg-white border rounded-2xl text-[15px] text-ink leading-relaxed focus:outline-none focus:border-ink/20 focus:ring-4 focus:ring-ink/[0.03] transition-all overflow-auto ${
            isDragging ? 'border-accent border-2 bg-accent/[0.02]' : 'border-ink/[0.08]'
          }`}
          data-placeholder={placeholder}
          style={{
            minHeight: '400px',
            fontFamily: 'inherit',
          }}
        />
      )}

      {activeTab === 'html' && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="<p>Paste or write HTML here...</p>"
          rows={20}
          className="w-full px-6 py-5 bg-white border border-ink/[0.08] rounded-2xl text-[14px] text-ink font-mono leading-relaxed resize-y focus:outline-none focus:border-ink/20 focus:ring-4 focus:ring-ink/[0.03] transition-all"
          style={{ minHeight: '400px' }}
        />
      )}

      {activeTab === 'preview' && (
        <div className="w-full min-h-[400px] px-6 py-5 bg-white border border-ink/[0.08] rounded-2xl overflow-auto">
          {value ? (
            <div
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <p className="text-[14px] text-ink/30 font-medium">No content to preview</p>
          )}
        </div>
      )}

      {activeTab === 'write' && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-4 z-50 w-[min(1120px,calc(100vw-24px))] rounded-2xl border border-ink/[0.12] bg-white/95 backdrop-blur px-3 py-3 shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 xl:grid-cols-14 gap-2">
            <select
              value={blockType}
              onChange={(e) => applyBlockType(e.target.value)}
              onMouseDown={(e) => e.preventDefault()}
              className="h-[42px] w-full px-3 text-[12px] font-semibold text-ink bg-white border border-ink/[0.1] rounded-xl focus:outline-none"
            >
              <option value="p">Paragraph</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
              <option value="blockquote">Quote</option>
            </select>

            <select
              value={fontFamily}
              onChange={(e) => applyFontFamily(e.target.value)}
              onMouseDown={(e) => e.preventDefault()}
              className="h-[42px] w-full px-3 text-[12px] font-semibold text-ink bg-white border border-ink/[0.1] rounded-xl focus:outline-none"
            >
              <option value="Inter, sans-serif">Sans</option>
              <option value="Georgia, serif">Serif</option>
              <option value="ui-monospace, SFMono-Regular, Menlo, monospace">Mono</option>
            </select>

            <select
              value={fontSize}
              onChange={(e) => applyFontSize(e.target.value)}
              onMouseDown={(e) => e.preventDefault()}
              className="h-[42px] w-full px-3 text-[12px] font-semibold text-ink bg-white border border-ink/[0.1] rounded-xl focus:outline-none"
            >
              <option value="2">XS</option>
              <option value="3">SM</option>
              <option value="4">Base</option>
              <option value="5">LG</option>
              <option value="6">XL</option>
              <option value="7">2XL</option>
            </select>

            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand('bold')} className={dockButtonClass}>
              <span className="text-[14px] font-bold">B</span>
              <span>Bold</span>
            </button>

            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand('italic')} className={dockButtonClass}>
              <span className="text-[14px] italic">I</span>
              <span>Italic</span>
            </button>

            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand('underline')} className={dockButtonClass}>
              <span className="text-[14px] underline">U</span>
              <span>Underline</span>
            </button>

            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand('insertUnorderedList')} className={dockButtonClass}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="4" cy="6" r="1.5" /><circle cx="4" cy="12" r="1.5" /><circle cx="4" cy="18" r="1.5" /></svg>
              <span>Bullets</span>
            </button>

            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand('insertOrderedList')} className={dockButtonClass}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M4 16c0-1 1-2 2-2s2 1 2 2-1 2-2 2H4l4-4" /></svg>
              <span>Numbered</span>
            </button>

            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand('hiliteColor', '#FFF59D')} className={dockButtonClass}>
              <span className="px-1 rounded bg-yellow-200 text-[12px]">A</span>
              <span>Highlight</span>
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                const enteredUrl = window.prompt('Enter link URL');
                if (!enteredUrl) return;
                const safeUrl = /^https?:\/\//i.test(enteredUrl) ? enteredUrl : `https://${enteredUrl}`;
                runCommand('createLink', safeUrl);
              }}
              className={dockButtonClass}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l2.92-2.92a5 5 0 0 0-7.07-7.07L11.72 5" /><path d="M14 11a5 5 0 0 0-7.54-.54L3.54 13.38a5 5 0 0 0 7.07 7.07L12.28 19" /></svg>
              <span>Link</span>
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => runCommand('unlink')}
              className={dockButtonClass}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 7l-10 10" /><path d="M7 7h5" /><path d="M12 12v5" /></svg>
              <span>Unlink</span>
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={`${dockButtonClass} disabled:opacity-50`}
            >
              {uploading ? <div className="w-3.5 h-3.5 border-2 border-ink/20 border-t-ink rounded-full animate-spin" /> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}
              <span>Upload</span>
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowImageUrlInput((prev) => !prev)}
              className={dockButtonClass}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l2.92-2.92a5 5 0 0 0-7.07-7.07L11.72 5" /><path d="M14 11a5 5 0 0 0-7.54-.54L3.54 13.38a5 5 0 0 0 7.07 7.07L12.28 19" /></svg>
              <span>Image URL</span>
            </button>

            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand('removeFormat')} className={dockButtonClass}>
              <span className="text-[13px]">Tx</span>
              <span>Clear</span>
            </button>
          </div>

          {showImageUrlInput && (
            <div className="mt-3 pt-3 border-t border-ink/[0.08] flex flex-col sm:flex-row gap-2">
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 h-[40px] px-3 text-[13px] text-ink bg-white border border-ink/[0.1] rounded-xl focus:outline-none focus:border-ink/25"
              />
              <button
                type="button"
                onClick={handleImageUrlInsert}
                className="h-[40px] px-4 text-[12px] font-semibold text-white bg-ink rounded-xl hover:opacity-90 transition-opacity"
              >
                Insert Image
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: rgba(30, 31, 38, 0.3);
          pointer-events: none;
        }

        .preview-content {
          font-family: inherit;
          line-height: 1.7;
          color: #1e1f26;
        }

        .preview-content h1,
        .preview-content h2,
        .preview-content h3,
        .preview-content h4,
        .preview-content h5,
        .preview-content h6 {
          font-weight: 700;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          line-height: 1.3;
        }

        .preview-content h1 { font-size: 2em; }
        .preview-content h2 { font-size: 1.5em; }
        .preview-content h3 { font-size: 1.25em; }
        .preview-content h4 { font-size: 1.1em; }

        .preview-content p {
          margin-bottom: 1em;
        }

        .preview-content mark {
          background: #fff59d;
          padding: 0 0.2em;
        }

        .preview-content a {
          color: #05ce78;
          text-decoration: underline;
        }

        .preview-content ul,
        .preview-content ol {
          margin-left: 1.5em;
          margin-bottom: 1em;
        }

        .preview-content li {
          margin-bottom: 0.5em;
        }

        .preview-content img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          margin: 1.5em 0;
        }

        .preview-content blockquote {
          border-left: 4px solid #05ce78;
          padding-left: 1em;
          margin: 1.5em 0;
          font-style: italic;
          color: rgba(30, 31, 38, 0.7);
        }

        .preview-content code {
          background: rgba(30, 31, 38, 0.05);
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }

        .preview-content pre {
          background: rgba(30, 31, 38, 0.05);
          padding: 1em;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5em 0;
        }

        .preview-content pre code {
          background: none;
          padding: 0;
        }

        .preview-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
        }

        .preview-content th,
        .preview-content td {
          border: 1px solid rgba(30, 31, 38, 0.1);
          padding: 0.75em;
          text-align: left;
        }

        .preview-content th {
          background: rgba(30, 31, 38, 0.05);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
