'use client';

import {
  useRef,
  useEffect,
  Children,
  cloneElement,
  type ReactElement,
  type ReactNode,
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
  const childClassName = child.props.className ?? '';

  useEffect(() => {
    if (isSelected && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isSelected]);

  // Quand le bloc devient sélectionné, focus + auto-resize + forcer LTR via JS
  useEffect(() => {
    if (!isSelected || !textareaRef.current) return;
    const ta = textareaRef.current;
    ta.focus();
    ta.selectionStart = ta.selectionEnd = ta.value.length;
    // Auto-resize
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
    // Forcer LTR avec la priorité maximale possible
    ta.style.setProperty('direction', 'ltr', 'important');
    ta.setAttribute('dir', 'ltr');
  }, [isSelected]);

  const ringClass = isSelected
    ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-stone-950'
    : 'hover:ring-2 hover:ring-blue-400/50 hover:ring-offset-2 hover:ring-offset-stone-950';

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

      {isSelected ? (
        /* Textarea en lieu et place de l'élément — direction garantie LTR */
        <textarea
          ref={textareaRef}
          dir="ltr"
          rows={1}
          value={displayValue}
          onChange={(e) => {
            updateDraft(blockKey, e.target.value);
            // Auto-resize
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onInput={(e) => {
            const ta = e.currentTarget;
            ta.style.setProperty('direction', 'ltr', 'important');
          }}
          className={`cms-inline-editor ${childClassName} ${ringClass} outline-none rounded-sm w-full`}
          style={{
            direction: 'ltr',
            unicodeBidi: 'isolate',
            minHeight: '1em',
            fontFamily: 'inherit',
            lineHeight: 'inherit',
            letterSpacing: 'inherit',
          }}
        />
      ) : (
        /* Élément original non éditable — clic pour sélectionner */
        cloneElement(child, {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            selectBlock(blockKey);
          },
          className: `${childClassName} ${ringClass} cursor-pointer rounded-sm transition-all`,
        } as Partial<typeof child.props> & { onClick: (e: React.MouseEvent) => void })
      )}
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
