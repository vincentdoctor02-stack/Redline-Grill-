import React from 'react';
import { MenuItem } from '../types';
import { Flame, FlameKindling, Skull, Sparkles, AlertCircle } from 'lucide-react';

interface MenuCardProps {
  key?: string;
  item: MenuItem;
  onCustomize: (item: MenuItem) => void;
}

export default function MenuCard({ item, onCustomize }: MenuCardProps) {
  // Map icons to tags for fun visual cues
  const getTagIcon = (tag: string) => {
    switch (tag) {
      case 'SIGNATURE':
        return <Sparkles className="w-3.5 h-3.5 mr-1" />;
      case 'SPICY':
      case 'EXTREME-HEAT':
        return <Flame className="w-3.5 h-3.5 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div
      id={`menu-card-${item.id}`}
      className="bg-white rounded-2xl overflow-hidden border-sticker-interactive flex flex-col h-full text-black"
    >
      {/* Product Image & Tags */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100 group">
        <img
          src={item.image}
          alt={item.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top-right Tag Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[85%]">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className={`flex items-center px-2 py-1 text-[10px] font-display font-black tracking-wider uppercase rounded-md shadow-xs ${
                tag === 'SIGNATURE'
                  ? 'bg-black text-yellow-400 border border-yellow-400'
                  : tag === 'SPICY' || tag === 'EXTREME-HEAT'
                  ? 'bg-foodred text-white'
                  : 'bg-gray-100 text-gray-800 border border-gray-300'
              }`}
            >
              {getTagIcon(tag)}
              {tag}
            </span>
          ))}
        </div>

        {/* Heat indicator overlays on image bottom-right */}
        {item.heatLevel && (
          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1">
            <span className="text-[9px] font-display font-bold text-white tracking-widest uppercase">BURN:</span>
            {item.heatLevel === 'MILD' && <FlameKindling className="w-3.5 h-3.5 text-green-400" />}
            {item.heatLevel === 'SPICY' && <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />}
            {item.heatLevel === 'GHOST' && <Skull className="w-3.5 h-3.5 text-red-500 animate-pulse" />}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title and Calorie counter */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-display font-extrabold text-xl uppercase tracking-wide leading-none text-black">
            {item.name}
          </h3>
          <span className="text-foodred font-display font-black text-sm whitespace-nowrap bg-red-50 px-2 py-0.5 rounded-sm border border-foodred/20">
            {item.calories} CAL
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 font-sans leading-relaxed mb-4 flex-1">
          {item.description}
        </p>

        {/* Pricing, customizable warning and order button */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
              <span className="block text-[9px] text-gray-400 uppercase font-sans font-bold leading-none">PRICE</span>
              <span className="font-display font-black text-2xl text-black">
                ${item.price.toFixed(2)}
              </span>
            </div>
            
            {item.customizable ? (
              <span className="text-[10px] text-foodred bg-red-50 font-semibold px-2 py-1 rounded-sm flex items-center gap-1 border border-red-100">
                <AlertCircle className="w-3 h-3" />
                CUSTOMIZABLE
              </span>
            ) : (
              <span className="text-[10px] text-gray-400 bg-gray-50 font-semibold px-2 py-1 rounded-sm">
                STANDARD SPEC
              </span>
            )}
          </div>

          <button
            id={`customize-btn-${item.id}`}
            onClick={() => onCustomize(item)}
            className="w-full bg-black hover:bg-foodred text-white py-3.5 px-6 rounded-full font-display font-black uppercase tracking-widest text-xs transition-all duration-250 flex justify-center items-center gap-1.5 shadow-md hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            {item.customizable ? '⚡ Customize & Sizzle' : '🍔 Add To Tray'}
          </button>
        </div>
      </div>
    </div>
  );
}
