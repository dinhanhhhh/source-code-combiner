import React from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({
  label,
  isActive,
  onClick,
  disabled,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-1/2 px-4 py-3 text-sm font-semibold transition-colors duration-200 border-b-2 ${
      isActive
        ? "border-sky-500 text-sky-400"
        : "border-transparent text-slate-400 hover:text-white"
    } disabled:text-slate-600 disabled:cursor-not-allowed`}
  >
    {label}
  </button>
);

export default TabButton;
