'use client';

import { useEffect, useState, useCallback } from 'react';

export interface DraftPackage<TForm, TLinks> {
  formData: TForm;
  links: TLinks;
  timestamp: string;
}

export function useFormDraft<TForm, TLinks>(
  key: string,
  formData: TForm,
  links: TLinks,
  enabled: boolean = true
) {
  const [hasDraft, setHasDraft] = useState(false);
  const [draftTime, setDraftTime] = useState<string | null>(null);

  // Check draft on mount or key change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed: DraftPackage<TForm, TLinks> = JSON.parse(saved);
        if (parsed && parsed.timestamp) {
          setHasDraft(true);
          setDraftTime(parsed.timestamp);
        }
      } else {
        setHasDraft(false);
        setDraftTime(null);
      }
    } catch {
      setHasDraft(false);
    }
  }, [key]);

  // Auto save draft on form change with debounce
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    if (hasDraft && !enabled) return;

    const timer = setTimeout(() => {
      try {
        const pkg: DraftPackage<TForm, TLinks> = {
          formData,
          links,
          timestamp: new Date().toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        localStorage.setItem(key, JSON.stringify(pkg));
      } catch {
        // ignore storage errors
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [key, formData, links, enabled, hasDraft]);

  const restoreDraft = useCallback((): {
    formData: TForm;
    links: TLinks;
  } | null => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return null;
      const parsed: DraftPackage<TForm, TLinks> = JSON.parse(saved);
      setHasDraft(false);
      return { formData: parsed.formData, links: parsed.links };
    } catch {
      return null;
    }
  }, [key]);

  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
      setHasDraft(false);
      setDraftTime(null);
    } catch {
      // ignore
    }
  }, [key]);

  return {
    hasDraft,
    draftTime,
    restoreDraft,
    clearDraft,
  };
}
