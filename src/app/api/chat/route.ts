import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

const SYSTEM_PROMPT = `You are Appalachian Growth Solutions' AI assistant. You help visitors learn about our eCommerce services:

- Shopify Store Development (custom themes, apps, migrations)
- WordPress + WooCommerce Development
- Store Redesign & Optimization
- SEO Optimization
- Digital Marketing (Google Ads, Meta Ads, TikTok Ads, Social Media)
- Conversion Rate Optimization
- 24/7 Support & Maintenance

Pricing tiers:
- Starter: $499/month (basic store setup)
- Professional: $1,499/month (full-featured store)
- Enterprise: Custom pricing (large-scale solutions)

Key stats: 1000+ stores designed, 3+ years experience, 100% client satisfaction.

Be friendly, concise, and helpful. Keep responses under 3 sentences unless the user asks for detailed info. Always offer to connect them with the team for a free consultation. Use a professional but approachable tone.`;

// Keyword-based fallback so users always get relevant answers
function getSmartFallback(message: string): string {
  const msg = message.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|howdy|greetings|yo|sup|hy|hii+|helo+)/.test(msg)) {
    return "Hi there! 👋 Welcome to Appalachian Growth Solutions. I'd love to help you with your eCommerce needs. Are you looking to build a new store, improve SEO, or boost your marketing?";
  }

  if (/how are you|how('?s| is) it going|what'?s up/.test(msg)) {
    return "I'm doing great, thanks for asking! 😊 I'm here to help you with any questions about our eCommerce services. What can I assist you with today?";
  }

  // SEO
  if (/\bseo\b|search engine|ranking|google ranking|organic traffic|backlink|keyword|serp/.test(msg)) {
    return "Great choice! Our SEO services include technical audits, on-page optimization, content strategy, and link building to boost your store's organic visibility. We've helped 1000+ stores improve their search rankings. Want to schedule a free SEO audit?";
  }

  // Pricing / Cost
  if (/\b(pric|cost|how much|rate|fee|budget|afford|cheap|expensive|plan|package)\b/.test(msg)) {
    return "We offer flexible pricing: **Starter** at $499/month for basic store setup, **Professional** at $1,499/month for full-featured stores, and **Enterprise** with custom pricing for large-scale solutions. Would you like a personalized quote?";
  }

  // Shopify
  if (/\bshopify\b/.test(msg)) {
    return "We're Shopify experts! We build custom themes, develop apps, handle migrations from other platforms, and optimize existing stores for better conversions. Our team has launched 1000+ successful Shopify stores. What kind of Shopify project are you considering?";
  }

  // WordPress / WooCommerce
  if (/(?:wordpress|woocommerce|woo-commerce)/i.test(msg)) {
    return "We specialize in WordPress + WooCommerce development! From custom themes and plugins to full store builds and performance optimization, we've got you covered. Want to discuss your WordPress project?";
  }

  // Website / Store Design / Redesign
  if (/\b(website|store|redesign|redesign|landing page|web design|web dev)\b/.test(msg)) {
    return "We design and build high-converting eCommerce stores on Shopify and WordPress. Whether you need a brand new store or a redesign of your existing one, our team delivers premium results. Would you like to see some of our portfolio work?";
  }

  // Digital Marketing / Ads
  if (/\b(marketing|ads|advertis|google ads|meta ads|facebook ads|tiktok|social media|ppc|campaign)\b/.test(msg)) {
    return "Our Digital Marketing services cover Google Ads, Meta Ads, TikTok Ads, and social media management. We create data-driven campaigns that maximize your ROI and drive qualified traffic to your store. Ready to scale your business?";
  }

  // Conversion Rate Optimization
  if (/\b(conversion|cro|optimize|optimization|a\/b|a b|split test|bounce rate)\b/.test(msg)) {
    return "Our CRO services analyze your store's performance and implement data-driven improvements to increase your conversion rate. We focus on UX, page speed, checkout flow, and more. Want a free conversion audit?";
  }

  // Services overview
  if (/\b(service|offer|provide|what do you do|help with|capability|speciali)\b/.test(msg)) {
    return "We offer: **Shopify Development**, **WordPress/WooCommerce**, **Store Redesign**, **SEO Optimization**, **Digital Marketing** (Google, Meta, TikTok ads), **CRO**, and **24/7 Support**. All starting from $499/month. Which service interests you most?";
  }

  // Portfolio / Examples / Past work
  if (/\b(portfolio|example|past work|case study|previous|sample|showcase|work)\b/.test(msg)) {
    return "We've completed 1000+ projects across Shopify and WordPress with 100% client satisfaction! You can check out our portfolio section on the website for real examples. Would you like to discuss a project similar to what you see?";
  }

  // Contact / Talk to someone
  if (/\b(contact|talk|speak|call|phone|reach|email|consult|book|appointment|schedule|meeting)\b/.test(msg)) {
    return "We'd love to connect! You can reach us at **appalachaingrowth@gmail.com** or fill out the contact form on our website. We typically respond within 24 hours. Want me to help you with anything else in the meantime?";
  }

  // Timeline / How long
  if (/\b(how long|timeline|deadline|turnaround|duration|when|fast|quick|speed)\b/.test(msg)) {
    return "Typical project timelines: **Basic store** - 1-2 weeks, **Full-featured store** - 3-5 weeks, **Custom enterprise** - varies by scope. We always prioritize quality while meeting your deadlines. What type of project are you planning?";
  }

  // Support / Maintenance
  if (/\b(support|maintain|maintenance|update|fix|bug|issue|help desk|24.?7)\b/.test(msg)) {
    return "We offer 24/7 support and maintenance for all our clients! This includes security updates, performance monitoring, bug fixes, and ongoing optimization. Your store stays running smoothly around the clock.";
  }

  // Testimonials / Reviews / Trust
  if (/\b(review|testimonial|trust|reliable|reputation|rating|client|customer feedback)\b/.test(msg)) {
    return "We're proud of our 100% client satisfaction rate across 1000+ projects! Our clients love our communication, quality of work, and the results we deliver. Check out our testimonials section for real client reviews!";
  }

  // Thank you
  if (/\b(thank|thanks|thx|appreciate)\b/.test(msg)) {
    return "You're welcome! 😊 If you have any more questions about our services, feel free to ask. We're here to help your business grow!";
  }

  // Yes / No responses
  if (/^(yes|yeah|yep|sure|ok|okay|great|perfect|awesome|cool|nice|sounds good)/.test(msg)) {
    return "Awesome! 🎉 To get started, you can fill out the contact form on our website or email us at appalachaingrowth@gmail.com. We'll set up a free consultation to discuss your project in detail. Anything else you'd like to know?";
  }

  if (/^(no|nope|nah|not really|nothing)/.test(msg)) {
    return "No problem! If anything comes up later, feel free to ask. We're always here to help. Have a great day! 😊";
  }

  // Who / About
  if (/\b(who are you|about you|about your( team| company)|tell me about)\b/.test(msg)) {
    return "We're Appalachian Growth Solutions — a premium digital agency with 3+ years of experience. We've designed 1000+ stores and specialize in eCommerce development, SEO, and digital marketing. Our team is dedicated to helping businesses grow online!";
  }

  // Location
  if (/\b(where|location|based|located|office|address|country)\b/.test(msg)) {
    return "We're based in the United States and serve clients worldwide! All our work is done remotely, so we can help you no matter where you're located. Want to start a project?";
  }

  // Refund / Guarantee
  if (/\b(refund|guarantee|money back|risk|warranty)\b/.test(msg)) {
    return "We stand behind our work with a satisfaction guarantee. If you're not happy with the results, we'll work with you to make it right. We believe in building long-term relationships with our clients.";
  }

  // Generic catch-all — still relevant
  return "Thanks for your message! I'd be happy to help with that. For the most detailed response, I'd recommend reaching out to our team directly at **appalachaingrowth@gmail.com** or through the contact form. Is there anything specific about our eCommerce services I can help with?";
}

export async function POST(request: NextRequest) {
  let userMessage = '';
  try {
    const { message } = await request.json();
    userMessage = message;

    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let reply: string | undefined;

    // Try AI SDK first
    try {
      const zai = await ZAI.create();
      const response = await zai.chat.completions.create({
        model: 'default',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      });
      reply = response.choices?.[0]?.message?.content;
    } catch (aiError) {
      console.error('[Chat] AI SDK error (falling back to smart responses):', aiError instanceof Error ? aiError.message : aiError);
    }

    // Use smart fallback if AI didn't return a reply
    if (!reply || reply.trim().length === 0) {
      reply = getSmartFallback(userMessage);
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ reply: getSmartFallback(userMessage) });
  }
}
