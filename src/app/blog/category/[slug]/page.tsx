import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogCategoryRedirect({ params }: Props) {
  const { slug } = await params;
  // Convert slug like "shopify" or "e-commerce" back to a readable category name
  const categoryName = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  redirect(`/blog?category=${encodeURIComponent(categoryName)}`);
}
