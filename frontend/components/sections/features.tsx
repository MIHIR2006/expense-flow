"use client";

import { motion } from "framer-motion";
import { Scan, GitBranch, Globe, Zap, Users, ChartBar as BarChart3 } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/magicui/bento-grid";

const features = [
  {
    title: "AI-Powered OCR",
    description:
      "Scan receipts in seconds with 99.9% accuracy. Our AI extracts every detail automatically.",
    icon: <Scan className="h-6 w-6 text-purple-400" />,
    header: <ReceiptAnimation />,
    className: "md:col-span-2",
  },
  {
    title: "Multi-Level Approvals",
    description:
      "Configure complex approval workflows with percentage-based or specific approvers.",
    icon: <GitBranch className="h-6 w-6 text-blue-400" />,
    header: <ApprovalFlowAnimation />,
    className: "md:col-span-1",
  },
  {
    title: "Real-Time Currency Conversion",
    description:
      "Support 150+ currencies with real-time exchange rates and automatic conversion.",
    icon: <Globe className="h-6 w-6 text-cyan-400" />,
    header: <CurrencyAnimation />,
    className: "md:col-span-1",
  },
  {
    title: "Smart Approval Rules",
    description:
      "Set up intelligent rules based on amount, category, or department for instant approvals.",
    icon: <Zap className="h-6 w-6 text-yellow-400" />,
    header: <RulesAnimation />,
    className: "md:col-span-2",
  },
  {
    title: "Team Management",
    description:
      "Organize teams, assign managers, and control permissions with ease.",
    icon: <Users className="h-6 w-6 text-green-400" />,
    header: <TeamAnimation />,
    className: "md:col-span-1",
  },
  {
    title: "Detailed Analytics",
    description:
      "Gain insights with real-time dashboards, custom reports, and spending trends.",
    icon: <BarChart3 className="h-6 w-6 text-pink-400" />,
    header: <AnalyticsAnimation />,
    className: "md:col-span-2",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-32" id="features">
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-purple-500/30 bg-purple-950/50 px-4 py-1.5 text-sm font-medium text-purple-300 backdrop-blur-sm">
            Features
          </span>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-6xl">
            Everything You Need,
            <br />
            <span className="text-gradient">Built for Speed</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/70">
            Powerful features designed to make expense management effortless for
            teams of all sizes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <BentoGrid className="mx-auto max-w-7xl">
            {features.map((feature, i) => (
              <BentoGridItem
                key={i}
                title={feature.title}
                description={feature.description}
                header={feature.header}
                icon={feature.icon}
                className={feature.className}
              />
            ))}
          </BentoGrid>
        </motion.div>
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent" />
    </section>
  );
}

function ReceiptAnimation() {
  return (
    <div className="flex h-full min-h-[6rem] w-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative h-32 w-32"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm"
        >
          <div className="flex h-full flex-col justify-center space-y-2 p-4">
            <div className="h-2 w-3/4 rounded bg-white/20" />
            <div className="h-2 w-1/2 rounded bg-white/20" />
            <div className="h-2 w-2/3 rounded bg-white/20" />
            <motion.div
              animate={{ width: ["0%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 rounded bg-gradient-to-r from-purple-500 to-blue-500"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ApprovalFlowAnimation() {
  return (
    <div className="flex h-full min-h-[6rem] w-full items-center justify-center">
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="relative"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/50 to-purple-500/50"
            />
            {i < 3 && (
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 + 0.3 }}
                className="absolute left-10 top-1/2 h-0.5 w-4 origin-left bg-gradient-to-r from-blue-500 to-purple-500"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CurrencyAnimation() {
  const currencies = ["$", "€", "£", "¥"];
  return (
    <div className="flex h-full min-h-[6rem] w-full items-center justify-center">
      <div className="flex gap-2">
        {currencies.map((currency, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-2xl font-bold text-cyan-400"
          >
            {currency}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RulesAnimation() {
  return (
    <div className="flex h-full min-h-[6rem] w-full items-center justify-center">
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="h-6 w-6 rounded bg-gradient-to-br from-yellow-500/50 to-orange-500/50"
            />
            <div className="h-1.5 w-24 rounded bg-white/10" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TeamAnimation() {
  return (
    <div className="flex h-full min-h-[6rem] w-full items-center justify-center">
      <div className="relative h-24 w-32">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="absolute h-8 w-8 rounded-full bg-gradient-to-br from-green-500/50 to-emerald-500/50"
            style={{
              left: `${i * 30}px`,
              top: `${i * 10}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function AnalyticsAnimation() {
  return (
    <div className="flex h-full min-h-[6rem] w-full items-center justify-center gap-2">
      {[60, 80, 40, 90, 50].map((height, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${height}%` }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="w-8 rounded-t bg-gradient-to-t from-pink-500/50 to-purple-500/50"
        />
      ))}
    </div>
  );
}
