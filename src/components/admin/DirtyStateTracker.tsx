'use client';

import { useEffect } from 'react';

export default function DirtyStateTracker() {
  useEffect(() => {
    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' || 
        target.isContentEditable
      ) {
        // If it's a search input, ignore
        if (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'search') return;
        
        (window as any).__isFormDirty = true;
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if ((window as any).__isFormDirty) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome to show prompt
      }
    };

    // We can clear dirty state globally when any submit button is clicked, or any specific save button
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Intercept link clicks for client-side navigation
      const anchor = target.closest('a');
      if (anchor && anchor.href && (window as any).__isFormDirty) {
        // Ignore hash links or new tabs
        if (anchor.getAttribute('href')?.startsWith('#')) return;
        if (anchor.target === '_blank') return;
        
        const confirmed = window.confirm('Du har osparade ändringar. Är du säker på att du vill lämna sidan?');
        if (!confirmed) {
          e.preventDefault();
          e.stopPropagation();
          return; // Stop event propagation
        } else {
          (window as any).__isFormDirty = false;
        }
      }

      const button = target.closest('button');
      if (button) {
        // If the button has "Spara" in its text or is a submit button
        if (button.type === 'submit' || button.textContent?.toLowerCase().includes('spara')) {
          (window as any).__isFormDirty = false;
        }
      }
    };

    window.addEventListener('input', handleInput, true);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('input', handleInput, true);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('click', handleClick, true);
    };
  }, []);

  return null;
}
