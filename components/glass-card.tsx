"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-white/10 dark:bg-black/20",
        "backdrop-blur-xl backdrop-saturate-150",
        "border border-white/20 dark:border-white/10",
        "shadow-xl shadow-black/5 dark:shadow-black/20",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-br before:from-white/20 before:to-transparent",
        "before:opacity-50 dark:before:opacity-30",
        className,
      )}
      whileHover={
        hover
          ? {
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }
          : undefined
      }
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
