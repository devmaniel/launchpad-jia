"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type OptionItem = {
  label: string;
  value: string;
  icon?: string;
};

interface DropDownOptionProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  containerStyle?: React.CSSProperties;
  options?: OptionItem[];
  disabled?: boolean;
  hasError?: boolean;
  animated?: boolean;
}

const DEFAULT_OPTIONS: OptionItem[] = [
  { label: "Short Answer", value: "short_answer", icon: "/icons/list-for-dropdown.svg" },
  { label: "Long Answer", value: "long_answer", icon: "/icons/list-for-dropdown.svg" },
  { label: "Dropdown", value: "dropdown", icon: "/icons/expand_circle_down.svg" },
  { label: "Checkboxes", value: "checkboxes", icon: "/temp/checkbox-svgrepo-com.svg" },
  { label: "Range", value: "range", icon: "/icons/123-range-for-dropdown.svg" },
];

const DropDownOption: React.FC<DropDownOptionProps> = ({
  value,
  onChange,
  placeholder = "Select option",
  containerStyle,
  options,
  disabled,
  hasError,
  animated = true,
}) => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const list = useMemo(() => options && options.length ? options : DEFAULT_OPTIONS, [options]);
  const selected = useMemo(() => list.find((o) => o.value === value), [list, value]);
  const isDisabled = disabled || list.length === 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const top = rect.bottom + 4;
      const left = Math.max(8, rect.left);
      const rightPadding = 8;
      const maxWidth = Math.min(rect.width, Math.max(0, window.innerWidth - left - rightPadding));
      setMenuPos({ top, left, width: maxWidth });
    };
    updatePosition();
    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll as EventListener);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <div
      className="dropdown w-100"
      ref={ref}
      style={{
        ...containerStyle,
        position: "relative",
        border: "1px solid #D5D7DA !important",
        cursor: isDisabled ? 'not-allowed' : (containerStyle?.cursor as any),
        userSelect: isDisabled ? 'none' : (containerStyle?.userSelect as any),
      }}
    >
      <button
        type="button"
        className="dropdown-btn"
        disabled={isDisabled}
        onClick={() => { if (!isDisabled) setOpen((v) => !v); }}
        style={{
          width: "100%",
          textTransform: "none",
          border: hasError ? "1px solid #FDA29B !important" : undefined,
          borderColor: hasError ? "#FDA29B !important" : undefined,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.8 : 1,
        } as React.CSSProperties}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8, color: selected ? "#333" : "#717680" }}>
          {selected?.icon && (
            <img src={selected.icon} alt="icon" width={20} height={20} style={{ objectFit: "contain" }} />
          )}
          {selected?.label || placeholder}
        </span>
        <img 
          src="/icons/chevron.svg" 
          alt="dropdown-arrow" 
          width={17}
          height={20}
          style={{
            transform: open ? 'rotate(180deg)' : 'none',
            marginLeft: '8px',
            flexShrink: 0
          }} 
        />
      </button>

      {open && menuPos && createPortal(
        (
          <div
            className="dropdown-menu mt-1"
            style={{
              padding: 0,
              maxHeight: 240,
              overflowY: "auto",
              position: "fixed",
              top: menuPos.top,
              left: menuPos.left,
              zIndex: 1000,
              width: menuPos.width,
              border: "1px solid #F5F5F5",
              boxShadow:
                "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
              display: open ? 'block' : 'none',
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {list.map((item) => {
              const isActive = item.value === value;
              const isHovered = hovered === item.value;
              return (
                <div key={item.value} >
                  <button
                    type="button"
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => {
                      onChange?.(item.value);
                      setOpen(false);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onMouseEnter={() => setHovered(item.value)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      minWidth: 220,
                      borderRadius: isActive ? 0 : 10,
                      overflow: "hidden",
                      paddingBottom: 10,
                      paddingTop: 10,
                      color: "#181D27",
                      fontWeight: isActive || isHovered ? 600 : 400,
                      background: isActive || isHovered ? "#FAFAFA" : "transparent",
                      transition: "background-color 0.15s ease, font-weight 0.15s ease",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      whiteSpace: "wrap",
                      textTransform: "none",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                      {item.icon && (
                        <img src={item.icon} alt="icon" width={20} height={20} style={{}} />
                      )}
                      {item.label}
                    </div>
                    {isActive && (
                      <img
                        src="/icons/check-blue.svg"
                        alt="selected"
                        width={20}
                        height={20}
                        style={{ objectFit: "contain" }}
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ),
        document.body
      )}
    </div>
  );
};

export default DropDownOption;