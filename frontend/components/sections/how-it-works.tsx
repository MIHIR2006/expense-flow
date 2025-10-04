"use client";

import { motion } from "framer-motion";
import { Upload, Zap, DollarSign } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Submit Expenses",
    description:
      "Upload receipts via mobile app, email, or web. Our AI extracts all details instantly.",
    color: "from-purple-500 to-blue-500",
  },
  {
    icon: Zap,
    title: "Automated Approval",
    description:
      "Smart routing sends expenses to the right approvers based on your custom rules.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: DollarSign,
    title: "Get Reimbursed",
    description:
      "Once approved, payments are processed automatically to your preferred method.",
    color: "from-cyan-500 to-green-500",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative py-32" id="how-it-works">
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-purple-500/30 bg-purple-950/50 px-4 py-1.5 text-sm font-medium text-purple-300 backdrop-blur-sm">
            How It Works
          </span>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-6xl">
            Three Steps to
            <br />
            <span className="text-gradient">Expense Freedom</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/70">
            Our streamlined process makes expense management effortless from
            submission to reimbursement.
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-purple-500 via-blue-500 to-cyan-500 md:block" />

          <div className="space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative"
              >
                <div
                  className={`mx-auto flex flex-col items-center gap-8 md:flex-row ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="glass-card rounded-2xl p-8"
                    >
                      <div
                        className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color}`}
                      >
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="mb-2 text-sm font-semibold text-purple-400">
                        Step {index + 1}
                      </div>
                      <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">
                        {step.title}
                      </h3>
                      <p className="text-white/70">{step.description}</p>
                    </motion.div>
                  </div>

                  <div className="relative z-10 flex h-20 w-20 items-center justify-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                      className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-20 blur-xl`}
                    />
                    <div
                      className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-2xl font-bold text-white shadow-lg`}
                    >
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-24 text-center"
        >
          <div className="glass-card mx-auto inline-flex items-center gap-2 rounded-full px-6 py-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-sm text-white/70">
              Average processing time: <span className="font-semibold text-white">2.3 seconds</span>
            </span>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-purple-950/5 to-transparent" />
    </section>
  );
}
