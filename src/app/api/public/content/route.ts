import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const [
    portfolioItems,
    testimonials,
    teamMembers,
    faqs,
    marketingServices,
    transformations,
    marketingMetrics,
    heroStats,
    heroScreenshots,
    seoResultImages,
    platformImages,
  ] = await Promise.all([
    db.portfolioItem.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
    db.testimonial.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
    db.teamMember.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
    db.fAQ.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
    db.marketingService.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
    db.transformation.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
    db.marketingMetric.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.heroStat.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.heroScreenshot.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.seoResultImage.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.platformImage.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  return NextResponse.json({
    portfolioItems,
    testimonials,
    teamMembers,
    faqs,
    marketingServices,
    transformations,
    marketingMetrics,
    heroStats,
    heroScreenshots,
    seoResultImages,
    platformImages,
  });
}
