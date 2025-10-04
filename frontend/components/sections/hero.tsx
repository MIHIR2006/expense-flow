"use client";

import Particles from "@/components/magicui/particles";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Particles
        className="absolute inset-0"
        quantity={150}
        staticity={50}
        color="#9333ea"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-[#0a0a0a]" />

      <div className="container relative z-10 mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-5xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-block rounded-full border border-purple-500/30 bg-purple-950/50 px-4 py-1.5 text-sm font-medium text-purple-300 backdrop-blur-sm">
              The Future of Expense Management
            </span>
          </motion.div>

          <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
              Expense Management, Reimagined
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mx-auto mb-12 max-w-3xl text-lg text-white/70 md:text-xl"
          >
            Automate approvals, scan receipts with AI, and manage expenses
            across teams in one powerful platform
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mb-16 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 text-lg font-semibold transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group border-white/20 bg-white/5 px-8 py-6 text-lg font-semibold backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="relative mx-auto max-w-5xl"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-purple-600/20 to-transparent blur-3xl" />
            <div className="glass-card overflow-hidden rounded-2xl p-2">
              <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-purple-950/50 via-blue-950/50 to-cyan-950/50" />
            </div>

            <div className="absolute -left-4 top-1/4 hidden lg:block">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="glass-card rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600" />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Approved
                    </div>
                    <div className="text-xs text-white/60">2 seconds ago</div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="absolute -right-4 top-1/2 hidden lg:block">
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="glass-card rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-600" />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      $2,450.00
                    </div>
                    <div className="text-xs text-white/60">Processing</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-center"
          >
            <div>
              <div className="text-3xl font-bold text-gradient">10K+</div>
              <div className="text-sm text-white/60">Companies</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <div className="text-3xl font-bold text-gradient">1M+</div>
              <div className="text-sm text-white/60">Expenses Processed</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <div className="text-3xl font-bold text-gradient">99.9%</div>
              <div className="text-sm text-white/60">Uptime</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="h-12 w-6 rounded-full border-2 border-white/20">
            <div className="mx-auto mt-2 h-2 w-2 animate-pulse rounded-full bg-white" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
