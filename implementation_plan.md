# SEO Enhancement Plan

To ensure the PhysioCare platform ranks highly in search engines (especially for local Google searches like "Physiotherapist in Nagpur"), we need to implement technical SEO best practices. Since this app is built with Next.js, we can leverage its powerful built-in metadata capabilities.

## User Review Required

Please review the proposed SEO improvements below. Once you approve, I will proceed with the implementation!

## Proposed Changes

### 1. Sitemap and Robots.txt
Search engines need explicit instructions on what to index and where to find your content.
- We will add `src/app/sitemap.ts` to automatically generate a `sitemap.xml` containing all your public pages (Home, About, Services, Contact, Book, Areas) across both English and Marathi locales.
- We will add `src/app/robots.ts` to instruct search engine bots to index the public site while explicitly **blocking** the `/dashboard` to keep patient data private.

### 2. LocalBusiness Structured Data (JSON-LD)
This is critical for a doctor/clinic. We will inject a hidden script (JSON-LD) into your website that search engines read to understand exactly who you are, what services you offer, and where you are located.
- This tells Google that this website is for a `Physician` / `MedicalClinic`.
- It will include Dr. Mansi's name, qualifications, clinic address, phone number, and opening hours.
- This drastically improves the chances of appearing in "Local Pack" (Google Maps) search results.

### 3. Dynamic and Localized Meta Tags
Currently, your site has a single, static title and description. We will upgrade this:
- **Per-Page Titles**: Every page will have a unique title (e.g., "About Dr. Mansi | PhysioCare" vs. "Book an Appointment | PhysioCare").
- **Localization**: If a user is viewing the Marathi version of the site, the SEO meta tags sent to search engines and social platforms will also be in Marathi.

### 4. Open Graph & Twitter Cards
When your website link is shared on WhatsApp, LinkedIn, Twitter, or Facebook, it should display a beautiful preview card.
- We will configure Open Graph (`og:`) and Twitter (`twitter:`) metadata across the layout.
- We can add a default sharing image (an Open Graph image) so that a professional graphic/photo appears whenever someone texts a link to your clinic.

### 5. Canonical URLs
We will explicitly define canonical URLs for each page. This prevents search engines from penalizing the site for duplicate content (e.g., if someone accesses the site with or without a trailing slash, or with different URL parameters).

---

## Verification Plan

### Automated/Code Verification
- I will run `npm run build` to verify the application builds perfectly with the new metadata APIs.
- I will verify the sitemap and robots routes exist in the build output.

### Manual Verification
- After deployment, you can verify the JSON-LD structure using the [Google Rich Results Test](https://search.google.com/test/rich-results) tool.
- You can test WhatsApp link previews by sharing the deployed URL to see the new title, description, and image card.
