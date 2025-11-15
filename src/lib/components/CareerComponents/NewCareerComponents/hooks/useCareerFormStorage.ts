import { useEffect, useRef } from "react";

// Global flag to disable beforeunload warning when submitting
let isSubmittingForm = false;

/**
 * Hook to manage session storage and change tracking for career form
 */
export function useCareerFormStorage(
  storageKey: string,
  formState: any,
  hasChanges: boolean,
  setHasChanges: (value: boolean) => void,
  baselineRef: React.MutableRefObject<any>
) {
  /**
   * Load form state from session storage on mount
   */
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      // Initialize hasChanges flag
      if (!sessionStorage.getItem('hasChanges')) {
        sessionStorage.setItem('hasChanges', 'false');
      }
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const data = JSON.parse(raw);
        // Return data to be applied by parent component
        return data;
      }
    } catch {}
  }, []);

  /**
   * Save form state to session storage whenever it changes
   */
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      sessionStorage.setItem(storageKey, JSON.stringify(formState));
    } catch {}
  }, [formState, storageKey]);

  /**
   * Track changes against baseline
   */
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;

      if (!baselineRef.current) {
        baselineRef.current = formState;
        return;
      }

      const base = baselineRef.current;
      const keys = Object.keys(base);
      let dirty = false;
      
      for (const k of keys) {
        const a = base[k];
        const b = formState[k];
        const isArray = Array.isArray(a) || Array.isArray(b);
        
        if (isArray) {
          if (JSON.stringify(a) !== JSON.stringify(b)) {
            dirty = true;
            break;
          }
        } else if (a !== b) {
          dirty = true;
          break;
        }
      }
      
      setHasChanges(dirty);
      sessionStorage.setItem('hasChanges', dirty ? 'true' : 'false');
    } catch {}
  }, [formState, baselineRef, setHasChanges]);

  /**
   * Warn user before leaving with unsaved changes
   * Check both global flag and sessionStorage
   */
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      // Check global flag first - if submitting, skip warning
      if (isSubmittingForm) {
        return;
      }
      
      try {
        // Check sessionStorage directly for the most up-to-date value
        const hasUnsavedChanges = sessionStorage.getItem('hasChanges') === 'true';
        if (hasUnsavedChanges) {
          e.preventDefault();
          e.returnValue = '';
        }
      } catch {}
    };
    
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []); // Empty deps - handler always checks fresh values

  /**
   * Handle browser back button
   */
  useEffect(() => {
    const onPopState = () => {
      try {
        if (typeof window === 'undefined') return;
        const dirty = sessionStorage.getItem('hasChanges') === 'true';
        if (dirty) {
          const confirmed = window.confirm(
            "You have unsaved changes. Are you sure you want to leave this page?"
          );
          if (!confirmed) {
            history.go(1);
          }
        }
      } catch {}
    };
    
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  /**
   * Clean up session storage on page hide
   */
  useEffect(() => {
    const onPageHide = () => {
      try {
        sessionStorage.removeItem('hasChanges');
        sessionStorage.removeItem(storageKey);
      } catch {}
    };
    
    window.addEventListener('pagehide', onPageHide);
    return () => window.removeEventListener('pagehide', onPageHide);
  }, [storageKey]);

  /**
   * Clean up on unmount
   */
  useEffect(() => {
    return () => {
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('hasChanges');
          sessionStorage.removeItem(storageKey);
        }
      } catch {}
    };
  }, [storageKey]);
}

/**
 * Call this function to disable the beforeunload warning when submitting the form
 */
export function disableBeforeUnloadWarning() {
  isSubmittingForm = true;
}
