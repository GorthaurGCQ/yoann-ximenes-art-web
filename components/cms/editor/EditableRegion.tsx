'use client';

import {
  useRef,
  useEffect,
  Children,
  isValidElement,
  cloneElement,
  type ReactElement,
  type ReactNode,
  type FocusEvent,
  type FormEvent,
} from 'react';
import { useCmsEditor } from '@/contexts/CmsEditorContext';
import { getBlockByKey, getCounterpartKey } from '@/lib/cms/registry';
import { richTextToEditorValue } from '@/lib/cms/richText';
import type { ContentKind } from '@/lib/cms/types';

interface EditableRegionProps {
  blockKey: string;
  label: string;
  kind: ContentKind;
  children: ReactNode;
  className?: string;
}

function RegionBadge({
  label,
  isSelected,
  isDirty,
  isUntranslated,
}: {
  label: string;
  isSelected: boolean;
  isDirty: boolean;
  isUntranslated: boolean;
}) {
  return (
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
  );
}

function InlineTextEditor({
  blockKey,
  kind,
  children,
  label,
  className = '',
}: EditableRegionProps) {
  const { selectedKey, selectBlock, getValue, updateDraft, isBlockDirty } = useCmsEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const editableRef = useRef<HTMLElement>(null);
  const isSelected = selectedKey === blockKey;
  const isDirty = isBlockDirty(blockKey);
  const block = getBlockByKey(blockKey);
  const counterpartKey = getCounterpartKey(blockKey);
  const rawValue = getValue(blockKey);
  const displayValue = kind === 'richtext' ? richTextToEditorValue(rawValue) : rawValue;
  const isUntranslated =
    block?.lang === 'en' &&
    !rawValue.trim() &&
    Boolean(counterpartKey && getValue(counterpartKey).trim());

  const child = Children.only(children) as ReactElement<{ className?: string; children?: ReactNode }>;

  useEffect(() => {
    if (isSelected && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isSelected]);

  useEffect(() => {
    const el = editableRef.current;
    if (!el || document.activeElement === el) return;
    el.textContent = displayValue;
  }, [displayValue, blockKey]);

  const ringClass = isSelected
    ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-stone-950'
    : 'hover:ring-2 hover:ring-blue-400/50 hover:ring-offset-2 hover:ring-offset-stone-950';

  const editableProps = {
    contentEditable: true,
    suppressContentEditableWarning: true,
    title: className.includes('contents') ? label : undefined,
    className: `${child.props.className ?? ''} ${ringClass} outline-none cursor-text rounded-sm transition-all ${
      kind === 'richtext' ? 'whitespace-pre-wrap' : ''
    }`,
    onFocus: (e: FocusEvent<HTMLElement>) => {
      e.stopPropagation();
      selectBlock(blockKey);
    },
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      selectBlock(blockKey);
    },
    onInput: (e: FormEvent<HTMLElement>) => {
      updateDraft(blockKey, e.currentTarget.textContent ?? '');
    },
    ref: editableRef,
  };

  const layoutClass = className.includes('contents') ? 'contents' : 'relative';

  return (
    <div ref={containerRef} className={`${layoutClass} group/region`}>
      {!className.includes('contents') && (
        <RegionBadge
          label={label}
          isSelected={isSelected}
          isDirty={isDirty}
          isUntranslated={isUntranslated}
        />
      )}
      {cloneElement(child, editableProps)}
    </div>
  );
}

function ImageRegion({ blockKey, label, kind, children, className = '' }: EditableRegionProps) {
  const { selectedKey, selectBlock, getValue, isBlockDirty } = useCmsEditor();
  const ref = useRef<HTMLDivElement>(null);
  const isSelected = selectedKey === blockKey;
  const isDirty = isBlockDirty(blockKey);
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
      <RegionBadge
        label={label}
        isSelected={isSelected}
        isDirty={isDirty}
        isUntranslated={isUntranslated}
      />
      {children}
    </div>
  );
}

export default function EditableRegion(props: EditableRegionProps) {
  if (props.kind === 'image') {
    return <ImageRegion {...props} />;
  }

  return <InlineTextEditor {...props} />;
}
