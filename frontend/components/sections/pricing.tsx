"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for individuals and small teams",
    features: [
      "Up to 50 expenses/month",
      "Basic receipt scanning",
      "Email support",
      "Mobile app access",
      "1 approval level",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Professional",
    price: { monthly: 29, yearly: 279 },
    description: "For growing teams with advanced needs",
    features: [
      "Unlimited expenses",
      "AI-powered OCR",
      "Multi-level approvals",
      "Real-time currency conversion",
      "Priority support",
      "Custom rules & automation",
      "Advanced analytics",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: { monthly: null, yearly: null },
    description: "Custom solutions for large organizations",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom integrations",
      "SSO & advanced security",
      "SLA guarantee",
      "Custom training",
      "White-label options",
      "24/7 phone support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="relative py-32" id="pricing">
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-purple-500/30 bg-purple-950/50 px-4 py-1.5 text-sm font-medium text-purple-300 backdrop-blur-sm">
            Pricing
          </span>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-6xl">
            Simple, Transparent
            <br />
            <span className="text-gradient">Pricing</span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/70">
            Choose the perfect plan for your team. All plans include a 14-day
            free trial.
          </p>

          <div className="inline-flex items-center gap-4 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
            <button
              onClick={() => setIsYearly(false)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                !isYearly
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                isYearly
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Yearly
              <span className="ml-2 rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="animate-shimmer rounded-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 bg-[length:200%_100%] px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                </div>
              )}

              <div
                className={`glass-card h-full rounded-2xl p-8 ${
                  plan.popular
                    ? "border-2 border-purple-500/50 shadow-xl shadow-purple-500/20"
                    : ""
                }`}
              >
                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-white/60">{plan.description}</p>
                </div>

                <div className="mb-8">
                  {plan.price.monthly === null ? (
                    <div className="text-4xl font-bold text-white">Custom</div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-white">
                        ${isYearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      {plan.price.monthly > 0 && (
                        <span className="text-white/60">
                          /{isYearly ? "year" : "month"}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  className={`mb-8 w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105"
                      : "bg-white/10 hover:bg-white/20"
                  } transition-all`}
                  size="lg"
                >
                  {plan.cta}
                </Button>

                <div className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/20">
                        <Check className="h-3 w-3 text-purple-400" />
                      </div>
                      <span className="text-sm text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-white/60">
            All plans include 14-day free trial • No credit card required •
            Cancel anytime
          </p>
        </motion.div>
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-purple-950/5 to-transparent" />
    </section>
  );
}
