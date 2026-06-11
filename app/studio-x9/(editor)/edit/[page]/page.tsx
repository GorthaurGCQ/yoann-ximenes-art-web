import { notFound } from 'next/navigation';
import StudioShell from '@/components/cms/editor/StudioShell';
import { isValidCmsPage } from '@/lib/cms/registry';

export default async function StudioEditPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  if (!isValidCmsPage(page)) notFound();
  return <StudioShell page={page} />;
}
