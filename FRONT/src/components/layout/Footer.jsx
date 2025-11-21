import { Logo } from '@/components/ui'
import { Twitter, Linkedin, Github, Mail } from 'lucide-react'
import { useStrings } from '@/utils/localizations/useStrings'

/**
 * Footer Component
 * Minimalist and modern footer with glassmorphism design
 * Includes logo, navigation links, social media, and copyright
 */
export function Footer() {
  const Strings = useStrings()
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: Strings.about || 'About',
      items: [
        { label: Strings.aboutUs || 'About Us', href: '#' },
        { label: Strings.howItWorks || 'How it Works', href: '#' },
        { label: Strings.team || 'Team', href: '#' },
      ]
    },
    {
      title: Strings.legal || 'Legal',
      items: [
        { label: Strings.privacy || 'Privacy Policy', href: '#' },
        { label: Strings.terms || 'Terms of Service', href: '#' },
        { label: Strings.cookies || 'Cookies', href: '#' },
      ]
    },
    {
      title: Strings.support || 'Support',
      items: [
        { label: Strings.helpCenter || 'Help Center', href: '#' },
        { label: Strings.contact || 'Contact', href: '#' },
        { label: Strings.faq || 'FAQ', href: '#' },
      ]
    }
  ]

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Mail, href: 'mailto:contact@blocki.com', label: 'Email' },
  ]

  return (
    <footer className="mt-24 border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Logo size="default" withEffects={false} />
            </div>
            <h3 className="text-xl font-bold mb-2">Blocki</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {Strings.footerDescription || 'Decentralized real estate marketplace powered by Stellar blockchain. Invest in tokenized properties with transparency and security.'}
            </p>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-sm mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.items.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Blocki. {Strings.allRightsReserved || 'All rights reserved.'}
            </p>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>{Strings.poweredBy || 'Powered by'}</span>
              <a
                href="https://stellar.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-foreground transition-colors"
              >
                Stellar
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
