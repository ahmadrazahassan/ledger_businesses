'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useToast } from '@/components/ui/toast';

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

type EditorTab = 'write' | 'html' | 'preview';

type PointerMenu = { clientX: number; clientY: number };

export function RichEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
  className = '',
}: RichEditorProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<EditorTab>('write');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [blockType, setBlockType] = useState('p');
  const [pointerMenu, setPointerMenu] = useState<PointerMenu | null>(null);
  const [showLinkPanel, setShowLinkPanel] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const linkPanelRef = useRef<HTMLDivElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!pointerMenu) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node)) return;
      setPointerMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPointerMenu(null);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [pointerMenu]);

  useEffect(() => {
    if (!showLinkPanel) return;
    const close = (e: MouseEvent) => {
      if (linkPanelRef.current?.contains(e.target as Node)) return;
      setShowLinkPanel(false);
      setLinkUrl('');
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowLinkPanel(false); setLinkUrl(''); }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [showLinkPanel]);

  useEffect(() => {
    if (showLinkPanel && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [showLinkPanel]);

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

  const openPointerMenu = useCallback((clientX: number, clientY: number) => {
    saveSelection();
    const pad = 8;
    const w = 280;
    const h = 320;
    let x = clientX;
    let y = clientY;
    if (x + w > window.innerWidth - pad) x = window.innerWidth - w - pad;
    if (y + h > window.innerHeight - pad) y = window.innerHeight - h - pad;
    x = Math.max(pad, x);
    y = Math.max(pad, y);
    setPointerMenu({ clientX: x, clientY: y });
  }, [saveSelection]);

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
        const result = await uploadToCloudinary(file, { folder: 'posts' });

        if (result.success && result.url) {
          insertImageAtCursor(result.url, 'Uploaded image');
          setPointerMenu(null);
        } else {
          showToast({
            variant: 'error',
            title: 'Image upload failed',
            description: result.error || 'Please try another image file.',
          });
        }
      } catch (error) {
        console.error('Image upload error:', error);
        showToast({
          variant: 'error',
          title: 'Image upload failed',
          description: 'An unexpected upload error occurred.',
        });
      } finally {
        setUploading(false);
      }
    },
    [insertImageAtCursor, showToast]
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
    setPointerMenu(null);
  };

  const insertLink = useCallback((url: string) => {
    if (!url.trim()) return;
    const safeUrl = /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
    focusAndRestoreSelection();
    document.execCommand('createLink', false, safeUrl);
    if (editorRef.current) {
      const anchors = editorRef.current.querySelectorAll(`a[href="${safeUrl}"]`);
      anchors.forEach((a) => {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        (a as HTMLElement).style.color = '#05ce78';
      });
    }
    saveSelection();
    syncContent();
    setLinkUrl('');
    setShowLinkPanel(false);
  }, [focusAndRestoreSelection, saveSelection, syncContent]);

  const openLinkPanel = useCallback(() => {
    saveSelection();
    setShowLinkPanel(true);
    setLinkUrl('');
  }, [saveSelection]);

  const applyBlockType = (value: string) => {
    setBlockType(value);
    runCommand('formatBlock', value);
    setPointerMenu(null);
  };

  const handleEditorContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    openPointerMenu(e.clientX, e.clientY);
  };

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.shiftKey) {
      window.requestAnimationFrame(() => {
        openPointerMenu(e.clientX, e.clientY);
      });
    }
  };

  const dockButtonClass =
    'flex shrink-0 flex-col items-center justify-center gap-0.5 h-11 min-w-[4.25rem] px-2 text-[10px] font-medium text-ink/65 border border-ink/[0.08] rounded-xl bg-white hover:border-ink/20 hover:text-ink transition-all';

  const menuBtnClass =
    'w-full text-left px-3 py-2 text-[13px] text-ink rounded-lg hover:bg-ink/[0.06] transition-colors flex items-center gap-2';

  const renderToolbarButtons = (closePointerMenu?: boolean) => (
    <>
      <select
        value={blockType}
        onChange={(e) => applyBlockType(e.target.value)}
        onMouseDown={(e) => e.preventDefault()}
        className="h-11 shrink-0 min-w-[7.5rem] px-2 text-[11px] font-semibold text-ink bg-white border border-ink/[0.1] rounded-xl focus:outline-none"
      >
        <option value="p">Paragraph</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
        <option value="blockquote">Quote</option>
      </select>

      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { runCommand('bold'); if (closePointerMenu) setPointerMenu(null); }} className={dockButtonClass}>
        <span className="text-[14px] font-bold">B</span>
        <span>Bold</span>
      </button>

      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { runCommand('italic'); if (closePointerMenu) setPointerMenu(null); }} className={dockButtonClass}>
        <span className="text-[14px] italic">I</span>
        <span>Italic</span>
      </button>

      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { runCommand('underline'); if (closePointerMenu) setPointerMenu(null); }} className={dockButtonClass}>
        <span className="text-[14px] underline">U</span>
        <span>Underline</span>
      </button>

      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { runCommand('insertUnorderedList'); if (closePointerMenu) setPointerMenu(null); }} className={dockButtonClass}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="4" cy="6" r="1.5" /><circle cx="4" cy="12" r="1.5" /><circle cx="4" cy="18" r="1.5" /></svg>
        <span>Bullets</span>
      </button>

      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { runCommand('insertOrderedList'); if (closePointerMenu) setPointerMenu(null); }} className={dockButtonClass}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /></svg>
        <span>Numbered</span>
      </button>

      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { runCommand('hiliteColor', '#FFF59D'); if (closePointerMenu) setPointerMenu(null); }} className={dockButtonClass}>
        <span className="px-1 rounded bg-yellow-200 text-[11px]">A</span>
        <span>Highlight</span>
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          openLinkPanel();
          if (closePointerMenu) setPointerMenu(null);
        }}
        className={dockButtonClass}
      >
        <span>Link</span>
      </button>

      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { runCommand('unlink'); if (closePointerMenu) setPointerMenu(null); }} className={dockButtonClass}>
        <span>Unlink</span>
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          fileInputRef.current?.click();
          if (closePointerMenu) setPointerMenu(null);
        }}
        disabled={uploading}
        className={`${dockButtonClass} disabled:opacity-50`}
      >
        {uploading ? <div className="w-3.5 h-3.5 border-2 border-ink/20 border-t-ink rounded-full animate-spin" /> : <span>Upload</span>}
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          setShowImageUrlInput((p) => !p);
          if (closePointerMenu) setPointerMenu(null);
        }}
        className={dockButtonClass}
      >
        <span>Image URL</span>
      </button>

      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { runCommand('removeFormat'); if (closePointerMenu) setPointerMenu(null); }} className={dockButtonClass}>
        <span>Clear</span>
      </button>
    </>
  );

  return (
    <div className={`${className} relative`}>
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
          <p className="text-[11px] text-ink/45 max-w-[14rem] sm:max-w-none text-right sm:text-left">
            Toolbar stays at bottom while you scroll. Right‑click or Shift+click for quick actions.
          </p>
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
          onContextMenu={handleEditorContextMenu}
          onClick={handleEditorClick}
          className={`w-full min-h-[400px] px-6 py-5 bg-white border rounded-2xl text-[15px] text-ink leading-relaxed focus:outline-none focus:border-ink/20 focus:ring-4 focus:ring-ink/[0.03] transition-all overflow-auto ${
            isDragging ? 'border-accent border-2 bg-accent/[0.02]' : 'border-ink/[0.08]'
          }`}
          data-placeholder={placeholder}
          style={{
            minHeight: '400px',
            fontFamily: 'inherit',
            paddingBottom: '5.5rem',
          }}
        />
      )}

      {pointerMenu && activeTab === 'write' && (
        <div
          ref={menuRef}
          className="fixed z-[100] w-[min(18rem,calc(100vw-1rem))] rounded-2xl border border-ink/[0.12] bg-white py-2 shadow-xl"
          style={{ left: pointerMenu.clientX, top: pointerMenu.clientY }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-ink/40">Quick actions</p>
          <button
            type="button"
            className={menuBtnClass}
            onClick={() => {
              fileInputRef.current?.click();
              setPointerMenu(null);
            }}
            disabled={uploading}
          >
            <span className="font-mono text-[11px] text-ink/50">IMG</span>
            Upload image (Cloudinary)
          </button>
          <button
            type="button"
            className={menuBtnClass}
            onClick={() => {
              const url = window.prompt('Image URL');
              if (url?.trim()) insertImageAtCursor(url.trim(), 'Image');
              setPointerMenu(null);
            }}
          >
            Image from URL
          </button>
          <div className="my-1 border-t border-ink/[0.06]" />
          <button type="button" className={menuBtnClass} onClick={() => { runCommand('bold'); setPointerMenu(null); }}>
            Bold
          </button>
          <button type="button" className={menuBtnClass} onClick={() => { runCommand('italic'); setPointerMenu(null); }}>
            Italic
          </button>
          <button type="button" className={menuBtnClass} onClick={() => { applyBlockType('h2'); }}>
            Heading 2
          </button>
          <button type="button" className={menuBtnClass} onClick={() => { applyBlockType('h3'); }}>
            Heading 3
          </button>
          <button type="button" className={menuBtnClass} onClick={() => { runCommand('insertUnorderedList'); setPointerMenu(null); }}>
            Bullet list
          </button>
          <button type="button" className={menuBtnClass} onClick={() => { runCommand('insertOrderedList'); setPointerMenu(null); }}>
            Numbered list
          </button>
          <button
            type="button"
            className={menuBtnClass}
            onClick={() => {
              openLinkPanel();
              setPointerMenu(null);
            }}
          >
            Add link
          </button>
        </div>
      )}

      {showLinkPanel && activeTab === 'write' && (
        <div
          ref={linkPanelRef}
          className="fixed bottom-0 left-0 right-0 z-[95] border-t border-ink/[0.08] bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.08)]"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="mx-auto max-w-4xl px-4 py-3">
            <p className="text-[11px] font-bold text-ink/40 uppercase tracking-[0.08em] mb-2">Insert link</p>
            <div className="flex items-center gap-2">
              <input
                ref={linkInputRef}
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); insertLink(linkUrl); } }}
                placeholder="Paste or type a URL"
                className="h-10 flex-1 rounded-xl border border-ink/[0.1] bg-ink/[0.02] px-4 text-[13px] text-ink placeholder:text-ink/30 focus:border-ink/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink/[0.04] transition-all"
              />
              <button
                type="button"
                onClick={() => insertLink(linkUrl)}
                disabled={!linkUrl.trim()}
                className="h-10 shrink-0 rounded-xl bg-ink px-5 text-[12px] font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => { setShowLinkPanel(false); setLinkUrl(''); }}
                className="h-10 shrink-0 rounded-xl border border-ink/[0.08] bg-white px-4 text-[12px] font-semibold text-ink/50 hover:text-ink hover:border-ink/15 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'write' && (
        <div
          className="fixed bottom-0 left-0 right-0 z-[90] border-t border-ink/[0.08] bg-white/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.06)] safe-area-pb"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <div className="mx-auto max-w-4xl px-2 py-2">
            {showImageUrlInput && (
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="h-10 flex-1 rounded-xl border border-ink/[0.1] px-3 text-[13px] text-ink focus:border-ink/25 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleImageUrlInsert}
                  className="h-10 shrink-0 rounded-xl bg-ink px-4 text-[12px] font-semibold text-white hover:opacity-90"
                >
                  Insert image
                </button>
              </div>
            )}
            <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:thin]">
              {renderToolbarButtons(true)}
            </div>
          </div>
        </div>
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

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: rgba(30, 31, 38, 0.3);
          pointer-events: none;
        }

        [contenteditable] a {
          color: #05ce78;
          text-decoration: none;
          border-bottom: 1px solid rgba(5, 206, 120, 0.3);
          transition: border-color 0.15s;
        }

        [contenteditable] a:hover {
          border-bottom-color: #05ce78;
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
