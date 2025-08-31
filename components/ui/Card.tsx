
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
