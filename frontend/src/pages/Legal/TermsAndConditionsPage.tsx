import React from 'react';
import { ShieldCheck, Scale, FileText } from 'lucide-react';

interface TermsAndConditionsPageProps {
  onBack: () => void;
  onJoinAsHost?: () => void;
  onJoinAsGuest?: () => void;
}

interface TermSection {
  id: string;
  number: string;
  title: string;
  content: React.ReactNode;
}

export function TermsAndConditionsPage({
  onBack,
  onJoinAsHost,
  onJoinAsGuest,
}: TermsAndConditionsPageProps) {
  const sections: TermSection[] = [
    {
      id: 'section-1',
      number: '1',
      title: 'ABOUT DATEBOSS',
      content: (
        <div className="space-y-3">
          <p>
            Dateboss is an online dating and social connection platform that allows adults to
            discover potential dating partners, communicate, and arrange in-person social
            experiences.
          </p>
          <p>
            Dateboss offers a two-way offer system that allows members to initiate and receive
            offers for social and dating activities, including:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#3F3A34]">
            <li>Lunch dates and brunch dates.</li>
            <li>Dinner dates and restaurant outings.</li>
            <li>Coffee dates and casual meetups.</li>
            <li>Concerts, sporting events, and entertainment.</li>
            <li>Movies, performances, and cultural events.</li>
            <li>Recreational activities and other mutually agreed social experiences.</li>
          </ul>
          <p>
            Members may request offers from other members or independently submit offers to other
            members.
          </p>
          <p>
            Dateboss provides a platform for facilitating introductions, communication, and date
            arrangements. Dateboss is not a dating agency, escort agency, employment service, or
            provider of personal companionship.
          </p>
        </div>
      ),
    },
    {
      id: 'section-2',
      number: '2',
      title: 'ELIGIBILITY AND AGE REQUIREMENTS',
      content: (
        <div className="space-y-3">
          <p className="font-semibold text-[#16120F]">
            You must be at least 18 years old to register or use Dateboss.
          </p>
          <p>By using the Platform, you represent and warrant that:</p>
          <ol className="list-decimal pl-5 space-y-1.5 text-[#3F3A34]">
            <li>You are at least 18 years of age.</li>
            <li>You have the legal capacity to enter into these Terms.</li>
            <li>All registration information you provide is accurate and current.</li>
            <li>You are creating an account for yourself and not impersonating another person.</li>
            <li>You are not using the Platform for unlawful purposes.</li>
            <li>You will comply with all applicable local, national, and international laws.</li>
          </ol>
          <p>
            Dateboss reserves the right to request age or identity verification and suspend
            accounts that cannot establish eligibility.
          </p>
        </div>
      ),
    },
    {
      id: 'section-3',
      number: '3',
      title: 'ACCOUNTS AND MEMBER RESPONSIBILITIES',
      content: (
        <div className="space-y-3">
          <p>
            Members are responsible for maintaining the confidentiality of their login credentials
            and all activity conducted through their accounts.
          </p>
          <p>You agree to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#3F3A34]">
            <li>Provide truthful and accurate profile information.</li>
            <li>Upload photographs that represent you and that you have permission to use.</li>
            <li>Maintain respectful communication with other members.</li>
            <li>Avoid misleading other members about your identity, intentions, or circumstances.</li>
            <li>Notify Dateboss of suspected unauthorized account access.</li>
            <li>Maintain only one active personal account unless expressly authorized.</li>
          </ul>
          <p>
            Dateboss reserves the right to review, restrict, suspend, or terminate accounts that
            violate these Terms.
          </p>
        </div>
      ),
    },
    {
      id: 'section-4',
      number: '4',
      title: 'DATE REQUESTS AND OFFERS',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-serif font-bold text-base text-[#16120F] mb-1">
              4.1 Member-Initiated Requests
            </h4>
            <p>
              A member may create a date request describing the type of experience they would like
              to enjoy. Requests may include a proposed activity, location, date, time, and
              optional requested contribution or offer amount.
            </p>
          </div>
          <div>
            <h4 className="font-serif font-bold text-base text-[#16120F] mb-1">
              4.2 Member-Initiated Offers
            </h4>
            <p className="mb-2">
              Members may submit offers to other members for proposed social experiences, including
              lunches, dinners, entertainment, and events.
            </p>
            <p className="mb-1.5">An offer may include:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#3F3A34]">
              <li>The proposed date activity.</li>
              <li>The proposed date and time.</li>
              <li>The proposed location.</li>
              <li>An optional monetary contribution or date incentive.</li>
              <li>Additional details relevant to the proposed experience.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif font-bold text-base text-[#16120F] mb-1">
              4.3 Acceptance, Rejection, and Counteroffers
            </h4>
            <div className="space-y-2">
              <p>Members may accept, reject, or counter an offer at their discretion.</p>
              <p>
                No member is obligated to accept an offer, respond to a request, or participate in
                a date.
              </p>
              <p>
                An accepted offer indicates agreement to the proposed date arrangement, subject to
                any additional details mutually agreed upon by the members.
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-serif font-bold text-base text-[#16120F] mb-1">
              4.4 No Guarantee of a Date
            </h4>
            <p>
              Dateboss does not guarantee that a request will receive offers, that an offer will be
              accepted, or that an agreed date will take place.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'section-5',
      number: '5',
      title: 'DATE INCENTIVES AND FINANCIAL ARRANGEMENTS',
      content: (
        <div className="space-y-3">
          <p>
            Dateboss recognizes that members may wish to offer a financial incentive or
            contribution when proposing a date.
          </p>
          <p>These arrangements must remain voluntary and mutually agreed upon.</p>
          <p>Members acknowledge that:</p>
          <ol className="list-decimal pl-5 space-y-1.5 text-[#3F3A34]">
            <li>A proposed amount is part of a voluntary social-date arrangement.</li>
            <li>No member is required to accept a proposed amount.</li>
            <li>
              No offer purchases access to another person&apos;s body, affection, intimacy, or
              sexual activity.
            </li>
            <li>
              No member is entitled to sexual activity, physical contact, affection, or any
              particular personal outcome because they offered or spent money.
            </li>
            <li>
              Members may establish who is responsible for restaurant bills, event tickets,
              transportation, and other date-related expenses before meeting.
            </li>
            <li>
              Members must not misrepresent what an agreed contribution or expense arrangement
              covers.
            </li>
          </ol>
          <p>
            Unless Dateboss expressly provides an integrated payment service, financial
            arrangements between members are made independently, and Dateboss does not collect,
            hold, transfer, or guarantee payments between members.
          </p>
          <p>
            Dateboss is not responsible for disputes involving private financial arrangements
            between members.
          </p>
          <p>
            Members must never use the Platform to solicit loans, investments, emergency financial
            assistance, gift cards, cryptocurrency transfers, or unrelated financial transfers.
          </p>
        </div>
      ),
    },
    {
      id: 'section-6',
      number: '6',
      title: 'STRICT PROHIBITION OF PROSTITUTION AND SEXUAL SERVICES',
      content: (
        <div className="space-y-3">
          <p>
            Dateboss is intended for dating, social interaction, and mutually enjoyable
            experiences.
          </p>
          <p>The Platform must not be used to advertise, arrange, promote, or facilitate:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#3F3A34]">
            <li>Prostitution or commercial sexual services.</li>
            <li>Escort services or solicitation of escort clients.</li>
            <li>Sexual favors in exchange for money, gifts, or other benefits.</li>
            <li>Paid sexual encounters or arrangements.</li>
            <li>Human trafficking, exploitation, or sexual coercion.</li>
            <li>The sale of sexual content or explicit services.</li>
          </ul>
          <p>
            A date incentive or contribution does not create an obligation to engage in sexual
            activity.
          </p>
          <p>
            Any agreement involving sexual activity must be voluntary, consensual, and independent
            of any financial offer. Consent may be withdrawn at any time.
          </p>
          <p className="font-medium text-[#9F1E19]">
            Violations may result in immediate account suspension or permanent termination and,
            where appropriate, referral to law enforcement.
          </p>
        </div>
      ),
    },
    {
      id: 'section-7',
      number: '7',
      title: 'MEMBER CONDUCT AND COMMUNITY STANDARDS',
      content: (
        <div className="space-y-3">
          <p>All members are expected to behave respectfully and responsibly.</p>
          <p>The following conduct is prohibited:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#3F3A34]">
            <li>Harassment, stalking, intimidation, or threats.</li>
            <li>Discrimination based on protected characteristics.</li>
            <li>Unsolicited sexually explicit messages or images.</li>
            <li>Threatening or coercive behavior.</li>
            <li>Blackmail, extortion, or manipulation.</li>
            <li>Fraudulent offers or deceptive financial requests.</li>
            <li>Impersonation or fake profiles.</li>
            <li>Posting another person&apos;s private information without consent.</li>
            <li>Spam, advertising, or unauthorized commercial solicitation.</li>
            <li>Sharing intimate images without consent.</li>
            <li>Using Dateboss to promote illegal activities.</li>
          </ul>
          <p>
            Dateboss may remove content or restrict accounts when it believes these standards have
            been violated.
          </p>
        </div>
      ),
    },
    {
      id: 'section-8',
      number: '8',
      title: 'PERSONAL SAFETY AND IN-PERSON MEETINGS',
      content: (
        <div className="space-y-3">
          <p>
            Dateboss encourages members to take reasonable precautions when meeting someone for the
            first time.
          </p>
          <p>Members should:</p>
          <ol className="list-decimal pl-5 space-y-1.5 text-[#3F3A34]">
            <li>Meet in public places.</li>
            <li>Arrange their own transportation when possible.</li>
            <li>Inform a trusted person about their plans.</li>
            <li>Avoid sharing their home address or sensitive personal information prematurely.</li>
            <li>Keep control of their personal belongings and beverages.</li>
            <li>Consider using video chat before meeting.</li>
            <li>Leave any situation that makes them uncomfortable.</li>
          </ol>
          <p>
            Members are solely responsible for their personal decisions and conduct during
            in-person meetings.
          </p>
          <p>
            Dateboss does not guarantee the identity, intentions, background, or conduct of any
            member.
          </p>
        </div>
      ),
    },
    {
      id: 'section-9',
      number: '9',
      title: 'IDENTITY VERIFICATION AND BACKGROUND CHECKS',
      content: (
        <div className="space-y-3">
          <p>
            Dateboss may offer identity verification, age verification, selfie verification, or
            other verification features.
          </p>
          <p>
            Verification badges indicate only that a particular verification procedure has been
            completed.
          </p>
          <p>
            Unless explicitly stated otherwise, Dateboss does not conduct criminal background
            checks on every member.
          </p>
          <p>
            Verification does not guarantee that a member is safe, trustworthy, or free from a
            criminal history.
          </p>
          <p>Members should exercise independent judgment when interacting with others.</p>
        </div>
      ),
    },
    {
      id: 'section-10',
      number: '10',
      title: 'CONTENT AND PHOTOGRAPHS',
      content: (
        <div className="space-y-3">
          <p>
            Members retain ownership of the photographs, text, videos, and other content they
            upload, subject to the rights granted in these Terms.
          </p>
          <p>
            By submitting content to Dateboss, you grant Dateboss a non-exclusive, worldwide,
            royalty-free license to host, store, reproduce, display, and distribute that content as
            reasonably necessary to operate, promote, maintain, and improve the Platform.
          </p>
          <p>
            This license is subject to our Privacy Policy and ends when the content is deleted,
            except where continued retention is legally required or reasonably necessary for
            legitimate security, dispute-resolution, or backup purposes.
          </p>
          <p>You represent that you own or have permission to upload all content you submit.</p>
          <p>Dateboss may remove content that violates these Terms or applicable law.</p>
        </div>
      ),
    },
    {
      id: 'section-11',
      number: '11',
      title: 'PRIVACY AND PERSONAL INFORMATION',
      content: (
        <div className="space-y-3">
          <p>Your use of Dateboss is also governed by our Privacy Policy.</p>
          <p>
            Dateboss may collect and process information necessary to operate the Platform,
            including account information, profile details, photographs, communications, device
            information, and transaction-related information where applicable.
          </p>
          <p>
            Dateboss will handle personal information in accordance with its Privacy Policy and
            applicable privacy legislation.
          </p>
          <p>
            Members must not misuse, distribute, sell, or disclose another member&apos;s personal
            information without lawful authority or consent.
          </p>
        </div>
      ),
    },
    {
      id: 'section-12',
      number: '12',
      title: 'BLOCKING, REPORTING, AND MODERATION',
      content: (
        <div className="space-y-3">
          <p>Dateboss may provide features that allow members to block or report other members.</p>
          <p>
            Members are encouraged to report suspicious accounts, harassment, fraud, inappropriate
            conduct, and violations of these Terms.
          </p>
          <p>Dateboss reserves the right, but does not undertake an obligation, to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#3F3A34]">
            <li>Investigate reports of misconduct.</li>
            <li>Remove inappropriate profiles or content.</li>
            <li>Restrict messaging or offer privileges.</li>
            <li>Suspend or terminate accounts.</li>
            <li>Preserve relevant records where legally permitted or required.</li>
            <li>Cooperate with law enforcement and regulatory authorities when appropriate.</li>
          </ul>
          <p>
            Dateboss does not guarantee that every report will result in account suspension or
            removal.
          </p>
        </div>
      ),
    },
    {
      id: 'section-13',
      number: '13',
      title: 'CANCELLATIONS AND MISSED DATES',
      content: (
        <div className="space-y-3">
          <p>Members should communicate promptly if they cannot attend an agreed date.</p>
          <p>Dateboss is not responsible for:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#3F3A34]">
            <li>A member failing to attend a date.</li>
            <li>Last-minute cancellations.</li>
            <li>Disagreements about date expenses.</li>
            <li>Changes in personal circumstances.</li>
            <li>Losses arising from privately arranged payments.</li>
          </ul>
          <p>
            Any cancellation or refund policy applicable to purchases made directly through
            Dateboss will be disclosed separately.
          </p>
        </div>
      ),
    },
    {
      id: 'section-14',
      number: '14',
      title: 'PAYMENTS AND PREMIUM FEATURES',
      content: (
        <div className="space-y-3">
          <p>
            Dateboss may offer paid subscriptions, credits, promotional features, or other premium
            services.
          </p>
          <p>
            If available, purchases will be subject to the applicable pricing and payment terms
            displayed at the time of purchase.
          </p>
          <p>Members agree to provide accurate billing information and authorize applicable charges.</p>
          <p>
            Unless otherwise required by law or expressly stated in a separate refund policy,
            purchases may be non-refundable.
          </p>
          <p>
            Dateboss reserves the right to change its pricing, features, and subscription offerings
            with appropriate notice where required by law.
          </p>
        </div>
      ),
    },
    {
      id: 'section-15',
      number: '15',
      title: 'ACCOUNT SUSPENSION AND TERMINATION',
      content: (
        <div className="space-y-3">
          <p>Dateboss may suspend, restrict, or terminate an account if:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#3F3A34]">
            <li>A member violates these Terms.</li>
            <li>A member engages in fraudulent or illegal activity.</li>
            <li>A member creates a safety risk for other members.</li>
            <li>A member provides false identity or age information.</li>
            <li>A member misuses the offer system.</li>
            <li>A member attempts to circumvent a previous suspension.</li>
            <li>Dateboss is legally required to restrict access.</li>
          </ul>
          <p>
            Members may discontinue using Dateboss and request account deletion through the
            available account settings or customer support process.
          </p>
          <p>
            Certain information may be retained where required by law or necessary for legitimate
            security and legal purposes.
          </p>
        </div>
      ),
    },
    {
      id: 'section-16',
      number: '16',
      title: 'DISCLAIMER OF WARRANTIES',
      content: (
        <div className="space-y-3">
          <p>
            Dateboss is provided on an &ldquo;as available&rdquo; and &ldquo;as is&rdquo; basis to
            the maximum extent permitted by applicable law.
          </p>
          <p>Dateboss does not guarantee:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#3F3A34]">
            <li>The accuracy of member profiles.</li>
            <li>The authenticity of every member.</li>
            <li>The success of any date or relationship.</li>
            <li>The completion of any agreed date.</li>
            <li>The safety or conduct of members.</li>
            <li>Uninterrupted or error-free Platform operation.</li>
          </ul>
          <p>
            Dateboss is a platform for connecting members. Members are responsible for evaluating
            the people they interact with and making their own decisions.
          </p>
        </div>
      ),
    },
    {
      id: 'section-17',
      number: '17',
      title: 'LIMITATION OF LIABILITY',
      content: (
        <div className="space-y-3">
          <p>
            To the maximum extent permitted by applicable law, Dateboss and its owners, directors,
            employees, affiliates, and service providers will not be liable for indirect,
            incidental, special, consequential, or punitive damages arising from:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#3F3A34]">
            <li>Member interactions.</li>
            <li>In-person meetings or dates.</li>
            <li>Disputes between members.</li>
            <li>Fraudulent or misleading member conduct.</li>
            <li>Personal injury or property damage caused by another member.</li>
            <li>
              Unauthorized access resulting from circumstances outside Dateboss&apos;s reasonable
              control.
            </li>
            <li>Temporary interruptions or service failures.</li>
          </ul>
          <p>
            Nothing in these Terms excludes or limits liability that cannot legally be excluded or
            limited under applicable law.
          </p>
        </div>
      ),
    },
    {
      id: 'section-18',
      number: '18',
      title: 'INDEMNIFICATION',
      content: (
        <p>
          You agree, to the extent permitted by applicable law, to indemnify and hold harmless
          Dateboss and its owners, directors, employees, and affiliates from third-party claims,
          liabilities, damages, and reasonable legal expenses arising from your unlawful conduct,
          violation of these Terms, infringement of another person&apos;s rights, or misuse of the
          Platform.
        </p>
      ),
    },
    {
      id: 'section-19',
      number: '19',
      title: 'CHANGES TO THESE TERMS',
      content: (
        <div className="space-y-3">
          <p>
            Dateboss reserves the right to update or modify these Terms as the Platform evolves.
          </p>
          <p>
            Material changes will be communicated through the Platform or another reasonable
            method.
          </p>
          <p>
            Your continued use of Dateboss after updated Terms become effective constitutes
            acceptance of the revised Terms, to the extent permitted by law.
          </p>
        </div>
      ),
    },
    {
      id: 'section-20',
      number: '20',
      title: 'GOVERNING LAW AND DISPUTE RESOLUTION',
      content: (
        <div className="space-y-3">
          <p>
            These Terms will be governed by the laws of applicable jurisdiction, without regard to
            conflict-of-law principles.
          </p>
          <p>
            Any disputes arising from these Terms will be handled by the competent courts of
            applicable jurisdiction, subject to mandatory consumer protection laws and other
            applicable legal requirements.
          </p>
          <p className="font-semibold text-[#16120F] pt-2">
            By registering for or using Dateboss, you acknowledge that you have read and agree to
            these Terms and Conditions.
          </p>
        </div>
      ),
    },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#EFE7DA] text-[#16120F] font-sans antialiased flex flex-col justify-between selection:bg-[#9F1E19]/15">
      {/* Top Navbar */}
      <header className="w-full bg-[#EFE7DA]/95 sticky top-0 z-40 backdrop-blur-md border-b border-[#E0D7C8]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onBack();
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src="/assets/logo.png"
              alt="thedateboss"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 flex-1">
        {/* Hero Banner Card */}
        <div className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-xs mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-[#9F1E19]"></span>
            <span className="text-xs font-semibold text-[#9F1E19] uppercase tracking-wider">
              Legal & Platform Governance
            </span>
          </div>

          <h1 className="font-serif font-extrabold text-2xl sm:text-4xl lg:text-5xl text-[#16120F] tracking-tight leading-tight">
            Terms and Conditions of Use
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-xs sm:text-sm text-[#6E6A63]">
            <span className="inline-flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#9F1E19]" />
              <span>
                <strong className="text-[#16120F]">Effective Date:</strong> November 13, 2026
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#9F1E19]" />
              <span>
                <strong className="text-[#16120F]">Last Updated:</strong> November 13, 2026
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#9F1E19]" />
              <span className="font-semibold text-[#16120F]">18+ Verified Platform</span>
            </span>
          </div>

          <div className="mt-6 pt-6 border-t border-[#EAE2D3] space-y-3 text-xs sm:text-sm text-[#4A453E] leading-relaxed">
            <p>
              Welcome to Dateboss (&ldquo;Dateboss,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
              &ldquo;our&rdquo;). These Terms and Conditions (&ldquo;Terms&rdquo;) govern your
              access to and use of the Dateboss website, mobile applications, services, features,
              and related platforms (collectively, the &ldquo;Platform&rdquo;).
            </p>
            <p>
              By creating an account, accessing, or using Dateboss, you acknowledge that you have
              read, understood, and agreed to these Terms and our Privacy Policy.
            </p>
            <p className="font-semibold text-[#9F1E19]">
              If you do not agree to these Terms, you must not use the Platform.
            </p>
          </div>
        </div>

        {/* Two-column layout: Sticky Table of Contents + 20 Legal Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 bg-[#FAF7F2] border border-[#E5DDD0] rounded-[24px] p-6 shadow-xs max-h-[calc(100vh-120px)] overflow-y-auto">
            <h3 className="font-serif font-bold text-base text-[#16120F] mb-3 pb-2.5 border-b border-[#EAE2D3]">
              Table of Contents
            </h3>
            <nav className="space-y-1">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollToSection(sec.id)}
                  className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium text-[#524D46] hover:text-[#9F1E19] hover:bg-[#EFE7DA]/60 transition-colors flex items-start gap-2 cursor-pointer"
                >
                  <span className="font-bold text-[#9F1E19] shrink-0 w-5">{sec.number}.</span>
                  <span className="truncate">{sec.title}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Right Sections Content */}
          <div className="lg:col-span-8 space-y-5">
            {sections.map((sec) => (
              <section
                key={sec.id}
                id={sec.id}
                className="scroll-mt-24 bg-[#FAF7F2] border border-[#E5DDD0] rounded-[24px] p-6 sm:p-8 shadow-2xs"
              >
                <div className="flex items-center gap-3 mb-3.5 pb-3 border-b border-[#EAE2D3]">
                  <span className="w-8 h-8 rounded-xl bg-[#9F1E19] text-white font-serif font-bold text-sm flex items-center justify-center shrink-0">
                    {sec.number}
                  </span>
                  <h2 className="font-serif font-bold text-lg sm:text-xl text-[#16120F] tracking-tight">
                    {sec.title}
                  </h2>
                </div>

                <div className="text-xs sm:text-sm text-[#4A453E] leading-relaxed">
                  {sec.content}
                </div>
              </section>
            ))}

            {/* Bottom Call To Action Card */}
            <div className="bg-[#16120F] text-[#FAF7F2] rounded-[28px] p-6 sm:p-10 text-center space-y-4">
              <h3 className="font-serif font-bold text-xl sm:text-2xl">
                Ready to Experience Intentional Dating?
              </h3>
              <p className="text-xs sm:text-sm text-[#A9A49C] max-w-lg mx-auto">
                By joining Dateboss, you agree to uphold our community standards, respect all
                members, and honour your date commitments.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {onJoinAsHost && (
                  <button
                    type="button"
                    onClick={onJoinAsHost}
                    className="w-full sm:w-auto bg-[#F3A83B] hover:bg-[#DE952B] text-[#16120F] font-bold text-xs px-7 py-3 rounded-full transition-colors cursor-pointer"
                  >
                    Join as a Host
                  </button>
                )}
                {onJoinAsGuest && (
                  <button
                    type="button"
                    onClick={onJoinAsGuest}
                    className="w-full sm:w-auto bg-[#9F1E19] hover:bg-[#851713] text-white font-bold text-xs px-7 py-3 rounded-full transition-colors cursor-pointer"
                  >
                    Join as a Guest of Honor
                  </button>
                )}
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-7 py-3 rounded-full transition-colors cursor-pointer"
                >
                  Return to Previous Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#E0D7C8] py-6 sm:py-8 bg-[#EFE7DA]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/seal.png"
              alt="thedateboss seal"
              className="w-6 h-6 object-contain shrink-0"
            />
            <span className="text-xs text-stone-500 font-medium">
              © 2025 thedateboss • 18+ only
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-5 gap-y-2 text-xs text-[#5F5B54]">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-semibold text-[#9F1E19] cursor-pointer"
            >
              Terms & Conditions
            </button>
            <button
              type="button"
              onClick={onBack}
              className="hover:text-[#9F1E19] transition-colors cursor-pointer"
            >
              Back to Platform
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default TermsAndConditionsPage;
