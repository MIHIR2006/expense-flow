"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Particles from "@/components/magicui/particles";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-32">
      <Particles
        className="absolute inset-0"
        quantity={100}
        staticity={50}
        color="#3b82f6"
      />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-cyan-600/20 p-12 backdrop-blur-sm md:p-16 lg:p-20"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

          <div className="relative mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="mb-6 text-4xl font-bold text-white md:text-6xl">
                Ready to Transform Your
                <br />
                <span className="text-gradient">Expense Management?</span>
              </h2>
              <p className="mb-12 text-lg text-white/70 md:text-xl">
                Join 10,000+ companies automating their expense workflows.
                Start your free trial today.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8"
            >
              <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  placeholder="Enter your work email"
                  className="h-12 border-white/20 bg-white/10 text-white placeholder:text-white/50 backdrop-blur-sm"
                />
                <Button
                  size="lg"
                  className="group h-12 bg-gradient-to-r from-purple-600 to-blue-600 px-8 font-semibold transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
                  <Check className="h-3 w-3 text-green-400" />
                </div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
                  <Check className="h-3 w-3 text-green-400" />
                </div>
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
                  <Check className="h-3 w-3 text-green-400" />
                </div>
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          </div>

          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-600/30 blur-3xl" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/30 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
