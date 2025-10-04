"use client";

import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
  { name: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(10, 10, 10, 0)", "rgba(10, 10, 10, 0.8)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      style={{ backgroundColor }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-xl" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo size="md" showText={true} />
          </motion.div>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden items-center gap-4 md:flex"
          >
            <Button
              variant="ghost"
              className="text-white/70 hover:bg-white/10 hover:text-white"
              asChild
            >
              <a href="/login">Sign In</a>
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50" asChild>
              <a href="/signup">Get Started</a>
            </Button>
          </motion.div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 md:hidden"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl md:hidden"
        >
          <div className="container mx-auto px-4 py-6">
            <div className="space-y-4">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  {item.name}
                </a>
              ))}
              <div className="space-y-2 border-t border-white/10 pt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:bg-white/10 hover:text-white"
                  asChild
                >
                  <a href="/login">Sign In</a>
                </Button>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600" asChild>
                  <a href="/signup">Get Started</a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
