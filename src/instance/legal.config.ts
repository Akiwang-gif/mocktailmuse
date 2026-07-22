import { siteConfig } from "@/config/site.config";

export interface ConfiguredLegalSection {
  title: string;
  body?: string[];
  items?: string[];
}

export interface ConfiguredLegalPage {
  eyebrow: string;
  title: string;
  metadataTitle: string;
  metadataDescription: string;
  intro: string;
  sections: ConfiguredLegalSection[];
}

const siteName = siteConfig.name;
const operatorName = siteConfig.operator.name;
const operatorCountry = siteConfig.operator.country;
const contactEmail = siteConfig.contactEmail;
const legalEmail = siteConfig.legalEmail;

export const legalConfig = {
  identity: {
    siteName,
    contactEmail,
    operatorName,
    operatorCountry,
    legalStatus: siteConfig.operator.legalStatus,
  },
  pages: {
    about: {
      eyebrow: "About Us",
      title: "Independent editorial coverage for mocktail and beverage inspiration.",
      metadataTitle: "About Us",
      metadataDescription: `Learn about ${siteName} and its creative mocktail and alcohol-free beverage coverage.`,
      intro: `${siteName} publishes original editorial coverage for readers who want clearer ways to discover mocktail recipes, flavor guides, alcohol-free drinks, entertaining ideas, and beverage inspiration for everyday moments and special gatherings.`,
      sections: [
        {
          title: "Who We Are",
          body: [
            `${siteName} is an independent editorial website covering mocktail recipes, alcohol-free drinks, flavor guides, ingredients, entertaining ideas, and beverage inspiration.`,
            `${siteName} publishes original drink recipes, flavor guides, beverage recommendations, curated lists, and educational articles for readers who want better alcohol-free drink ideas.`,
            `${siteName} is independently operated by the ${operatorName} in the ${operatorCountry}.`,
          ],
        },
        {
          title: "Our Mission",
          body: [
            "Our mission is to help readers discover better alcohol-free drinks through trustworthy editorial content. We write articles that explain flavor combinations, share practical drink recipes, highlight beverage trends, and make mocktail ideas easier to evaluate and enjoy.",
          ],
        },
        {
          title: "Editorial Standards",
          items: [
            "Original editorial content is preferred.",
            "Publicly available information may be cited when it helps readers understand a topic.",
            "Factual corrections are made when necessary.",
            "Sponsored content is clearly disclosed.",
          ],
        },
        {
          title: "Copyright & API Disclaimer",
          body: [
            `${siteName} is not affiliated with, endorsed by, or sponsored by any beverage brand, product manufacturer, retailer, app store, or copyright holder unless clearly stated.`,
            `${siteName} does not use unauthorized APIs, automated scraping systems, proprietary services, or brand-exclusive databases to obtain copyrighted content, restricted product assets, or confidential information.`,
            "Any trademarks, product names, beverage names, brand names, and logos belong to their respective owners and are used only for editorial, commentary, review, or informational purposes.",
          ],
        },
        {
          title: "Contact",
          body: [`Email: ${contactEmail}`],
        },
      ],
    },
    contact: {
      metadataTitle: "Contact Us",
      metadataDescription: `Contact the ${siteName} editorial desk.`,
      eyebrow: "Contact Us",
      title: "Send tips, updates, and collaboration notes.",
      intro: `For mocktail recipe ideas, ingredient tips, beverage trend suggestions, flavor guide updates, privacy requests, copyright notices, or drink content collaboration inquiries, contact the ${operatorName} using the channels below.`,
      sections: [],
      contactPanels: ["General Inquiries", "Press & Partnerships", "Privacy Requests", "Copyright / DMCA"],
      responseTime: "We typically respond within 2-3 business days.",
      operatorLine: `Operated by ${operatorName}, ${operatorCountry}.`,
    },
    privacy: {
      eyebrow: "Privacy Policy",
      title: "Privacy Policy",
      metadataTitle: "Privacy Policy",
      metadataDescription: `Privacy Policy for ${siteName}.`,
      intro: `This Privacy Policy explains how ${siteName} collects, uses, shares, and protects information when readers visit the site, browse mocktail recipes, subscribe to email updates, or contact the editorial team.`,
      sections: [
        { title: "Data Controller", body: [operatorName, operatorCountry, `Privacy contact: ${legalEmail}`] },
        {
          title: "Information We Collect",
          items: [
            "Newsletter information, such as an email address and subscription preferences, when a reader signs up voluntarily.",
            "Contact information and message details that readers send by email or contact forms.",
            "Analytics data, including pages viewed, referring pages, approximate location, device type, browser type, timestamps, and aggregate engagement signals.",
            "Cookie and similar technology data used for security, analytics, preferences, performance, and site operation.",
            "Technical logs used to protect the website, diagnose errors, prevent abuse, and maintain service reliability.",
          ],
        },
        {
          title: "How We Use Information",
          items: [
            `To operate, secure, maintain, and improve ${siteName}.`,
            "To send newsletters, recipe updates, editorial notes, or subscription communications requested by readers.",
            "To understand which recipes, ingredients, flavor guides, and alcohol-free beverage topics are useful to readers.",
            "To respond to privacy, copyright, editorial, partnership, or support requests.",
            "To measure aggregate performance and improve page speed, navigation, content quality, and reader experience.",
          ],
        },
        {
          title: "Newsletter Data",
          body: [
            "If you subscribe to a newsletter, we use your email address to send requested messages. You can unsubscribe through the link in an email or by contacting us.",
            "Newsletter providers may process email addresses, delivery events, and engagement data on our behalf so we can manage subscriptions and improve the usefulness of email content.",
          ],
        },
        {
          title: "Analytics and Cookies",
          body: [
            `${siteName} may use analytics tools and cookies to understand aggregate site usage, improve recipe discovery, detect technical issues, and measure content performance.`,
            "Cookies may be set by the site or by third-party services that support analytics, security, hosting, embedded content, advertising measurement, or affiliate attribution.",
          ],
        },
        {
          title: "Third-party Services",
          items: [
            "Hosting, security, caching, storage, and network services such as Cloudflare.",
            "Analytics and search diagnostics services such as Google Analytics and Google Search Console.",
            "Newsletter, email, contact, affiliate, advertising, or embedded content services if enabled on the website.",
            "External websites linked from articles, recipes, product mentions, or editorial resources.",
          ],
        },
        {
          title: "GDPR and International Privacy Rights",
          body: [
            `Where the GDPR, UK GDPR, or similar privacy laws apply, ${siteName} relies on legal bases that may include consent, legitimate interests, legal obligations, and the need to respond to reader requests.`,
            "Eligible users may request access, correction, deletion, restriction, objection, portability, or withdrawal of consent, subject to applicable law and verification.",
          ],
        },
        {
          title: "CCPA / CPRA Rights",
          body: [
            "Eligible California residents may have rights to know, access, correct, delete, limit certain sensitive information uses, and opt out of certain sharing or sale of personal information.",
            `${siteName} does not knowingly sell personal information in the ordinary meaning of selling reader data for money. Some analytics, advertising, or affiliate technologies may be considered sharing under certain privacy laws.`,
          ],
        },
        {
          title: "Data Retention and Security",
          body: [
            "We keep personal information only as long as reasonably necessary for the purposes described in this policy, unless a longer period is required for legal, security, accounting, or operational reasons.",
            "No website can guarantee absolute security, but we use reasonable administrative and technical measures to protect information.",
          ],
        },
        { title: "Contact", body: [`For privacy questions or requests, contact ${legalEmail}`] },
      ],
    },
    terms: {
      eyebrow: "Terms",
      title: "Terms of Service",
      metadataTitle: "Terms of Service",
      metadataDescription: `Terms of Service for ${siteName}.`,
      intro: `These Terms of Service govern access to and use of ${siteName}, an independently operated editorial website about mocktail recipes, flavor guides, and alcohol-free beverage inspiration.`,
      sections: [
        { title: "Acceptance of Terms", body: [`By accessing ${siteName}, you agree to these Terms of Service. If you do not agree, you should not use the website.`] },
        {
          title: "Editorial and Recipe Content",
          body: [
            `${siteName} provides recipe ideas, flavor guidance, ingredient commentary, and alcohol-free beverage inspiration for informational and editorial purposes.`,
            "Recipes, preparation times, ingredient amounts, techniques, product references, and serving suggestions may vary based on ingredients, equipment, reader skill, substitutions, and local conditions.",
          ],
        },
        {
          title: "Recipe Disclaimer",
          body: [
            "Recipes are not medical, nutritional, dietary, or professional advice. Nutrition values, if shown, are estimates only and may differ from actual results.",
            "Readers are responsible for reviewing ingredients, labels, substitutions, allergens, dietary restrictions, and preparation methods before making or serving a drink.",
          ],
        },
        {
          title: "Ingredient and Allergy Warning",
          body: [
            "Mocktail recipes may include common allergens or sensitivities, including citrus, herbs, spices, honey, nuts, dairy alternatives, preservatives, botanicals, or packaged ingredients.",
            "If you have allergies, sensitivities, medical conditions, pregnancy-related restrictions, medication interactions, or dietary needs, consult a qualified professional before consuming unfamiliar ingredients.",
          ],
        },
        {
          title: "Alcohol-free Disclaimer",
          body: [
            `${siteName} focuses on alcohol-free and low/no-alcohol inspiration, but readers must verify product labels and ingredient lists. Some products marketed as non-alcoholic may contain trace alcohol depending on jurisdiction and manufacturing method.`,
            "If strict alcohol avoidance is required for health, religious, legal, recovery, pregnancy, medication, or personal reasons, independently confirm every ingredient before use.",
          ],
        },
        {
          title: "Content Accuracy Limitation",
          body: [
            "We aim to publish accurate and useful content, but we do not guarantee that every article, recipe, product note, or external reference is complete, current, suitable, available, or error-free.",
            "Readers use the website and any recipe or recommendation at their own discretion.",
          ],
        },
        {
          title: "User Responsibilities",
          body: [`Users are responsible for using the website lawfully, respecting intellectual property rights, and avoiding activity that could disrupt, damage, or interfere with ${siteName} or other users.`],
        },
        { title: "Intellectual Property", body: [`Original ${siteName} articles, page text, editorial structure, recipes, photography, and site materials are protected by applicable intellectual property laws unless otherwise stated.`] },
        { title: "External Links", body: [`${siteName} may link to third-party websites. We are not responsible for the content, privacy practices, products, safety, or availability of external websites.`] },
        { title: "Limitation of Liability", body: [`To the fullest extent permitted by law, ${operatorName} is not liable for indirect, incidental, consequential, special, or personal damages arising from use of the website, recipes, ingredients, or linked resources.`] },
        { title: "Changes to Terms", body: [`We may update these Terms from time to time. Continued use of ${siteName} after changes are posted means you accept the updated Terms.`] },
        { title: "Governing Law", body: [`These Terms are governed by the laws of the ${operatorCountry}, where applicable.`] },
      ],
    },
    cookie: {
      eyebrow: "Cookie Policy",
      title: "Cookie Policy",
      metadataTitle: "Cookie Policy",
      metadataDescription: `Cookie Policy for ${siteName}.`,
      intro: `This Cookie Policy explains how ${siteName} may use cookies and similar technologies to operate the website, understand reader behavior, and improve mocktail and beverage content.`,
      sections: [
        {
          title: "What Cookies Are",
          body: ["Cookies are small files stored on a browser or device. Similar technologies may include pixels, local storage, tags, SDKs, or server logs."],
        },
        {
          title: "Necessary Cookies",
          body: ["Necessary cookies support core website functions such as security, page delivery, session handling, fraud prevention, and basic site operation."],
        },
        {
          title: "Analytics Cookies",
          body: [`Analytics cookies help ${siteName} understand aggregate reader behavior, including which drink recipes, flavor guides, and beverage pages are visited, how readers find the site, and where technical improvements may be needed.`],
        },
        {
          title: "Newsletter and Preference Cookies",
          body: ["Preference cookies may remember reader choices, subscription states, form settings, or display preferences if those features are available on the website."],
        },
        {
          title: "Affiliate and Advertising Cookies",
          body: ["Affiliate, sponsorship, or advertising cookies may help attribute referrals, measure sponsored placements, prevent fraud, or understand whether links and recommendations are useful to readers."],
        },
        {
          title: "Third-party Cookies",
          body: ["Third-party services used for hosting, analytics, embedded content, newsletter forms, affiliate links, advertising measurement, or security may set their own cookies according to their policies."],
        },
        {
          title: "Managing Cookies",
          body: [
            "Most browsers allow users to block, delete, or limit cookies through browser settings. Disabling cookies may affect some website functionality.",
            "Users can also manage Google personalized ads at https://myadcenter.google.com/personalizationoff",
          ],
        },
      ],
    },
    editorial: {
      eyebrow: "Editorial Policy",
      title: "Editorial Policy",
      metadataTitle: "Editorial Policy",
      metadataDescription: `Editorial Policy for ${siteName}.`,
      intro: `${siteName} maintains editorial standards intended to make its mocktail, flavor guide, and alcohol-free beverage coverage useful, transparent, and trustworthy for readers.`,
      sections: [
        {
          title: "Content Standards",
          items: [
            "Articles should be useful, readable, original, and clearly focused on mocktails, alcohol-free drinks, ingredients, entertaining, or beverage culture.",
            "Product references, ingredient guidance, and serving ideas should be presented with context rather than as guaranteed outcomes.",
            "Claims about nutrition, wellness, safety, or product suitability should be limited, qualified, and not presented as medical advice.",
          ],
        },
        {
          title: "Recipe Development and Testing",
          body: [
            "Recipes are developed or reviewed for practical preparation, flavor balance, ingredient accessibility, and editorial clarity.",
            "When a recipe has not been physically tested in every possible variation, we avoid implying that all substitutions, brands, tools, or serving conditions will produce identical results.",
          ],
        },
        { title: "Editorial Independence", body: [`${siteName} selects topics based on reader value, editorial relevance, beverage trends, ingredient seasonality, flavor education, and public interest. Editorial opinions remain independent.`] },
        { title: "Sources", body: [`${siteName} prefers original editorial analysis, recipe development, and practical beverage guidance. Publicly available information may be referenced when it supports drink recipes, flavor education, product commentary, review, or educational coverage.`] },
        {
          title: "Corrections",
          body: [
            `If a factual error is identified, ${siteName} may correct, update, or clarify the article.`,
            `Readers can request corrections by contacting ${contactEmail} with the page URL and a clear description of the issue.`,
          ],
        },
        { title: "AI-assisted Writing Policy", body: [`${siteName} may use AI-assisted tools for drafting support, research organization, editing, or formatting. Articles are reviewed by a human before publication to check accuracy, usefulness, recipe clarity, beverage safety, and editorial fit.`] },
        { title: "Sponsored Content Disclosure", body: ["Sponsored content, paid placements, affiliate relationships, gifted products, or other material commercial relationships are disclosed when applicable."] },
      ],
    },
    affiliate: {
      eyebrow: "Affiliate Disclosure",
      title: "Affiliate Disclosure",
      metadataTitle: "Affiliate Disclosure",
      metadataDescription: `Affiliate Disclosure for ${siteName}.`,
      intro: `This disclosure explains how affiliate links, sponsored content, beverage product recommendations, or drink-related partnerships may appear on ${siteName}.`,
      sections: [
        {
          title: "Affiliate Links",
          body: [
            `${siteName} may participate in affiliate programs related to beverage products, bar tools, glassware, ingredients, books, subscriptions, retailers, or other drink-making resources.`,
            `Purchases made through affiliate links may earn a commission for ${siteName} at no additional cost to the reader.`,
          ],
        },
        {
          title: "Sponsored Content",
          body: [
            "Sponsored articles, paid placements, gifted products, brand collaborations, or other material commercial relationships will be disclosed where appropriate.",
            "A sponsorship does not guarantee a positive review, recommendation, or placement unless the nature of the placement is clearly described.",
          ],
        },
        { title: "Editorial Independence", body: [`Affiliate relationships do not control ${siteName} editorial opinions. Drink recommendations, product lists, commentary, and reviews are intended to remain independent and useful to readers.`] },
        { title: "Reader Responsibility", body: ["Readers should evaluate product labels, ingredients, prices, shipping terms, retailer policies, and suitability before purchasing or consuming any product."] },
        { title: "Contact", body: [`Questions about affiliate or sponsored content can be sent to ${contactEmail}.`] },
      ],
    },
    dmca: {
      eyebrow: "DMCA / Copyright",
      title: "DMCA / Copyright",
      metadataTitle: "DMCA / Copyright",
      metadataDescription: `DMCA and copyright notice process for ${siteName}.`,
      intro: `${siteName} respects intellectual property rights in recipes, photography, beverage content, brand materials, and written work, and provides this process for copyright holders to submit notices.`,
      sections: [
        {
          title: "Submitting a Copyright Notice",
          body: [`Copyright holders or authorized representatives can submit notices to ${legalEmail}. Please include enough information for ${operatorName} to identify the material and review the request.`],
        },
        {
          title: "Required Information",
          items: [
            "Your full legal name or the name of the rights holder you represent.",
            "Your contact email address.",
            "A description of the copyrighted work claimed to be infringed.",
            `The exact ${siteName} URL or location of the material at issue.`,
            "A statement that you have a good-faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.",
            "A statement that the information in the notice is accurate and that you are the copyright owner or authorized to act on behalf of the owner.",
            "Your physical or electronic signature.",
          ],
        },
        {
          title: "Review and Response",
          body: [
            `${siteName} may remove, restrict, update, or request additional information about material after receiving a valid copyright notice.`,
            "Incomplete notices may delay review.",
          ],
        },
        {
          title: "Counter-notification Process",
          body: [`If material is removed or restricted because of a copyright notice, the affected party may submit a counter-notification explaining why the material was removed by mistake or misidentification. Counter-notifications should be sent to ${legalEmail} and include contact information, the removed material, and a good-faith statement supporting the request.`],
        },
        { title: "Contact", body: [`Copyright / DMCA contact: ${legalEmail}`] },
      ],
    },
    recipeDisclaimer: {
      eyebrow: "Recipe Disclaimer",
      title: "Recipe Disclaimer",
      metadataTitle: "Recipe Disclaimer",
      metadataDescription: `Recipe disclaimer for ${siteName}.`,
      intro: `${siteName} publishes alcohol-free drink recipes and ingredient guidance for editorial inspiration. Readers are responsible for deciding whether a recipe, ingredient, substitution, or preparation method is suitable for their needs.`,
      sections: [
        {
          title: "Nutrition Disclaimer",
          body: [
            "Nutrition information, calories, sugar estimates, serving sizes, and preparation times are estimates only when provided.",
            "Actual nutrition can vary based on ingredient brands, measurements, substitutions, glass size, garnish, ice, dilution, and serving method.",
          ],
        },
        {
          title: "Allergy Warning",
          body: [
            "Recipes may include or reference allergens and sensitivities such as citrus, herbs, spices, honey, dairy alternatives, nuts, packaged syrups, botanicals, preservatives, or cross-contact risks.",
            "Always check ingredient labels and consult a qualified professional if you have allergies, medical conditions, medication concerns, pregnancy-related restrictions, or strict dietary requirements.",
          ],
        },
        {
          title: "Ingredient Substitution",
          body: [
            "Ingredient substitutions can change flavor, texture, sweetness, acidity, color, allergens, nutrition, and whether a drink remains suitable for a reader's needs.",
            "Readers should verify substitutes independently and adjust recipes carefully.",
          ],
        },
        {
          title: "Responsible Preparation",
          body: [
            "Use clean tools, safe food handling practices, properly stored ingredients, and age-appropriate supervision when preparing drinks.",
            "Be careful with sharp tools, hot syrups, carbonation pressure, glassware, ice, and ingredients that may interact with medications or health conditions.",
          ],
        },
        {
          title: "Alcohol-free Verification",
          body: [
            "Although the site focuses on alcohol-free inspiration, some packaged ingredients marketed as non-alcoholic may contain trace alcohol or vary by jurisdiction.",
            "If strict avoidance is required, verify every label and manufacturer statement before using an ingredient.",
          ],
        },
      ],
    },
    accessibility: {
      eyebrow: "Accessibility",
      title: "Accessibility Statement",
      metadataTitle: "Accessibility Statement",
      metadataDescription: `Accessibility statement for ${siteName}.`,
      intro: `${siteName} aims to make its mocktail recipes, flavor guides, and beverage editorial content accessible and usable for as many readers as possible.`,
      sections: [
        {
          title: "Our Commitment",
          body: [
            "We work to support readable text, clear structure, keyboard-friendly navigation, useful headings, descriptive links, and accessible image alternatives where practical.",
            "Accessibility is an ongoing process, and we review design, content, and technical changes as the website evolves.",
          ],
        },
        {
          title: "Known Limitations",
          body: [
            "Some third-party embeds, external links, advertising technology, analytics tools, or older content may not fully meet the same accessibility goals.",
            "We aim to improve issues when they are identified and reasonably within our control.",
          ],
        },
        {
          title: "Contact",
          body: [
            `If you experience an accessibility barrier on ${siteName}, contact ${contactEmail}.`,
            "Please include the page URL, a description of the issue, your browser or assistive technology if relevant, and the format or accommodation that would help.",
          ],
        },
      ],
    },
  },
} as const;
