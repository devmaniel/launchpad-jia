"use client";

import React, { useRef, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

export default function RichTextEditor({setText, text, error = false, errorMessage = "This is a required field.", onBlur}: { setText: (value: string) => void; text: string; error?: boolean; errorMessage?: string; onBlur?: () => void; }) {
    const descriptionEditorRef = useRef(null);
    const [isEditorFocused, setIsEditorFocused] = useState(false);
    const [isToolbarHovered, setIsToolbarHovered] = useState(false);
    const isActive = !error && (isEditorFocused || isToolbarHovered);

    const formatText = (command, value = null) => {
        document.execCommand(command, false, value);
        descriptionEditorRef.current?.focus();
      };
  
      const handleDescriptionChange = () => {
        if (descriptionEditorRef.current) {
          setText(descriptionEditorRef.current.innerHTML);
        }
      };

      const handlePaste = (e) => {
        e.preventDefault();
        
        // Get plain text from clipboard
        const text = e.clipboardData.getData('text/plain');
        
        // Insert the plain text at cursor position
        document.execCommand('insertText', false, text);
        
        // Update the state
        handleDescriptionChange();
      };
  
      // Handle placeholder for contenteditable div and blur
      useEffect(() => {
        const editor = descriptionEditorRef.current;
        if (editor) {
          
          const handleBlur = () => {
            setIsEditorFocused(false);
            if (editor.innerHTML === '' || editor.innerHTML === '<br>') {
              editor.innerHTML = '';
            }
            // propagate change and notify external blur
            handleDescriptionChange();
            if (typeof onBlur === 'function') {
              onBlur();
            }
          };

          editor.addEventListener('blur', handleBlur);
          
          return () => {
            editor.removeEventListener('blur', handleBlur);
          };
        }
      }, []);
  
  
      useEffect(() => {
        if (descriptionEditorRef.current && !descriptionEditorRef.current.innerHTML && text) {
          descriptionEditorRef.current.innerHTML = text;
        }
      }, []);

      // Ensure internal focus state is tracked without console noise
      useEffect(() => {}, [isEditorFocused]);

      return (
        <div>
          <div className={`rte-container${error ? ' error' : ''}`}>
            <div
              ref={descriptionEditorRef}
              contentEditable={true}
              className="form-control rich-text-input"
              style={{
                height: "250px",
                overflowY: "auto",
                borderRadius: "8px 8px 0 0",
                borderBottom: "none",
                padding: "16px",
                lineHeight: "1.5",
                position: "relative",
                fontSize: "16px",
                color: "#1F2937"
              }}
              onInput={handleDescriptionChange}
              onBlur={handleDescriptionChange}
              onPaste={handlePaste}
              onFocus={() => {
                setIsEditorFocused(true);
              }}
              data-placeholder="Enter job description..."
            ></div>
            {/* Rich Text Editor Toolbar */}
            <div
              className="rte-toolbar"
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: "0 0 8px 8px",
                backgroundColor: "#FFFFFF",
                display: "flex",
                padding: "8px",
                alignItems: "center"
              }}
              onMouseEnter={() => setIsToolbarHovered(true)}
              onMouseLeave={() => setIsToolbarHovered(false)}
            >
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => formatText('bold')}
                data-tooltip-id="editor-tooltip"
                data-tooltip-content="Bold"
                style={{ 
                  padding: "6px 10px", 
                  fontSize: 18, 
                  color: "#6B7280",
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <i className="la la-bold"></i>
              </button>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => formatText('italic')}
                data-tooltip-id="editor-tooltip"
                data-tooltip-content="Italic"
                style={{ 
                  padding: "6px 10px", 
                  fontSize: 18, 
                  color: "#6B7280",
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <i className="la la-italic"></i>
              </button>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => formatText('underline')}
                data-tooltip-id="editor-tooltip"
                data-tooltip-content="Underline"
                style={{ 
                  padding: "6px 10px", 
                  fontSize: 18, 
                  color: "#6B7280",
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <i className="la la-underline"></i>
              </button>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => formatText('insertOrderedList')}
                data-tooltip-id="editor-tooltip"
                data-tooltip-content="Numbered List"
                style={{ 
                  padding: "6px 10px", 
                  fontSize: 18, 
                  color: "#6B7280",
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <i className="la la-list-ol"></i>
              </button>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => formatText('insertUnorderedList')}
                data-tooltip-id="editor-tooltip"
                data-tooltip-content="Bullet List"
                style={{ 
                  padding: "6px 10px", 
                  fontSize: 18, 
                  color: "#6B7280",
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <i className="la la-list-ul"></i>
              </button>
            </div>
          </div>
          {error && (
            <div className="rte-error-message">{errorMessage}</div>
          )}
          <Tooltip 
            id="editor-tooltip"
            className={isActive ? "editor-tooltip-focused" : ""}
            style={{
              backgroundColor: '#333',
              color: 'white',
              border: isActive ? '1px solid rgb(59, 30, 246)' : 'none',
            }}
            place="top"
            delayShow={100}
            delayHide={100}
          />
          <style jsx>{`
            .rich-text-input {
              border-radius: 8px 8px 0 0 !important;
            }
            /* Prevent layout shift from global .form-control:focus 2px rule */
            .rte-container .rich-text-input {
              border: 1px solid #E9EAEB !important;
              border-bottom: none !important;
              transition: border-color 0.15s ease;
            }
            .rte-container .rich-text-input:focus {
              border-width: 1px !important;
              border-color: rgb(59, 30, 246) !important;
              border-bottom: none !important;
              box-shadow: none !important;
            }
            /* Also activate when toolbar or any child is focused */
            .rte-container:focus-within .rich-text-input {
              border-color: rgb(59, 30, 246) !important;
            }
            .rte-toolbar {
              transition: border-color 0.15s ease;
            }
            .rte-container:focus-within .rte-toolbar {
              border-left: 1px solid rgb(59, 30, 246) !important;
              border-right: 1px solid rgb(59, 30, 246) !important;
              border-bottom: 1px solid rgb(59, 30, 246) !important;
              border-top: 1px solid rgb(59, 30, 246) !important;
            }
            .rte-container.error .rich-text-input {
              border: 1px solid #FDA29B !important;
              border-bottom: none !important;
            }
            .rte-container.error:focus-within .rich-text-input {
              border-color: #FDA29B !important;
            }
            .rte-container.error .rte-toolbar {
              border-left: 1px solid #FDA29B !important;
              border-right: 1px solid #FDA29B !important;
              border-bottom: 1px solid #FDA29B !important;
              border-top: 1px solid #E5E7EB !important;
            }
            .rte-container.error:focus-within .rte-toolbar {
              border-left: 1px solid #FDA29B !important;
              border-right: 1px solid #FDA29B !important;
              border-bottom: 1px solid #FDA29B !important;
              border-top: 1px solid #E5E7EB !important;
            }
            .rte-error-message {
              color: #F04438;
              font-size: 14px;
              margin-top: 8px;
            }
            .btn:hover,
            .btn:focus,
            .btn:active {
              background-color: transparent !important;
              border: none !important;
              box-shadow: none !important;
              color: #6B7280 !important;
            }
            [data-placeholder]:empty:before {
              content: attr(data-placeholder);
              color: #9CA3AF;
              pointer-events: none;
              position: absolute;
              top: 16px;
              left: 16px;
              font-size: 16px;
            }
          `}</style>
        </div>
      );
}