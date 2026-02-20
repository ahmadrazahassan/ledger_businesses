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
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync content from parent to editor when switching tabs or initial load
  useEffect(() => {
    if (activeTab === 'write' && editorRef.current) {
      // Only update if content is different to avoid cursor issues
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [activeTab, value]);

  // Sync editor content to parent
  const syncContent = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      // Only update if content actually changed
      if (html !== value) {
        onChange(html);
      }
    }
  }, [onChange, value]);

  // Upload image and insert into editor
  const insertImage = useCallback(
    async (file: File) => {
      if (!editorRef.current) return;

      setUploading(true);
      try {
        const result = await uploadImageWithCompression(file, 'covers', 'posts');

        if (result.success && result.url) {
          // Focus editor
          editorRef.current.focus();

          // Get selection
          const sel = window.getSelection();
          if (!sel || sel.rangeCount === 0) {
            // If no selection, append to end
            const img = document.createElement('img');
            img.src = result.url;
            img.className = 'max-w-full h-auto rounded-2xl my-4';
            img.alt = 'Uploaded image';
            editorRef.current.appendChild(img);
          } else {
            // Insert at cursor position
            const range = sel.getRangeAt(0);
            range.deleteContents();

            const img = document.createElement('img');
            img.src = result.url;
            img.className = 'max-w-full h-auto rounded-2xl my-4';
            img.alt = 'Uploaded image';

            const wrapper = document.createElement('div');
            wrapper.className = 'my-4';
            wrapper.appendChild(img);

            range.insertNode(wrapper);

            // Move cursor after image
            const newRange = document.createRange();
            newRange.setStartAfter(wrapper);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
          }

          syncContent();
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
    [syncContent]
  );

  // Handle paste with images
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) insertImage(file);
          return;
        }
      }
    },
    [insertImage]
  );

  // Handle drag and drop
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer?.files;
      if (!files) return;

      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/')) {
          insertImage(files[i]);
          break; // Only insert first image
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

  // Handle file input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      insertImage(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={className}>
      {/* Tabs */}
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
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-ink/60 bg-white border border-ink/[0.08] rounded-full hover:border-ink/15 hover:text-ink transition-all duration-200 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                Insert Image
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Write Tab - ContentEditable */}
      {activeTab === 'write' && (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={syncContent}
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

      {/* HTML Tab - Textarea */}
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

      {/* Preview Tab - Isolated Styles */}
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
        <p className="mt-3 text-[12px] text-ink/40">
          Paste, drag, or click "Insert Image" to add images to your content
        </p>
      )}

      {/* Scoped styles for preview only */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: rgba(30, 31, 38, 0.3);
          pointer-events: none;
        }

        /* Preview content styles - isolated to preview tab only */
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
