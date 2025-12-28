import React from 'react';

interface ToolbarProps {
  onSave?: () => void;
  onPreview?: () => void;
  onExit?: () => void;
  isLoading?: boolean;
  hasUnsavedChanges?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  onPreview,
  onExit,
  isLoading = false,
  hasUnsavedChanges = false,
}) => {
  return (
    <div data-testid="toolbar" className="toolbar">
      <button
        data-testid="save-btn"
        onClick={onSave}
        disabled={isLoading}
        aria-label="Save page"
        className={hasUnsavedChanges ? 'has-changes' : ''}
      >
        Save {hasUnsavedChanges && '*'}
      </button>
      <button
        data-testid="preview-btn"
        onClick={onPreview}
        disabled={isLoading}
        aria-label="Preview page"
      >
        Preview
      </button>
      <button
        data-testid="exit-btn"
        onClick={onExit}
        disabled={isLoading}
        aria-label="Exit editor"
      >
        Exit
      </button>
      {isLoading && (
        <span data-testid="loading-indicator" className="loading">
          Loading...
        </span>
      )}
      {hasUnsavedChanges && !isLoading && (
        <span data-testid="unsaved-indicator" className="unsaved-indicator">
          Unsaved changes
        </span>
      )}
    </div>
  );
};

