"use client";

import { motion } from "framer-motion";
import Marquee from "@/components/magicui/marquee";

const integrations = [
  { name: "Slack", available: true },
  { name: "QuickBooks", available: true },
  { name: "Xero", available: true },
  { name: "SAP", available: true },
  { name: "Salesforce", available: true },
  { name: "Microsoft Teams", available: true },
  { name: "Google Workspace", available: true },
  { name: "Stripe", available: true },
  { name: "PayPal", available: true },
  { name: "Zapier", available: true },
  { name: "NetSuite", available: false },
  { name: "Oracle", available: false },
];

export default function IntegrationsSection() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-purple-500/30 bg-purple-950/50 px-4 py-1.5 text-sm font-medium text-purple-300 backdrop-blur-sm">
            Integrations
          </span>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-6xl">
            Works With Your
            <br />
            <span className="text-gradient">Favorite Tools</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/70">
            Seamlessly connect with the tools your team already uses every day.
          </p>
        </motion.div>

        <div className="relative">
          <Marquee pauseOnHover className="[--duration:30s]">
            {integrations.map((integration, index) => (
              <IntegrationCard key={index} {...integration} />
            ))}
          </Marquee>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#0a0a0a] to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="mb-4 text-white/60">
            Can&apos;t find your tool? We offer custom integrations.
          </p>
          <button className="text-gradient font-semibold hover:underline">
            Request an integration →
          </button>
        </motion.div>
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent" />
    </section>
  );
}

function IntegrationCard({
  name,
  available,
}: {
  name: string;
  available: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="glass-card relative flex h-32 w-32 flex-col items-center justify-center rounded-xl p-4 transition-all"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
        <div className="text-2xl font-bold text-white">
          {name.charAt(0)}
        </div>
      </div>
      <div className="text-center text-sm font-semibold text-white">{name}</div>
      {!available && (
        <div className="absolute -right-2 -top-2 rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
          Soon
        </div>
      )}
    </motion.div>
  );
}
