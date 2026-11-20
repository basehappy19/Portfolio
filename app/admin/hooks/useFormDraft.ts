'use client';

import { useEffect, useState, useCallback } from 'react';

export interface DraftPackage<TForm, TLinks> {
  formData: TForm;
  links: TLinks;
  timestamp: string;
}

type LooseDraft = { formData?: Record<string, unknown>; links?: unknown } | null | undefined;

function isDraftPackageEmpty(raw: unknown): boolean {
  const pkg = raw as LooseDraft;
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

function getDraftPreviewText(raw: unknown): string {
  const pkg = raw as LooseDraft;
  if (!pkg || !pkg.formData) return '';
  const f = pkg.formData;
  if (typeof f.title_th === 'string' && f.title_th.trim()) return f.title_th.trim();
  if (typeof f.title_en === 'string' && f.title_en.trim()) return f.title_en.trim();
  if (typeof f.description_th === 'string' && f.description_th.trim()) return f.description_th.trim().slice(0, 50);
  if (typeof f.description_en === 'string' && f.description_en.trim()) return f.description_en.trim().slice(0, 50);
  if (Array.isArray(pkg.links) && pkg.links.length > 0) return `ลิงก์แนบ (${pkg.links.length} รายการ)`;
  return 'ข้อมูลผลงาน';
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
  const [draftPreview, setDraftPreview] = useState<string | null>(null);

  // Check draft on mount or key change (reads localStorage, an external store)
  /* eslint-disable react-hooks/set-state-in-effect */
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
          setDraftPreview(getDraftPreviewText(parsed));
        } else {
          localStorage.removeItem(key);
          setHasDraft(false);
          setDraftTime(null);
          setDraftPreview(null);
        }
      } else {
        setHasDraft(false);
        setDraftTime(null);
        setDraftPreview(null);
      }
    } catch {
      setHasDraft(false);
      setDraftPreview(null);
    }
  // initialComparisonData is a snapshot taken when the editor opens
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  /* eslint-enable react-hooks/set-state-in-effect */

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
        setDraftPreview(getDraftPreviewText(pkg));
      } else if (isIdenticalToInitial) {
        localStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
  // initialComparisonData is a snapshot taken when the editor opens
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          setDraftPreview(getDraftPreviewText(pkg));
        } else if (isIdenticalToInitial) {
          localStorage.removeItem(key);
        }
      } catch {
        // ignore storage errors
      }
    }, 600);

    return () => clearTimeout(timer);
  // initialComparisonData is a snapshot taken when the editor opens
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setDraftPreview(null);
        return null;
      }
      setHasDraft(false);
      setDraftPreview(null);
      return { formData: parsed.formData, links: parsed.links };
    } catch {
      return null;
    }
  // initialComparisonData is a snapshot taken when the editor opens
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
      setHasDraft(false);
      setDraftTime(null);
      setDraftPreview(null);
    } catch {
      // ignore
    }
  }, [key]);

  return {
    hasDraft,
    draftTime,
    draftPreview,
    restoreDraft,
    saveDraftNow,
    clearDraft,
  };
}
