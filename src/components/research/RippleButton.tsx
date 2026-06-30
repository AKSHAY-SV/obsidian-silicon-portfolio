import React, { useState } from 'react';
import { usePrefersReducedMotion } from './hooks';

export interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  rippleColor?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  title?: string;
}

export default function RippleButton({ 
  children, 
  className = '', 
  rippleColor = 'rgba(167, 139, 250, 0.2)', 
  onMouseDown,
  onClick,
  disabled,
  type = "button",
  ...props 
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const shouldReduceMotion = usePrefersReducedMotion();

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onMouseDown) {
      onMouseDown(e);
    }
    if (shouldReduceMotion) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);
  };

  const removeRipple = (id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={handleMouseDown}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      <span className="relative z-10 pointer-events-none flex items-center justify-center gap-inherit w-full h-full">
        {children}
      </span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          onAnimationEnd={() => removeRipple(ripple.id)}
          className="absolute rounded-full pointer-events-none animate-ripple"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: rippleColor,
            transform: 'scale(0)',
          }}
        />
      ))}
    </button>
  );
}
