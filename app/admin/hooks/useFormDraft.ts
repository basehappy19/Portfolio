'use client';

import { useEffect, useState, useCallback } from 'react';

export interface DraftPackage<TForm, TLinks> {
  formData: TForm;
  links: TLinks;
  timestamp: string;
}

function isDraftPackageEmpty(pkg: any): boolean {
  if (!pkg || !pkg.formData) return true;
  const f = pkg.formData;
  const hasContent = Boolean(
    (f.title_th && typeof f.title_th === 'string' && f.title_th.trim()) ||
    (f.title_en && typeof f.title_en === 'string' && f.title_en.trim()) ||
    (f.description_th && typeof f.description_th === 'string' && f.description_th.trim()) ||
    (f.description_en && typeof f.description_en === 'string' && f.description_en.trim()) ||
    (Array.isArray(pkg.links) && pkg.links.length > 0)
  );
  return !hasContent;
}

export function useFormDraft<TForm, TLinks>(
  key: string,
  formData: TForm,
  links: TLinks,
  enabled: boolean = true,
  initialComparisonData?: { formData: TForm; links: TLinks }
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
        const isIdenticalToInitial = initialComparisonData
          ? JSON.stringify(parsed.formData) === JSON.stringify(initialComparisonData.formData) &&
            JSON.stringify(parsed.links) === JSON.stringify(initialComparisonData.links)
          : false;

        if (parsed && parsed.timestamp && !isDraftPackageEmpty(parsed) && !isIdenticalToInitial) {
          setHasDraft(true);
          setDraftTime(parsed.timestamp);
        } else {
          localStorage.removeItem(key);
          setHasDraft(false);
          setDraftTime(null);
        }
      } else {
        setHasDraft(false);
        setDraftTime(null);
      }
    } catch {
      setHasDraft(false);
    }
  }, [key]);

  const saveDraftNow = useCallback(() => {
    if (!enabled || typeof window === 'undefined') return;
    try {
      const pkg: DraftPackage<TForm, TLinks> = {
        formData,
        links,
        timestamp: new Date().toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      const isIdenticalToInitial = initialComparisonData
        ? JSON.stringify(pkg.formData) === JSON.stringify(initialComparisonData.formData) &&
          JSON.stringify(pkg.links) === JSON.stringify(initialComparisonData.links)
        : false;

      if (!isDraftPackageEmpty(pkg) && !isIdenticalToInitial) {
        localStorage.setItem(key, JSON.stringify(pkg));
        setHasDraft(true);
      } else if (isIdenticalToInitial) {
        localStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
  }, [key, formData, links, enabled]);

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
        const isIdenticalToInitial = initialComparisonData
          ? JSON.stringify(pkg.formData) === JSON.stringify(initialComparisonData.formData) &&
            JSON.stringify(pkg.links) === JSON.stringify(initialComparisonData.links)
          : false;

        if (!isDraftPackageEmpty(pkg) && !isIdenticalToInitial) {
          localStorage.setItem(key, JSON.stringify(pkg));
        } else if (isIdenticalToInitial) {
          localStorage.removeItem(key);
        }
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
      const isIdenticalToInitial = initialComparisonData
        ? JSON.stringify(parsed.formData) === JSON.stringify(initialComparisonData.formData) &&
          JSON.stringify(parsed.links) === JSON.stringify(initialComparisonData.links)
        : false;

      if (isDraftPackageEmpty(parsed) || isIdenticalToInitial) {
        localStorage.removeItem(key);
        setHasDraft(false);
        return null;
      }
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
    saveDraftNow,
    clearDraft,
  };
}
