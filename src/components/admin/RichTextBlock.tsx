'use client';

import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, ExternalLink, Trash2, Unlink, X, Check, Compass } from 'lucide-react';

export default function RichTextBlock({ 
  initialContent, 
  onChange, 
  onRemove,
  onMoveUp,
  onMoveDown,
  type
}: { 
  initialContent: string; 
  onChange: (content: string) => void; 
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  type: 'h2' | 'h3' | 'text';
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const initialContentRef = useRef(initialContent);

  // Link modal state
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isEditingExistingLink, setIsEditingExistingLink] = useState(false);
  const savedSelectionRef = useRef<Range | null>(null);
  const currentLinkNodeRef = useRef<HTMLAnchorElement | null>(null);

  // Quick link suggestions for internal pages
  const quickLinks = [
    { label: 'Produkter', url: 'produkter' },
    { label: 'Recept', url: 'recept' },
    { label: 'Nyheter', url: 'nyheter' },
    { label: 'Kontakt', url: 'kontakt' },
    { label: 'Om oss', url: 'om-oss' },
    { label: 'Hitta oss', url: 'hitta-oss' },
  ];

  // Format commands
  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const openLinkModal = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
      
      // Check if cursor is inside an existing anchor tag
      let node: Node | null = selection.anchorNode;
      let anchor: HTMLAnchorElement | null = null;
      while (node && node !== editorRef.current) {
        if (node.nodeName === 'A') {
          anchor = node as HTMLAnchorElement;
          break;
        }
        node = node.parentNode;
      }
      
      if (anchor) {
        currentLinkNodeRef.current = anchor;
        setIsEditingExistingLink(true);
        setLinkText(anchor.textContent || '');
        setLinkUrl(anchor.getAttribute('href') || '');
      } else {
        currentLinkNodeRef.current = null;
        setIsEditingExistingLink(false);
        const selectedStr = selection.toString();
        setLinkText(selectedStr);
        setLinkUrl(selectedStr.startsWith('http') ? selectedStr : '');
      }
    } else {
      savedSelectionRef.current = null;
      currentLinkNodeRef.current = null;
      setIsEditingExistingLink(false);
      setLinkText('');
      setLinkUrl('');
    }
    setLinkModalOpen(true);
  };

  const applyLink = () => {
    let url = linkUrl.trim();
    if (!url) return;

    if (currentLinkNodeRef.current) {
      // Update existing anchor
      currentLinkNodeRef.current.setAttribute('href', url);
      if (linkText.trim()) {
        currentLinkNodeRef.current.textContent = linkText.trim();
      }
      if (url.startsWith('http://') || url.startsWith('https://')) {
        currentLinkNodeRef.current.setAttribute('target', '_blank');
        currentLinkNodeRef.current.setAttribute('rel', 'noopener noreferrer');
      } else {
        currentLinkNodeRef.current.removeAttribute('target');
        currentLinkNodeRef.current.removeAttribute('rel');
      }
    } else if (savedSelectionRef.current) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelectionRef.current);
      }

      if (savedSelectionRef.current.toString().trim() === '') {
        // No text was selected: insert a brand new anchor element
        const a = document.createElement('a');
        a.href = url;
        a.textContent = linkText.trim() || url;
        if (url.startsWith('http://') || url.startsWith('https://')) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
        savedSelectionRef.current.deleteContents();
        savedSelectionRef.current.insertNode(a);
        
        // Put cursor after the link with a space
        const space = document.createTextNode('\u00A0');
        if (a.nextSibling) {
          a.parentNode?.insertBefore(space, a.nextSibling);
        } else {
          a.parentNode?.appendChild(space);
        }
        const newRange = document.createRange();
        newRange.setStartAfter(space);
        newRange.setEndAfter(space);
        selection?.removeAllRanges();
        selection?.addRange(newRange);
      } else {
        // Text was selected: use createLink
        document.execCommand('createLink', false, url);
        if (url.startsWith('http://') || url.startsWith('https://')) {
          const anchor = selection?.anchorNode?.parentElement;
          if (anchor && anchor.tagName === 'A') {
            anchor.setAttribute('target', '_blank');
            anchor.setAttribute('rel', 'noopener noreferrer');
          }
        }
      }
    }

    setLinkModalOpen(false);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const removeLink = () => {
    if (currentLinkNodeRef.current) {
      const text = document.createTextNode(currentLinkNodeRef.current.textContent || '');
      currentLinkNodeRef.current.parentNode?.replaceChild(text, currentLinkNodeRef.current);
    } else {
      document.execCommand('unlink', false);
    }
    setLinkModalOpen(false);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor) {
      e.preventDefault();
      e.stopPropagation();
      currentLinkNodeRef.current = anchor as HTMLAnchorElement;
      setIsEditingExistingLink(true);
      setLinkText(anchor.textContent || '');
      setLinkUrl(anchor.getAttribute('href') || '');
      setLinkModalOpen(true);
    }
  };

  const ToolbarButton = ({ icon: Icon, command, value, onClick, title, active }: any) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent losing focus
        if (onClick) onClick();
        else execCommand(command, value);
      }}
      className={`p-1.5 rounded transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML === '') {
      editorRef.current.innerHTML = initialContentRef.current;
    }
  }, []);

  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 overflow-hidden">
      
      {/* Top Toolbar */}
      <div className="flex items-center gap-1 bg-slate-50 border-b border-slate-200 px-3 py-2 flex-wrap">
        <ToolbarButton icon={Bold} command="bold" title="Fetstil (Ctrl+B)" />
        <ToolbarButton icon={Italic} command="italic" title="Kursiv (Ctrl+I)" />
        
        <div className="w-px h-5 bg-slate-200 mx-2" />
        
        <ToolbarButton icon={List} command="insertUnorderedList" title="Punktlista" />
        <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numrerad lista" />
        
        <div className="w-px h-5 bg-slate-200 mx-2" />
        
        <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Vänsterjustera" />
        <ToolbarButton icon={AlignCenter} command="justifyCenter" title="Centrera" />
        <ToolbarButton icon={AlignRight} command="justifyRight" title="Högerjustera" />
        
        <div className="w-px h-5 bg-slate-200 mx-2" />
        
        <button
          type="button"
          onClick={openLinkModal}
          title="Infoga eller redigera länk"
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Länk</span>
        </button>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 bg-slate-100 py-0.5 rounded">{type}</span>
          {onMoveUp && (
            <button type="button" onClick={onMoveUp} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Flytta upp">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
            </button>
          )}
          {onMoveDown && (
            <button type="button" onClick={onMoveDown} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Flytta ner">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          )}
          <button 
            type="button" 
            onClick={onRemove} 
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors ml-1"
            title="Ta bort block"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Link Edit Modal / Popover */}
      {linkModalOpen && (
        <div className="p-4 bg-emerald-50/70 border-b border-emerald-200 transition-all animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
              <LinkIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isEditingExistingLink ? 'Redigera Länk' : 'Infoga Ny Länk'}</span>
            </div>
            <button 
              type="button" 
              onClick={() => setLinkModalOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Synlig Länktext</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="T.ex. Klicka här, Våra produkter..."
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Länk-adress (URL eller intern sida)
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="T.ex. produkter, /kontakt, https://..."
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                autoFocus
              />
            </div>
          </div>

          {/* Quick suggestions for internal links */}
          <div className="flex items-center gap-1.5 flex-wrap mb-3 text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1 mr-1">
              <Compass className="w-3 h-3 text-slate-400" /> Internlänkar:
            </span>
            {quickLinks.map(ql => (
              <button
                key={ql.url}
                type="button"
                onClick={() => {
                  setLinkUrl(ql.url);
                  if (!linkText) setLinkText(ql.label);
                }}
                className="px-2 py-0.5 bg-white hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded text-xs transition-colors"
              >
                {ql.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            {isEditingExistingLink ? (
              <button
                type="button"
                onClick={removeLink}
                className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Ta bort länk</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={applyLink}
                disabled={!linkUrl.trim()}
                className="flex items-center gap-1 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isEditingExistingLink ? 'Spara ändring' : 'Lägg till länk'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="p-5">
        <div
          ref={editorRef}
          contentEditable={true}
          suppressContentEditableWarning
          onClick={handleEditorClick}
          className={`w-full focus:outline-none min-h-[40px] empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300 [&_a]:text-[#4d8e00] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-[#64b000] [&_a]:decoration-2 [&_a]:font-semibold [&_a]:cursor-pointer hover:[&_a]:text-[#3b6d00] ${
            type === 'h2' ? 'text-4xl font-extrabold font-outfit !text-slate-900' :
            type === 'h3' ? 'text-xl font-bold font-outfit !text-slate-900' :
            'text-base text-slate-700 leading-relaxed'
          }`}
          data-placeholder={
            type === 'h2' ? 'Skriv H2 rubrik här...' : 
            type === 'h3' ? 'Skriv H3 rubrik här...' : 
            'Skriv din brödtext här... Markera text och tryck Länk för att lägga till länkar.'
          }
          onInput={() => {
            if (editorRef.current) {
              onChange(editorRef.current.innerHTML);
            }
          }}
        />
      </div>
      
    </div>
  );
}
