'use client';

import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, ExternalLink, Trash2 } from 'lucide-react';

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

  // Format commands
  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    const url = prompt('Skriv in länk (URL):', 'https://');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const ToolbarButton = ({ icon: Icon, command, value, onClick }: any) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent losing focus
        if (onClick) onClick();
        else execCommand(command, value);
      }}
      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 overflow-hidden">
      
      {/* Top Toolbar */}
      <div className="flex items-center gap-1 bg-slate-50 border-b border-slate-200 px-3 py-2">
        <ToolbarButton icon={Bold} command="bold" />
        <ToolbarButton icon={Italic} command="italic" />
        
        <div className="w-px h-5 bg-slate-200 mx-2" />
        
        <ToolbarButton icon={List} command="insertUnorderedList" />
        <ToolbarButton icon={ListOrdered} command="insertOrderedList" />
        
        <div className="w-px h-5 bg-slate-200 mx-2" />
        
        <ToolbarButton icon={AlignLeft} command="justifyLeft" />
        <ToolbarButton icon={AlignCenter} command="justifyCenter" />
        <ToolbarButton icon={AlignRight} command="justifyRight" />
        
        <div className="w-px h-5 bg-slate-200 mx-2" />
        
        <ToolbarButton icon={LinkIcon} onClick={handleLink} />
        <ToolbarButton icon={ExternalLink} onClick={handleLink} />
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">{type}</span>
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

      {/* Content Area */}
      <div className="p-5">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className={`w-full focus:outline-none min-h-[40px] empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300 ${
            type === 'h2' ? 'text-3xl font-extrabold font-outfit text-slate-900' :
            type === 'h3' ? 'text-xl font-bold font-outfit text-slate-900' :
            'text-base text-slate-600 leading-relaxed'
          }`}
          data-placeholder={
            type === 'h2' ? 'Skriv H2 rubrik här...' : 
            type === 'h3' ? 'Skriv H3 rubrik här...' : 
            'Skriv din brödtext här...'
          }
          onBlur={() => {
            if (editorRef.current) {
              onChange(editorRef.current.innerHTML);
            }
          }}
          onInput={() => {
             // Let react know on every input so it saves properly
             if (editorRef.current) {
               onChange(editorRef.current.innerHTML);
             }
          }}
          dangerouslySetInnerHTML={{ __html: initialContentRef.current }}
        />
      </div>
      
      {/* Minimal CSS for generated lists since Tailwind resets them */}
      <style jsx global>{`
        div[contenteditable] ul { list-style-type: disc; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        div[contenteditable] ol { list-style-type: decimal; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        div[contenteditable] a { color: #2563eb; text-decoration: underline; }
      `}</style>
    </div>
  );
}
