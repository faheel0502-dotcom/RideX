'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StaggeredTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const StaggeredText: React.FC<StaggeredTextProps> = ({ text, className = '', delay = 0 }) => {
  const letters = text.split('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, damping: 15, stiffness: 100 },
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`inline-flex flex-wrap ${className}`}
    >
      {letters.map((char, idx) => (
        <motion.span
          key={idx}
          variants={letterVariants}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};
