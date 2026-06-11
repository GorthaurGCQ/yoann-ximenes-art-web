'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X } from 'lucide-react';
import type { WorkData } from '@/lib/worksData';

interface WorkModalProps {
  categoryKey?: string | null;
  data?: WorkData | null;
  onClose: () => void;
}

export default function WorkModal({ categoryKey, data: dataProp, onClose }: WorkModalProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [fading, setFading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const data = dataProp ?? null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveImage(0);
  }, [categoryKey, dataProp]);

  useEffect(() => {
    if (!data) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [data, onClose]);

  if (!data || !mounted) return null;

  const handleThumb = (index: number) => {
    if (index === activeImage) return;
    setFading(true);
    setTimeout(() => {
      setActiveImage(index);
      setFading(false);
    }, 200);
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div className="relative z-10 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg bg-stone-950 text-left shadow-xl border border-stone-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-stone-400 hover:text-stone-100 focus:outline-none z-20"
          aria-label="Fermer"
        >
          <X size={32} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="bg-stone-900 p-8 lg:p-12 flex flex-col justify-center items-center">
            <div className="w-full aspect-square relative mb-4 overflow-hidden rounded-sm border border-stone-800">
              {data.images[activeImage] && (
                <Image
                  src={data.images[activeImage]}
                  alt={data.title}
                  fill
                  className={`object-cover transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'}`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
            </div>
            {data.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto w-full pb-2">
                {data.images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => handleThumb(i)}
                    className={`relative flex-shrink-0 h-16 w-16 border transition-colors ${
                      i === activeImage
                        ? 'border-stone-100 opacity-100'
                        : 'border-stone-800 opacity-60 hover:opacity-100 hover:border-stone-100'
                    }`}
                  >
                    <Image src={src} alt={`${data.title} ${i + 1}`} fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-8 lg:p-12 flex flex-col justify-center bg-stone-950">
            <h2 className="text-3xl font-serif font-medium text-stone-100 mb-2">{data.title}</h2>
            <p className="text-sm text-stone-500 uppercase tracking-widest mb-8">{data.category}</p>
            <div
              className="text-stone-400 font-light leading-relaxed space-y-4 [&_p]:mb-4 [&_p.italic]:italic overflow-y-auto max-h-[50vh] pr-2"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
