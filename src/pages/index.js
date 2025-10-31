import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProblemAwareness from '../components/ProblemAwareness';
import SolutionOverview from '../components/SolutionOverview';
import WhyDifferent from '../components/WhyDifferent';
import SeasonalAwareness from '../components/SeasonalAwareness';
import CustomerJourneys from '../components/CustomerJourneys';
import SocialProof from '../components/SocialProof';
import Gallery from '../components/Gallery';
import PreQualificationForm from '../components/PreQualificationForm';
import Footer from '../components/Footer';

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Gutter Cover Company",
    "image": "https://guttercover.com/assets/logo-gc-2020.jpeg",
    "telephone": "+14403368092",
    "email": "info@guttercoversco.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cleveland",
      "addressRegion": "OH",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "41.4993",
      "longitude": "-81.6944"
    },
    "url": "https://guttercover.com",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "13:00"
      }
    ],
    "areaServed": [
      {
        "@type": "City",
        "name": "Cleveland"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Cuyahoga County"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Lake County"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Geauga County"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Summit County"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Portage County"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Medina County"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Lorain County"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "347"
    },
    "description": "Family-owned gutter protection specialists serving Northeast Ohio since 1998. We provide permanent solutions to stop cleaning gutters and prevent ice dams."
  };

  return (
    <>
      <Head>
        <title>Gutter Cover Co | Stop Cleaning Gutters Forever</title>
        <meta name="description" content="Northeast Ohio's trusted gutter protection specialists. Stop cleaning gutters and prevent ice dams with our permanent solutions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://guttercover.com/" />
        <meta property="og:title" content="Gutter Cover Co | Stop Cleaning Gutters Forever" />
        <meta property="og:description" content="Northeast Ohio's trusted gutter protection specialists. Permanent solutions to stop cleaning gutters and prevent ice dams." />
        <meta property="og:image" content="https://guttercover.com/assets/heater-cap/heated-gutters-hero.webp" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Gutter Cover Company" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://guttercover.com/" />
        <meta name="twitter:title" content="Gutter Cover Co | Stop Cleaning Gutters Forever" />
        <meta name="twitter:description" content="Northeast Ohio's trusted gutter protection specialists. Permanent solutions to stop cleaning gutters and prevent ice dams." />
        <meta name="twitter:image" content="https://guttercover.com/assets/heater-cap/heated-gutters-hero.webp" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://guttercover.com/" />

        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main-content">
        <Hero />
        <ProblemAwareness />
        <SolutionOverview />
        <WhyDifferent />
        <SeasonalAwareness />
        <CustomerJourneys />
        <SocialProof />
        <Gallery />
        <PreQualificationForm />
      </main>
      <Footer />
    </>
  );
} 