'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  },
};

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function StaggerContainer({ children, className = '', delay = 0 }: StaggerContainerProps) {
  const delayedContainerVariants = {
    ...containerVariants,
    visible: {
      ...containerVariants.visible,
      transition: {
        ...containerVariants.visible.transition,
        delayChildren: delay,
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={delayedContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
