"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Marquee from "@/components/magicui/marquee";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CFO at TechStart",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    content:
      "This platform reduced our expense processing time by 80%. The AI receipt scanning is incredibly accurate.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Finance Manager at GlobalCorp",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    content:
      "Multi-level approvals and currency conversion have been game-changers for our international team.",
    rating: 5,
  },
  {
    name: "Emily Thompson",
    role: "Owner at CreativeStudio",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    content:
      "As a small business, this is the perfect solution. Easy to use, powerful features, and affordable pricing.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "VP Operations at ScaleUp",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    content:
      "The analytics dashboard gives us real-time insights into spending patterns. Absolutely essential for our growth.",
    rating: 5,
  },
  {
    name: "Lisa Anderson",
    role: "Finance Director at EnterpriseX",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    content:
      "Seamless integration with our existing tools. The support team is responsive and knowledgeable.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "CEO at InnovateLabs",
    image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    content:
      "We've tried multiple expense platforms. This is the only one that our entire team actually enjoys using.",
    rating: 5,
  },
];

const firstRow = testimonials.slice(0, 3);
const secondRow = testimonials.slice(3, 6);

export default function TestimonialsSection() {
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
            Testimonials
          </span>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-6xl">
            Loved by Teams
            <br />
            <span className="text-gradient">Around the World</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/70">
            Join thousands of companies who have transformed their expense
            management.
          </p>
        </motion.div>

        <div className="relative">
          <Marquee pauseOnHover className="[--duration:40s]">
            {firstRow.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:40s]">
            {secondRow.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
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
          className="mt-16 flex flex-wrap items-center justify-center gap-8"
        >
          {["Shopify", "Stripe", "Notion", "Figma", "Linear"].map((company, index) => (
            <div
              key={index}
              className="text-2xl font-bold text-white/20 transition-colors hover:text-white/40"
            >
              {company}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent" />
    </section>
  );
}

function TestimonialCard({
  name,
  role,
  image,
  content,
  rating,
}: {
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}) {
  return (
    <div className="glass-card relative w-80 overflow-hidden rounded-2xl p-6">
      <div className="mb-4 flex gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="mb-6 text-sm text-white/80">{content}</p>
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/10">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <div className="font-semibold text-white">{name}</div>
          <div className="text-sm text-white/60">{role}</div>
        </div>
      </div>
    </div>
  );
}
