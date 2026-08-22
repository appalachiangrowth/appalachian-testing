'use client'

import { useRef, useState, useEffect, type FormEvent } from 'react'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Loader2,
  Send,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import SectionLabel from '@/components/sections/SectionLabel'
import { useSiteSettings } from '@/hooks/useSiteSettings'

function useInViewOnce(margin = '-100px') {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { rootMargin: margin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);
  return { ref, isVisible };
}

const defaultContactItems = [
  { icon: Phone, label: 'WhatsApp', value: '+1 (555) 123-4567', settingKey: 'phone_number' },
  { icon: Mail, label: 'Email', value: 'appalachaingrowth@gmail.com', settingKey: 'contact_email' },
  { icon: MapPin, label: 'Location', value: 'United States', settingKey: 'address' },
  { icon: Clock, label: 'Working Hours', value: 'Mon - Sat, 9:00 AM - 6:00 PM', settingKey: 'working_hours' },
]

const defaultSocialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram', settingKey: 'social_instagram' },
  { icon: Facebook, href: '#', label: 'Facebook', settingKey: 'social_facebook' },
  { icon: Twitter, href: '#', label: 'Twitter', settingKey: 'social_twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn', settingKey: 'social_linkedin' },
]

const inputClasses =
  'bg-[#111111] border-[rgba(255,255,255,0.12)] text-white placeholder:text-[#777] rounded-lg focus:border-[#B6FF00] focus:ring-[#B6FF00]/20 focus-visible:ring-2 focus-visible:ring-[#B6FF00] focus-visible:ring-offset-0'

const selectTriggerClasses =
  'bg-[#111111] border-[rgba(255,255,255,0.12)] text-white rounded-lg w-full focus:border-[#B6FF00] focus:ring-[#B6FF00]/20 [&>span]:text-[#aaa] data-[placeholder]:text-[#666]'

export default function ContactSection() {
  const { ref, isVisible } = useInViewOnce('-100px')
  const { toast } = useToast()
  const { data: settings } = useSiteSettings()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    platform: '',
    message: '',
  })

  const contactItems = defaultContactItems.map(item => ({
    ...item,
    value: (settings?.[item.settingKey] || item.value),
  }))

  const socialLinks = defaultSocialLinks.map(link => ({
    ...link,
    href: (settings?.[link.settingKey] || link.href),
  }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast({
          title: 'Message Sent!',
          description: "We'll get back to you within 24 hours.",
        })
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          platform: '',
          message: '',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Network error. Please check your connection.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id='contact' className='bg-[#050505]'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-20'>
        <div
          ref={ref}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'none' : 'translateY(30px)',
            transition: 'opacity 0.6s cubic-bezier(0.25, 0.4, 0.25, 1), transform 0.6s cubic-bezier(0.25, 0.4, 0.25, 1)',
          }}
          className='text-center mb-10 md:mb-14'
        >
          <SectionLabel>Get in Touch</SectionLabel>
          <h2
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'none' : 'translateY(30px)',
              transition: 'opacity 0.6s cubic-bezier(0.25, 0.4, 0.25, 1) 0.12s, transform 0.6s cubic-bezier(0.25, 0.4, 0.25, 1) 0.12s',
            }}
            className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white'
          >
            HAVE A PROJECT IN MIND?
          </h2>
          <p
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'none' : 'translateY(30px)',
              transition: 'opacity 0.6s cubic-bezier(0.25, 0.4, 0.25, 1) 0.24s, transform 0.6s cubic-bezier(0.25, 0.4, 0.25, 1) 0.24s',
            }}
            className='text-[#bbb] mt-4 max-w-xl mx-auto'
          >
            Tell us about your project and our team will get back to you.
          </p>
        </div>

        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'none' : 'translateY(30px)',
            transition: 'opacity 0.6s cubic-bezier(0.25, 0.4, 0.25, 1) 0.1s, transform 0.6s cubic-bezier(0.25, 0.4, 0.25, 1) 0.1s',
          }}
          className='grid grid-cols-1 lg:grid-cols-2 gap-8'
        >
          {/* Contact Form */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'none' : 'translateY(30px)',
              transition: 'opacity 0.6s cubic-bezier(0.25, 0.4, 0.25, 1) 0.2s, transform 0.6s cubic-bezier(0.25, 0.4, 0.25, 1) 0.2s',
            }}
            className='relative'
          >
            {/* Decorative radial glow */}
            <div className='pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(182,255,0,0.05),transparent_70%)]' />
            <form
              onSubmit={handleSubmit}
              className='relative bg-[#0A0A0A] rounded-2xl p-6 md:p-8 border border-[rgba(182,255,0,0.15)] neon-border-glow'
            >
              <div className='space-y-5'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                  <div className='space-y-2'>
                    <Label className='text-sm text-[#bbb]'>Full Name *</Label>
                    <Input
                      required
                      placeholder='John Doe'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={inputClasses}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label className='text-sm text-[#bbb]'>
                      Email Address *
                    </Label>
                    <Input
                      required
                      type='email'
                      placeholder='john@example.com'
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label className='text-sm text-[#bbb]'>Phone Number</Label>
                  <Input
                    type='tel'
                    placeholder='+1 (555) 000-0000'
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={inputClasses}
                  />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                  <div className='space-y-2'>
                    <Label className='text-sm text-[#bbb]'>Select Service</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) =>
                        setFormData({ ...formData, service: value })
                      }
                    >
                      <SelectTrigger className={selectTriggerClasses}>
                        <SelectValue placeholder='Choose a service' />
                      </SelectTrigger>
                      <SelectContent className='bg-[#111111] border-[rgba(255,255,255,0.08)]'>
                        <SelectItem value='shopify' className='text-white hover:bg-[rgba(182,255,0,0.1)] focus:bg-[rgba(182,255,0,0.1)] focus:text-[#B6FF00]'>
                          Shopify Store
                        </SelectItem>
                        <SelectItem value='wordpress' className='text-white hover:bg-[rgba(182,255,0,0.1)] focus:bg-[rgba(182,255,0,0.1)] focus:text-[#B6FF00]'>
                          WordPress Store
                        </SelectItem>
                        <SelectItem value='redesign' className='text-white hover:bg-[rgba(182,255,0,0.1)] focus:bg-[rgba(182,255,0,0.1)] focus:text-[#B6FF00]'>
                          Store Redesign
                        </SelectItem>
                        <SelectItem value='seo' className='text-white hover:bg-[rgba(182,255,0,0.1)] focus:bg-[rgba(182,255,0,0.1)] focus:text-[#B6FF00]'>
                          SEO
                        </SelectItem>
                        <SelectItem value='marketing' className='text-white hover:bg-[rgba(182,255,0,0.1)] focus:bg-[rgba(182,255,0,0.1)] focus:text-[#B6FF00]'>
                          Digital Marketing
                        </SelectItem>
                        <SelectItem value='other' className='text-white hover:bg-[rgba(182,255,0,0.1)] focus:bg-[rgba(182,255,0,0.1)] focus:text-[#B6FF00]'>
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label className='text-sm text-[#bbb]'>Select Platform</Label>
                    <Select
                      value={formData.platform}
                      onValueChange={(value) =>
                        setFormData({ ...formData, platform: value })
                      }
                    >
                      <SelectTrigger className={selectTriggerClasses}>
                        <SelectValue placeholder='Choose a platform' />
                      </SelectTrigger>
                      <SelectContent className='bg-[#111111] border-[rgba(255,255,255,0.08)]'>
                        <SelectItem value='shopify' className='text-white hover:bg-[rgba(182,255,0,0.1)] focus:bg-[rgba(182,255,0,0.1)] focus:text-[#B6FF00]'>
                          Shopify
                        </SelectItem>
                        <SelectItem value='wordpress' className='text-white hover:bg-[rgba(182,255,0,0.1)] focus:bg-[rgba(182,255,0,0.1)] focus:text-[#B6FF00]'>
                          WordPress/WooCommerce
                        </SelectItem>
                        <SelectItem value='not-sure' className='text-white hover:bg-[rgba(182,255,0,0.1)] focus:bg-[rgba(182,255,0,0.1)] focus:text-[#B6FF00]'>
                          Not Sure
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label className='text-sm text-[#bbb]'>
                    Project Details / Message
                  </Label>
                  <Textarea
                    rows={4}
                    placeholder='Tell us about your project...'
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className={`${inputClasses} min-h-[100px]`}
                  />
                </div>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='group relative overflow-hidden w-full bg-[#B6FF00] text-[#050505] font-semibold rounded-lg py-3 hover:bg-[#a0e600] hover:shadow-[0_0_30px_rgba(182,255,0,0.3)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]'
                >
                  <span className='absolute inset-0 overflow-hidden rounded-lg'>
                    <span className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent' />
                  </span>
                  {isSubmitting ? (
                    <Loader2 className='w-5 h-5 animate-spin' />
                  ) : (
                    <>
                      <Send className='w-4 h-4' />
                      <span>SEND MESSAGE</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'none' : 'translateY(30px)',
              transition: 'opacity 0.6s cubic-bezier(0.25, 0.4, 0.25, 1) 0.3s, transform 0.6s cubic-bezier(0.25, 0.4, 0.25, 1) 0.3s',
            }}
            className='flex flex-col gap-8'
          >
            <div className='bg-[#0A0A0A] rounded-2xl p-6 md:p-8 border border-[rgba(182,255,0,0.12)]'>
              <h3 className='text-white font-semibold text-lg mb-6'>
                Contact Information
              </h3>
              <div className='space-y-0'>
                {contactItems.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-4 py-4 ${
                      index < contactItems.length - 1
                        ? 'border-b border-[rgba(255,255,255,0.05)]'
                        : ''
                    }`}
                  >
                    <div className='w-10 h-10 rounded-lg bg-[rgba(182,255,0,0.08)] flex items-center justify-center flex-shrink-0'>
                      <item.icon className='w-5 h-5 text-[#B6FF00]' />
                    </div>
                    <div>
                      <p className='text-[#888] text-sm'>{item.label}</p>
                      {item.label === 'Email' ? (
                        <a
                          href={`mailto:${item.value}`}
                          className='text-white text-sm font-medium mt-0.5 hover:text-[#B6FF00] transition-colors duration-200'
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className='text-white text-sm font-medium mt-0.5'>
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media Icons */}
              <div className='mt-8 pt-6 border-t border-[rgba(255,255,255,0.05)]'>
                <p className='text-[#888] text-sm mb-4'>Follow Us</p>
                <div className='flex items-center gap-3'>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
