import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What happens if I decline an offer?",
      answer: "Declining an offer is simple, private, and respectful. You can decline with one tap, or use the 'Counter' button to propose an alternate time or venue if you want to meet but your schedule requires adjustments."
    },
    {
      question: "Is this an escort or paid companionship service?",
      answer: "No, absolutely not. The Date Inc is strictly a premium dating platform built for genuine, authentic romance. Date offers specify normal date logistics (e.g. restaurant reservations, gallery tickets, or drinks) and upfront bill arrangements (e.g. host covers or split 50/50). Transactional or commercial companionship is strictly prohibited and immediately banned."
    },
    {
      question: "What happens if someone doesn't show up?",
      answer: "We hold platform accountability to the highest standard. Both users must re-confirm 24 hours prior. Unexcused no-shows receive rating strikes, safety reviews, and permanent account suspensions. Our confirmed date fulfillment rate is over 98%."
    },
    {
      question: "Can I switch between Send and Receive Offers?",
      answer: "Yes! Every member has full versatility. You can browse verified singles and send direct date offers anytime, or switch to passive mode to simply review and answer incoming invitations from verified matches."
    }
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="w-6 h-[2px] bg-[#8A1B22]"></span>
            <span className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#8A1B22]">
              Clarifications
            </span>
            <span className="w-6 h-[2px] bg-[#8A1B22]"></span>
          </div>

          <h2 className="font-serif-heading font-extrabold text-3xl sm:text-4xl text-stone-900">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-stone-200/80 border-y border-stone-200/80">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-5 transition-colors">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between text-left gap-4 focus:outline-none group"
                >
                  <span className="font-serif-heading font-bold text-base sm:text-lg text-stone-900 group-hover:text-[#8A1B22] transition-colors">
                    {index + 1}. {faq.question}
                  </span>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-[#8A1B22]/10 group-hover:text-[#8A1B22] transition-colors">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="pt-3 pr-8 text-stone-600 text-sm leading-relaxed animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
