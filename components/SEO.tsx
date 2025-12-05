import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "Pinegroove offers a catalog of high-quality, royalty-free stock music perfect for videos, YouTube, social media, TV, and web projects.",
  image = "https://pub-2da555791ab446dd9afa8c2352f4f9ea.r2.dev/media/logo-pinegroove.svg", 
  url 
}) => {
  const siteTitle = "Pinegroove";
  const fullTitle = `${title} | ${siteTitle}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      {/* 
        Key attribute is CRITICAL here. 
        It ensures that nested Helmet components (like in TrackDetail) 
        override this specific tag instead of duplicating it or failing to render.
      */}
      <meta name="description" content={description} key="description" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} key="og:description" />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} key="twitter:description" />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};