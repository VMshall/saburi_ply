import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getMetaConfig } from '../config/metaConfig';

/**
 * Helper to generate BreadcrumbList Schema dynamically based on pathname
 */
const generateBreadcrumbSchema = (pathname) => {
  const paths = pathname.split('/').filter((p) => p);
  const itemListElement = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.saburiply.com"
    }
  ];

  let currentUrl = "https://www.saburiply.com";
  paths.forEach((path, index) => {
    currentUrl += `/${path}`;
    const name = path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    itemListElement.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": name,
      "item": currentUrl
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  };
};

/**
 * Helper to generate Product Schema
 */
const generateProductSchema = (pathname, meta) => {
  const productName = meta.title.split('|')[0].trim();
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "image": "https://www.saburiply.com/images/saburi.jpg",
    "description": meta.description,
    "brand": {
      "@type": "Brand",
      "name": "Saburi Ply"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Saburi Plywood Pvt Ltd",
      "url": "https://www.saburiply.com"
    },
    "material": "Plywood",
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Grade", "value": "Premium" },
      { "@type": "PropertyValue", "name": "Certification", "value": "ISI Certified" }
    ],
    "category": "Plywood",
    "url": `https://www.saburiply.com${pathname}`
  };
};

/**
 * Helper to generate LocalBusiness Schema
 */
const generateLocalBusinessSchema = (pathname) => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Saburi Plywood",
    "image": "https://www.saburiply.com/images/saburi.jpg",
    "telephone": "1800313666000",
    "email": "info@saburiply.com",
    "url": "https://www.saburiply.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "New Town Square, Unit 3A, Atghora Rajarhat, Chinar Park Crossing",
      "addressLocality": "Kolkata",
      "addressRegion": "West Bengal",
      "postalCode": "700136",
      "addressCountry": "IN"
    },
    "openingHours": "Mo,Tu,We,Th,Fr,Sa 10:00-20:00"
  };
};

/**
 * Helper to generate FAQPage Schema
 */
const generateFAQSchema = (meta) => {
  const productName = meta.title.split('|')[0].trim();
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is ${productName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": meta.description
        }
      },
      {
        "@type": "Question",
        "name": `Why choose Saburi Ply?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Saburi Ply is a leading manufacturer in India, providing premium quality, durable, and reliable plywood and blockboard solutions."
        }
      }
    ]
  };
};

/**
 * PageMeta Component
 */
const PageMeta = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const meta = getMetaConfig(pathname);

  // Generate canonical URL
  const canonicalUrl = `https://www.saburiply.com${pathname}`;

  // Array to hold all schemas for the current page
  const schemas = [];

  // 1. BreadcrumbList Schema (Every Page)
  schemas.push(generateBreadcrumbSchema(pathname));

  // 2. Organization Schema (Homepage Only)
  if (pathname === '/') {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Saburi Plywood Pvt Ltd",
      "alternateName": "Saburi Ply",
      "url": "https://www.saburiply.com",
      "logo": "https://www.saburiply.com/images/saburi.jpg",
      "foundingDate": "1990",
      "founder": {
        "@type": "Person",
        "name": "Gajanand Munka"
      },
      "description": "Leading plywood manufacturer in India offering premium quality plywood, block boards and decorative panels",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "New Town Square, Unit 3A, Atghora Rajarhat, Chinar Park Crossing",
        "addressLocality": "Kolkata",
        "addressRegion": "West Bengal",
        "postalCode": "700136",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "1800313666000",
        "email": "info@saburiply.com",
        "availableLanguage": ["English", "Hindi", "Bengali"],
        "url": "https://www.saburiply.com/contact"
      },
      "sameAs": [
        "https://www.linkedin.com/company/saburi-ply",
        // "https://www.wikidata.org/wiki/[YOUR-QID]",
        "https://www.indiamart.com/saburi-ply",
        "https://www.crunchbase.com/organization/saburi-ply"
      ]
    });
  }

  // 3. Product Schema & Product FAQ (/products/*)
  if (pathname.startsWith('/products/')) {
    schemas.push(generateProductSchema(pathname, meta));
    schemas.push(generateFAQSchema(meta));
  }

  // 4. LocalBusiness Schema (/contact, /plywood-dealers-*)
  if (pathname === '/contact' || pathname.startsWith('/plywood-dealers-')) {
    schemas.push(generateLocalBusinessSchema(pathname));
  }

  // 5. Blog Article & FAQ (/blog/*)
  if (pathname.startsWith('/blog/') && pathname !== '/blog') {
    schemas.push(generateFAQSchema(meta));
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      <meta name="author" content="Saburi Ply" />
      <meta name="publisher" content="Saburi Ply" />
      <meta name="robots" content={pathname === '/thank-you' ? 'noindex, follow' : 'index, follow'} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags for Facebook/LinkedIn */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Saburi Ply" />
      <meta property="og:image" content="https://www.saburiply.com/images/saburi.jpg" />
      <meta property="og:image:alt" content="Saburi Ply - Leading Plywood Manufacturer" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content="https://www.saburiply.com/images/saburi.jpg" />
      <meta name="twitter:site" content="@saburiply" />

      {/* Additional SEO Meta Tags */}
      <meta name="language" content="English" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="ICBM" content="20.5937,78.9629" />

      {/* Industry Specific Meta Tags */}
      <meta name="category" content="Manufacturing" />
      <meta name="industry" content="Plywood Manufacturing" />
      <meta name="business" content="B2B, B2C" />

      {/* Dynamic JSON-LD Structured Data */}
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}

      {/* Favicon and App Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/images/saburi.jpg" />
      <link rel="icon" type="image/png" sizes="16x16" href="/images/saburi.jpg" />
      <link rel="apple-touch-icon" sizes="180x180" href="/images/saburi.jpg" />
    </Helmet>
  );
};

export default PageMeta;
