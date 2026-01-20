
import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  disabled = false, 
  className = '',
  type = 'button'
}) => {
  const baseStyles = "px-8 py-3 rounded-none transition-all duration-300 uppercase tracking-widest text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-white text-black hover:bg-neutral-300",
    outline: "bg-transparent border border-white text-white hover:bg-white hover:text-black"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
