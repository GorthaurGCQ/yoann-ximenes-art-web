'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { worksData, type WorkData } from '@/lib/worksData';

interface WorkModalProps {
  categoryKey: string | null;
  onClose: () => void;
}

export default function WorkModal({ categoryKey, onClose }: WorkModalProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [fading, setFading] = useState(false);

  const data: WorkData | null = categoryKey ? worksData[categoryKey] ?? null : null;

  useEffect(() => {
    setActiveImage(0);
  }, [categoryKey]);

  useEffect(() => {
    if (!data) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [data, onClose]);

  if (!data) return null;

  const handleThumb = (index: number) => {
    if (index === activeImage) return;
    setFading(true);
    setTimeout(() => {
      setActiveImage(index);
      setFading(false);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-0">
        <div className="relative overflow-hidden rounded-lg bg-stone-950 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-6xl border border-stone-800">
          {/* Fermer */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-stone-400 hover:text-stone-100 focus:outline-none z-10"
            aria-label="Fermer"
          >
            <X size={32} />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Galerie (gauche) */}
            <div className="bg-stone-900 p-8 lg:p-12 flex flex-col justify-center items-center">
              <div className="w-full aspect-square relative mb-4 overflow-hidden rounded-sm border border-stone-800">
                <Image
                  src={data.images[activeImage]}
                  alt={data.title}
                  fill
                  className={`object-cover transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'}`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
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
                      <Image
                        src={src}
                        alt={`${data.title} ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Contenu (droite) */}
            <div className="p-8 lg:p-12 flex flex-col justify-center bg-stone-950">
              <h2 className="text-3xl font-serif font-medium text-stone-100 mb-2">
                {data.title}
              </h2>
              <p className="text-sm text-stone-500 uppercase tracking-widest mb-8">
                {data.category}
              </p>
              <div
                className="text-stone-400 font-light leading-relaxed space-y-4 [&_p]:mb-4 [&_p.italic]:italic overflow-y-auto max-h-[50vh] pr-2"
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
