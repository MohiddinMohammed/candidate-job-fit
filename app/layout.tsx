import type { Metadata } from 'next';
import './globals.css';

const siteUrl = 'https://mohiddin-portfolio.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Gouse Mohiddin Mohammed — Product Owner | Technical Product Manager',
  description: 'Product Owner and Technical Product Manager focused on B2B SaaS, AI products, automation and technical product delivery.',
  alternates: { canonical: '/' },
  keywords: ['Product Owner', 'Technical Product Manager', 'AI Product Manager', 'B2B SaaS', 'AI products', 'automation', 'digital transformation'],
  authors: [{ name: 'Gouse Mohiddin Mohammed', url: siteUrl }],
  creator: 'Gouse Mohiddin Mohammed',
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Gouse Mohiddin Mohammed — Product Owner | Technical Product Manager',
    description: 'Product Owner and Technical Product Manager focused on B2B SaaS, AI products, automation and technical product delivery.',
    siteName: 'Gouse Mohiddin Mohammed',
    locale: 'en_DE',
  },
  twitter: {
    card: 'summary',
    title: 'Gouse Mohiddin Mohammed — Product Owner | Technical Product Manager',
    description: 'Product Owner and Technical Product Manager focused on B2B SaaS, AI products, automation and technical product delivery.',
  },
  robots: { index: true, follow: true },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    '@id': siteUrl + '/#person',
    name: 'Gouse Mohiddin Mohammed',
    description: 'Product Owner and Technical Product Manager focused on B2B SaaS, AI products, automation and technical product delivery.',
    jobTitle: 'Product Owner · Technical Product Manager',
    url: siteUrl,
    sameAs: [
      'https://www.linkedin.com/in/mohammed-8472781a7/',
      'https://github.com/MohiddinMohammed',
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        {children}
      </body>
    </html>
  );
}