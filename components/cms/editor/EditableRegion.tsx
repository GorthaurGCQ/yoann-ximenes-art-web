'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { useCmsEditor } from '@/contexts/CmsEditorContext';
import { getBlockByKey, getCounterpartKey } from '@/lib/cms/registry';
import type { ContentKind } from '@/lib/cms/types';

interface EditableRegionProps {
  blockKey: string;
  label: string;
  kind: ContentKind;
  children: ReactNode;
  className?: string;
}

export default function EditableRegion({
  blockKey,
  label,
  kind,
  children,
  className = '',
}: EditableRegionProps) {
  const { selectedKey, dirtyKeys, selectBlock, getValue } = useCmsEditor();
  const ref = useRef<HTMLDivElement>(null);
  const isSelected = selectedKey === blockKey;
  const isDirty = dirtyKeys.has(blockKey);
  const block = getBlockByKey(blockKey);
  const counterpartKey = getCounterpartKey(blockKey);
  const isUntranslated =
    block?.lang === 'en' &&
    !getValue(blockKey).trim() &&
    Boolean(counterpartKey && getValue(counterpartKey).trim());

  useEffect(() => {
    if (isSelected && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isSelected]);

  const layoutClass =
    kind === 'image'
      ? 'absolute inset-0'
      : className.includes('contents')
        ? 'contents'
        : 'relative';

  return (
    <div
      ref={ref}
      data-cms-key={blockKey}
      data-cms-kind={kind}
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(blockKey);
      }}
      className={`${layoutClass} cursor-pointer transition-all rounded-sm group/region ${
        isSelected
          ? 'ring-2 ring-stone-100 ring-offset-2 ring-offset-stone-950'
          : 'hover:ring-2 hover:ring-blue-400/60 hover:ring-offset-2 hover:ring-offset-stone-950'
      } ${className}`}
    >
      <span
        className={`absolute -top-2 left-2 z-30 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full pointer-events-none ${
          isSelected
            ? 'bg-stone-100 text-stone-900'
            : 'bg-stone-800 text-stone-300 opacity-0 group-hover/region:opacity-100'
        }`}
      >
        {label}
        {isDirty && <span className="ml-1 text-amber-400">*</span>}
        {isUntranslated && <span className="ml-1 text-rose-400 normal-case">non traduit</span>}
      </span>
      {children}
    </div>
  );
}
