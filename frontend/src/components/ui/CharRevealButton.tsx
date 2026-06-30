'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CharRevealButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  type?: 'primary' | 'ghost';
}

export const CharRevealButton: React.FC<CharRevealButtonProps> = ({
  text,
  onClick,
  className = '',
  type = 'primary'
}) => {
  const characters = text.split('');

  const charVariants1 = (idx: number) => ({
    initial: { y: 0 },
    hover: {
      y: '-105%',
      transition: {
        duration: 0.22,
        ease: [0.25, 1, 0.5, 1] as any,
        delay: idx * 0.015
      }
    }
  });

  const charVariants2 = (idx: number) => ({
    initial: { y: '105%' },
    hover: {
      y: 0,
      transition: {
        duration: 0.22,
        ease: [0.25, 1, 0.5, 1] as any,
        delay: idx * 0.015
      }
    }
  });

  const baseStyles = "relative overflow-hidden font-body text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-full transition-all flex items-center justify-center cursor-pointer";
  const typeStyles = type === 'primary'
    ? "bg-orange-accent text-white hover:bg-orange-hover shadow-lg hover:shadow-orange-accent/15 border border-transparent"
    : "bg-transparent text-text-primary border border-border hover:border-orange-accent";

  return (
    <motion.button
      onClick={onClick}
      initial="initial"
      whileHover="hover"
      className={`${baseStyles} ${typeStyles} ${className}`}
    >
      <span className="flex overflow-hidden relative h-4 items-center">
        {characters.map((char, idx) => (
          <span
            key={idx}
            className="relative block h-4 w-auto overflow-hidden"
            style={{ 
              whiteSpace: char === ' ' ? 'pre' : 'normal',
              minWidth: char === ' ' ? '4px' : 'auto' 
            }}
          >
            {/* Primary sliding text */}
            <motion.span
              variants={charVariants1(idx)}
              className="block h-4 leading-none"
            >
              {char}
            </motion.span>
            
            {/* Secondary sliding text */}
            <motion.span
              variants={charVariants2(idx)}
              className="absolute top-0 left-0 block h-4 leading-none font-bold"
              style={{ color: type === 'ghost' ? 'var(--color-orange-accent)' : '#ffffff' }}
            >
              {char}
            </motion.span>
          </span>
        ))}
      </span>
    </motion.button>
  );
};
