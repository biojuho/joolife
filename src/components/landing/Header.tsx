"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "#about", label: "소개" },
  { href: "#team", label: "팀" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const headerHeight = 80;
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-[1200px] px-[clamp(1rem,0.5rem+2vw,2rem)]">
          <div className="flex items-center justify-between">
            <Link
              href="#hero"
              onClick={(e) => handleNavClick(e, "#hero")}
              className="flex flex-col"
            >
              <span
                className={`font-heading text-xl font-bold tracking-wider transition-colors ${
                  isScrolled ? "text-[#1A1A1A]" : "text-white"
                }`}
              >
                JooLife
              </span>
              <span
                className={`text-[10px] tracking-[0.15em] transition-colors ${
                  isScrolled ? "text-[#A3A39E]" : "text-white/50"
                }`}
              >
                SINCE 2026 · JOOLIFE.IO.KR
              </span>
            </Link>

            <nav className="hidden md:block">
              <ul className="flex items-center gap-8">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`text-sm font-medium tracking-wider transition-colors hover:text-accent ${
                        isScrolled ? "text-[#4A4A46]" : "text-white/80"
                      } ${
                        activeSection === item.href.slice(1)
                          ? "text-accent!"
                          : ""
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden transition-colors ${
                isScrolled ? "text-[#1A1A1A]" : "text-white"
              }`}
              aria-label="메뉴 열기"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#1A1A1A] flex flex-col items-center justify-center transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      >
        <nav className="flex flex-col items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-2xl font-medium text-white/80 transition-colors hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
