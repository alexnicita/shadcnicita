import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BaseLayout from "./shared/BaseLayout";
import MarkdownRenderer from "./shared/MarkdownRenderer";

const privacyPolicyContent = `## Privacy Policy

**Last updated: July 17, 2025**

Thank you for visiting our website. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you visit our website.

## Information We Collect

When you visit our website, we may collect certain information automatically, including:

- Your IP address
- Browser type and version
- Pages you visit on our site
- Time and date of your visit
- Referring website

## Cookies and Tracking Technologies

When you visit or log in to our website, cookies and similar technologies may be used by our online data partners or vendors to associate these activities with other personal information they or others have about you, including by association with your email. We (or service providers on our behalf) may then send communications and marketing to these email. You may opt out of receiving this advertising by visiting https://app.retention.com/optout.

## How We Use Your Information

We may use the information we collect to:

- Improve our website and user experience
- Analyze website traffic and usage patterns
- Communicate with you about our services
- Comply with legal obligations

## Information Sharing

We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this Privacy Policy or as required by law.

## Your Rights

You have the right to:

- Access the personal information we have about you
- Request correction of inaccurate information
- Request deletion of your personal information
- Opt out of certain communications

## Contact Us

If you have any questions about this Privacy Policy, please contact us at:

**Email:** alex@nicita.cc

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page with an updated "Last updated" date.`;

export default function Privacy() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BaseLayout
      showLoading={isLoading}
      loadingText="📄"
      className="p-8 md:p-16"
    >
      <header className="flex justify-between items-center mb-16">
        <Link
          to="/"
          className="text-2xl font-bold hover:text-muted-foreground transition-colors"
        >
          ←
        </Link>
      </header>

      <div className="max-w-2xl mx-auto">
        <article>
          <MarkdownRenderer content={privacyPolicyContent} />
        </article>
      </div>
    </BaseLayout>
  );
}
