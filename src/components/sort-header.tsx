import * as React from 'react';

interface Props {
  column: 'name' | 'size' | 'date';
  currentSort: 'name' | 'size' | 'date';
  isDesc: boolean;
  onSort: (column: 'name' | 'size' | 'date') => void;
  width: string;
  children: string;
}

export const SortHeader: React.FC<Props> = ({
  column,
  currentSort,
  isDesc,
  onSort,
  width,
  children,
}) => {
  const isActive = column === currentSort;

  return (
    <th style={`width: ${width};`}>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSort(column);
        }}
      >
        {children}
      </a>
      {isActive && (isDesc ? ' ↓' : ' ↑')}
    </th>
  );
};