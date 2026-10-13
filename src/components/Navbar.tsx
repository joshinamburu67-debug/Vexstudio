import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ArrowUpRight } from 'lucide-react';

interface Props {
  buttonText?: string;
  onButtonClick?: () => void;
}

export const Navbar: React.FC<Props> = ({
  buttonText = 'Take Survey',
  onButtonClick
}) => {
  const menuItems = [
    { label: 'Problem Statements', hasDropdown: false },
    { label: 'Survey Features', hasDropdown: true },
    { label: 'Feature Wishlist', hasDropdown: false },
    { label: 'Founder Direct', hasDropdown: true }
  ];

  return (
    <nav className="flex items-center justify-between py-6 px-6 md:px-10 w-full relative z-10 select-none">
      {/* Left Side (hidden spacer for centering) */}
      <div className="flex-1 hidden md:block" />

      {/* Center Menu */}
      <ul className="hidden md:flex items-center gap-8 text-[rgb(45,45,45)] font-normal text-sm">
        {menuItems.map(item => (
          <li
            key={item.label}
            onClick={onButtonClick}
            className="cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-1 group"
          >
            <span>{item.label}</span>
            {item.hasDropdown && (
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </li>
        ))}
      </ul>

      {/* Mobile Logo */}
      <div className="md:hidden">
        <span className="font-regular tracking-tighter text-xl text-[rgba(30,50,90,0.95)]">
          Vexlora
        </span>
      </div>

      {/* Right Button */}
      <div className="flex-1 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onButtonClick}
          className="flex items-center bg-[rgba(30,50,90,0.85)] text-white rounded-full pl-2 pr-4 md:pr-6 py-1.5 md:py-2 gap-2 md:gap-3 hover:bg-[rgba(30,50,90,1)] transition-colors group cursor-pointer shadow-xs"
        >
          <div className="bg-white/20 p-1 md:p-1.5 rounded-full flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <span className="text-xs md:text-sm font-normal">{buttonText}</span>
        </motion.button>
      </div>
    </nav>
  );
};
