import React from 'react';

export const DoorIcon = ({ className }) => (
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
    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-2a2 2 0 0 0 -2 2v2" />
    <path d="M20 10v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-10z" />
    <path d="M10 16h4" />
  </svg>
);