import React from 'react';

interface SortIconProps {
  className?: string;
  direction?: 'asc' | 'desc';
}

export const SortIcon: React.FC<SortIconProps> = ({ className, direction }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 9l4-4l4 4m-4 -4v14" className={direction === 'asc' ? 'opacity-100' : 'opacity-40'} />
    <path d="M21 15l-4 4l-4-4m4 4v-14" className={direction === 'desc' ? 'opacity-100' : 'opacity-40'}/>
  </svg>
);
