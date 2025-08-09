import React from 'react';
import { cn } from "@/lib/utils";

interface DisplayCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

interface DisplayCardsProps {
  cards: DisplayCard[];
  className?: string;
}

const DisplayCards: React.FC<DisplayCardsProps> = ({ cards, className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {cards.map((card, index) => (
        <div
          key={index}
          className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700 p-6 hover:border-yellow-500/50 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10">
            <div className={cn("mb-3", card.iconClassName)}>
              {card.icon}
            </div>
            
            <h3 className={cn("text-lg font-semibold mb-2", card.titleClassName || "text-white")}>
              {card.title}
            </h3>
            
            <p className="text-gray-400 text-sm mb-2">
              {card.description}
            </p>
            
            {card.date && (
              <p className="text-gray-500 text-xs">
                {card.date}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisplayCards;