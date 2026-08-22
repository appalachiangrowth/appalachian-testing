'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useSiteSettings } from '@/hooks/useSiteSettings'

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const serviceLinks = [
  { label: 'Shopify', href: '#services' },
  { label: 'WordPress', href: '#services' },
  { label: 'SEO', href: '#services' },
  { label: 'Digital Marketing', href: '#digital-marketing' },
]

const defaultSocialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram', settingKey: 'social_instagram' },
  { icon: Facebook, href: '#', label: 'Facebook', settingKey: 'social_facebook' },
  { icon: Twitter, href: '#', label: 'Twitter', settingKey: 'social_twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn', settingKey: 'social_linkedin' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const { toast } = useToast()
  const { data: settings } = useSiteSettings()

  const contactEmail = settings?.contact_email || 'appalachaingrowth@gmail.com'
  const phone = settings?.phone_number || ''
  const address = settings?.address || ''
  const siteName = settings?.site_name || 'Appalachian Growth Solutions'
  const siteDescription = settings?.site_description || 'We are a premium digital solutions agency. We help businesses build, grow, and succeed online with cutting-edge technology.'

  const socialLinks = useMemo(() => defaultSocialLinks.map(link => ({
    ...link,
    href: (settings?.[link.settingKey] || link.href),
  })), [settings])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && email.includes('@')) {
      toast({
        title: 'Subscribed!',
        description: "You'll receive our latest updates.",
      })
      setEmail('')
    } else {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      })
    }
  }

  return (
    <footer className='relative bg-[#050505] border-t border-[rgba(182,255,0,0.1)]'>
      {/* Dot-grid pattern overlay */}
      <div className='absolute inset-0 bg-grid-pattern pointer-events-none' />
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 md:pt-16 pb-6 sm:pb-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8'>
          {/* Column 1 - About */}
          <div className='space-y-5'>
            <Image
              src='/appalachian-logo.png'
              alt={siteName}
              width={722}
              height={176}
              className='h-14 w-auto object-contain'
            />
            <p className='text-[#bbb] text-sm leading-relaxed'>
              {siteDescription}
            </p>
            <div className='flex items-center gap-2.5 sm:gap-3'>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className='w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#888] hover:text-[#B6FF00] hover:bg-[rgba(182,255,0,0.08)] hover:shadow-[0_0_16px_rgba(182,255,0,0.25)] transition-all duration-200 hover:scale-[1.15] hover:-translate-y-[3px]'
                >
                  <social.icon className='w-4 h-4' />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className='text-white font-semibold text-sm mb-5 after:content-[""] after:block after:w-6 after:h-0.5 after:bg-[#B6FF00] after:mt-2 after:rounded-full'>
              Quick Links
            </h4>
            <ul className='space-y-3'>
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className='text-[#bbb] text-sm hover:text-[#B6FF00] transition-colors duration-200 hover:translate-x-1 transition-transform min-h-[44px] flex items-center'
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Services */}
          <div>
            <h4 className='text-white font-semibold text-sm mb-5 after:content-[""] after:block after:w-6 after:h-0.5 after:bg-[#B6FF00] after:mt-2 after:rounded-full'>Services</h4>
            <ul className='space-y-3'>
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className='text-[#bbb] text-sm hover:text-[#B6FF00] transition-colors duration-200 hover:translate-x-1 transition-transform min-h-[44px] flex items-center'
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div className='space-y-5'>
            <h4 className='text-white font-semibold text-sm mb-5 after:content-[""] after:block after:w-6 after:h-0.5 after:bg-[#B6FF00] after:mt-2 after:rounded-full'>Contact</h4>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <Mail className='w-4 h-4 text-[#B6FF00] flex-shrink-0' />
                <a href={`mailto:${contactEmail}`} className='text-[#bbb] text-sm break-all hover:text-[#B6FF00] transition-colors duration-200'>
                  {contactEmail}
                </a>
              </div>
              {phone && (
                <div className='flex items-center gap-3'>
                  <Phone className='w-4 h-4 text-[#B6FF00] flex-shrink-0' />
                  <span className='text-[#bbb] text-sm'>{phone}</span>
                </div>
              )}
              {address && (
                <div className='flex items-center gap-3'>
                  <MapPin className='w-4 h-4 text-[#B6FF00] flex-shrink-0' />
                  <span className='text-[#bbb] text-sm'>{address}</span>
                </div>
              )}
            </div>

            {/* Newsletter Signup */}
            <form onSubmit={handleSubmit} className='mt-5'>
              <p className='text-[#bbb] text-sm mb-3'>Subscribe to newsletter</p>
              <div className='flex items-center gap-2 focus-within:ring-1 focus-within:ring-[rgba(182,255,0,0.3)] rounded-lg'>
                <Input
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='bg-[#111111] border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#555] rounded-lg text-sm focus:border-[#B6FF00] h-11 min-h-[44px]'
                />
                <button
                  type='submit'
                  aria-label='Subscribe'
                  className='w-11 h-11 min-w-[44px] min-h-[44px] bg-[#B6FF00] rounded-lg flex items-center justify-center text-[#050505] hover:bg-[#a0e600] transition-colors duration-200 flex-shrink-0'
                >
                  <ArrowRight className='w-4 h-4' />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-[rgba(255,255,255,0.05)] mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <p className='text-[#888] text-sm'>
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>
            <div className='flex items-center gap-6'>
              <a
                href='#'
                className='text-[#888] text-sm hover:text-[#B6FF00] transition-colors duration-200 hover:translate-x-1 transition-transform min-h-[44px] flex items-center'
              >
                Privacy Policy
              </a>
              <a
                href='#'
                className='text-[#888] text-sm hover:text-[#B6FF00] transition-colors duration-200 hover:translate-x-1 transition-transform min-h-[44px] flex items-center'
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
