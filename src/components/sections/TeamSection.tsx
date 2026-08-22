'use client'

import { motion } from '@/lib/motion'
import { Globe, Linkedin, Github } from 'lucide-react'
import SectionReveal from '@/components/sections/SectionReveal'
import SectionLabel from '@/components/sections/SectionLabel'
import { usePublicContent, type TeamMember } from '@/hooks/usePublicContent'
import { LucideIcon } from 'lucide-react'

// Fallback data used during loading or when the API is unavailable
const defaultTeamMembers: TeamMember[] = [
  {
    name: 'Alex Carter',
    role: 'Founder & CEO',
    bio: 'eCommerce visionary with 8+ years building high-converting stores for global brands.',
    initials: 'AC',
    websiteUrl: '#',
    linkedinUrl: '#',
    githubUrl: '#',
  },
  {
    name: 'Sarah Kim',
    role: 'Lead Developer',
    bio: 'Full-stack expert specializing in Shopify Plus and custom WordPress solutions.',
    initials: 'SK',
    websiteUrl: '#',
    linkedinUrl: '#',
    githubUrl: '#',
  },
  {
    name: 'Marcus Johnson',
    role: 'Marketing Director',
    bio: 'Data-driven marketer who has managed $10M+ in ad spend across platforms.',
    initials: 'MJ',
    websiteUrl: '#',
    linkedinUrl: '#',
    githubUrl: '#',
  },
  {
    name: 'Priya Patel',
    role: 'UI/UX Designer',
    bio: 'Award-winning designer crafting intuitive, conversion-focused shopping experiences.',
    initials: 'PP',
    websiteUrl: '#',
    linkedinUrl: '#',
    githubUrl: '#',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const ICON_MAP: Record<string, LucideIcon> = { Globe, Linkedin, Github }

export default function TeamSection() {
  const { data } = usePublicContent()
  const teamMembers = data?.teamMembers?.length
    ? data.teamMembers
    : defaultTeamMembers

  return (
    <section id="about" className="bg-[#0A0A0A] section-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Section Header */}
        <SectionReveal>
          <div className="text-center mb-10 md:mb-14">
            <SectionLabel>ABOUT US</SectionLabel>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
              THE TEAM BEHIND
              <br className="hidden sm:block" />
              YOUR SUCCESS
            </h2>
            <p className="text-[#999] max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Meet the talented people who bring creativity, expertise, and passion to every project we deliver.
            </p>
          </div>
        </SectionReveal>

        {/* Team Cards Grid */}
        <SectionReveal delay={0.15}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.id || member.name}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className="group bg-[#0D0D0D] rounded-2xl p-4 sm:p-5 md:p-6 border border-[rgba(182,255,0,0.06)] hover:border-[rgba(182,255,0,0.2)] hover:border-t-[rgba(182,255,0,0.3)] hover:shadow-[0_0_30px_rgba(182,255,0,0.08)] transition-all duration-300"
              >
                {/* Avatar with gradient border */}
                <div className="flex justify-center mb-5">
                  <div className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full p-[3px] bg-gradient-to-br from-[#B6FF00] to-[#8FBF00]">
                    <div className="w-full h-full rounded-full bg-[#0D0D0D] flex items-center justify-center">
                      <span className="text-[#B6FF00] text-xl font-bold">
                        {member.initials}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-white font-semibold text-lg text-center mb-1">
                  {member.name}
                </h3>

                {/* Role */}
                <p className="text-[#B6FF00] font-medium text-sm text-center mb-3">
                  {member.role}
                </p>

                {/* Bio */}
                <p className="text-[#aaa] text-sm leading-relaxed text-center mb-5 line-clamp-3">
                  {member.bio}
                </p>

                {/* Social Icons */}
                <div className="flex items-center justify-center gap-3">
                  {member.websiteUrl && member.websiteUrl !== '#' && (
                    <a
                      href={member.websiteUrl}
                      aria-label="Website"
                      className="w-9 h-9 rounded-full bg-[rgba(182,255,0,0.06)] hover:bg-[rgba(182,255,0,0.15)] flex items-center justify-center text-[#888] hover:text-[#B6FF00] hover:scale-110 transition-all duration-300"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {member.linkedinUrl && member.linkedinUrl !== '#' && (
                    <a
                      href={member.linkedinUrl}
                      aria-label="LinkedIn"
                      className="w-9 h-9 rounded-full bg-[rgba(182,255,0,0.06)] hover:bg-[rgba(182,255,0,0.15)] flex items-center justify-center text-[#888] hover:text-[#B6FF00] hover:scale-110 transition-all duration-300"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.githubUrl && member.githubUrl !== '#' && (
                    <a
                      href={member.githubUrl}
                      aria-label="GitHub"
                      className="w-9 h-9 rounded-full bg-[rgba(182,255,0,0.06)] hover:bg-[rgba(182,255,0,0.15)] flex items-center justify-center text-[#888] hover:text-[#B6FF00] hover:scale-110 transition-all duration-300"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </SectionReveal>
      </div>
    </section>
  )
}
