'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SectionEyebrow } from './swiss'

export function Reveal({ children, delay = 0, y = 14, className = '' }) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeader({ index, label, title, description, action }) {
  return (
    <div className="grid items-end gap-8 md:grid-cols-12 md:gap-12">
      <div className="md:col-span-8">
        <Reveal>
          <SectionEyebrow index={index} label={label} />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tighter sm:text-5xl md:text-[3.25rem]">
            {title}
          </h2>
        </Reveal>
        {description && (
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              {description}
            </p>
          </Reveal>
        )}
      </div>
      {action && (
        <Reveal delay={0.15} className="md:col-span-4 md:flex md:justify-end">
          {action}
        </Reveal>
      )}
    </div>
  )
}
