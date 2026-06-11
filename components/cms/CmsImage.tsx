'use client';

import Image, { type ImageProps } from 'next/image';

type CmsImageProps = Omit<ImageProps, 'src'> & {
  src: string;
};

export default function CmsImage({ src, alt, ...props }: CmsImageProps) {
  if (!src) {
    return <div className="absolute inset-0 bg-stone-900" aria-hidden />;
  }

  return <Image src={src} alt={alt} {...props} />;
}
