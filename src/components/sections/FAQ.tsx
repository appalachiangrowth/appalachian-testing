'use client'

import { motion, useInView } from '@/lib/motion'
import { useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import SectionLabel from '@/components/sections/SectionLabel'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { usePublicContent, type FAQ as FAQType } from '@/hooks/usePublicContent'

// Fallback data used during loading or when the API is unavailable
const defaultFaqs: FAQType[] = [
  {
    question: 'How long does it take to build a store?',
    answer:
      'We deliver stores quickly without compromising quality. Small websites can take as little as 2 days, standard stores 4–5 days, and highly customized websites 1–2 weeks. Our larger team works on multiple parts of your website simultaneously, helping us deliver faster while saving you valuable time.',
  },
  {
    question: 'Do you build both Shopify and WordPress stores?',
    answer:
      'Yes. We build Shopify, WordPress, and WooCommerce stores tailored to your business, whether you need a new online store or want to improve an existing one.',
  },
  {
    question: 'Do you provide ongoing website maintenance?',
    answer:
      'Absolutely. We can handle everything from building and maintaining your store to adding products, optimizing your website, and growing sales. Through SEO and digital marketing, we help make your store visible to relevant customers who are already searching for the products or services you offer.',
  },
  {
    question: 'Can you redesign my existing store?',
    answer:
      'Yes. We can redesign and modernize your existing Shopify or WordPress store while improving its design, user experience, mobile responsiveness, and conversion potential.',
  },
  {
    question: 'Do you provide SEO?',
    answer:
      "Yes. We provide SEO services designed to improve your website's visibility in search engines. Our services can include on-page SEO, technical SEO, keyword optimization, content optimization, local SEO, and ongoing SEO campaigns.",
  },
  {
    question: 'Do you provide ongoing support after my website launches?',
    answer:
      'Yes. We can provide ongoing support after launch, including website updates, product changes, troubleshooting, maintenance, and continued improvements. We can also discuss an ongoing support or growth plan based on your needs.',
  },
  {
    question: 'How Appalachian SEO Benefits Your Business?',
    answer:
      'We help businesses connect with people who are already searching for their products or services. A strong SEO strategy can also strengthen your online reputation, establish industry credibility, and encourage greater audience engagement. By targeting relevant long-tail keywords, we can attract prospects with strong buying intent who are more likely to become customers.',
  },
  {
    question: 'Why Trust Appalachian Growth Solutions With Your SEO?',
    answer:
      'At Appalachian Growth Solutions, we understand that SEO is never a one-time effort. Google, search, and the internet—especially with the rise of AI—are changing every day. We keep adjusting our strategies as things evolve, using our local knowledge and a dedicated team to help your business stay visible and keep growing.',
  },
  {
    question: 'Are we the right fit for you?',
    answer:
      "At Appalachian Growth Solutions, we focus on bringing the right traffic to your website—people who are more likely to become customers. We work hard to help you grow your business and reach more of your market. We also understand that choosing the right SEO company can be difficult, especially if you've had a bad experience before. That's why we aim to make the process simple and show you a better way to grow online.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
  },
}

export default function FAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { data } = usePublicContent()
  const faqs = data?.faqs?.length ? data.faqs : defaultFaqs

  return (
    <section id='faq' className='bg-[#050505] relative'>
      {/* Subtle radial glow centered behind FAQ */}
      <div className='pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(182,255,0,0.04),transparent_70%)]' aria-hidden='true' />
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20'>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
          className='text-center mb-10 md:mb-14'
        >
          <SectionLabel>FAQ</SectionLabel>
          <motion.h2
            variants={fadeUp}
            className='text-2xl sm:text-3xl md:text-4xl font-bold text-white'
          >
            FREQUENTLY ASKED QUESTIONS
          </motion.h2>
        </motion.div>

        {/* Decorative glow dot */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(182,255,0,0.06),transparent_70%)] pointer-events-none' aria-hidden='true' />

        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
        >
          <Accordion type='single' collapsible className='space-y-0'>
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.id || index}
                value={`item-${index}`}
                className='border-b border-[rgba(182,255,0,0.08)] faq-glow-line [&[data-state=open]>div]:border-l-2 [&[data-state=open]>div]:border-l-[#B6FF00] [&>div]:hover:bg-[rgba(182,255,0,0.02)]'
              >
                <AccordionTrigger className='text-[#ddd] text-left text-base font-medium py-5 hover:no-underline hover:text-[#B6FF00] transition-colors [&_svg]:text-[#B6FF00] [&>svg]:transition-transform [&>svg]:duration-300 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]]:font-semibold'>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className='text-[#aaa] text-sm leading-relaxed pb-5 faq-content-transition'>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
