import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion as Motion } from "framer-motion";
import Header from "./Header";
import Sidebar from "./Sidebar";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") {
    return stored;
  }

  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const Layout = ({ children }) => {
  const { isCollapsed } = useSelector((state) => state.ui);
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    window.localStorage.setItem("theme", theme);
  }, [theme, isDark]);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="min-h-screen theme-bg flex flex-col md:flex-row-reverse rtl font-['Almarai']">
      <Sidebar isDark={isDark} onToggleTheme={toggleTheme} />

      {/* المحتوى الرئيسي يتوسع حسب حالة الدراور (للتاب واللابتوب) */}
      <Motion.main
        initial={false}
        animate={{
          marginRight: window.innerWidth >= 768 ? (isCollapsed ? 80 : 280) : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex-1 min-w-0"
      >
        <Header isDark={isDark} onToggleTheme={toggleTheme} />
        <div className="px-3 py-4 sm:px-4 md:px-8 lg:px-10">{children}</div>
      </Motion.main>
    </div>
  );
};

export default Layout;
