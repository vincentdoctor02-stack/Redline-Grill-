import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, Plus, Minus, Check, FlameKindling, Skull } from 'lucide-react';
import { MenuItem, CustomizationOption, HeatLevel, CartItem } from '../types';
import { CUSTOMIZATION_OPTIONS } from '../data';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem | null;
  onAddToOrder: (item: CartItem) => void;
}

export default function CustomizerModal({ isOpen, onClose, menuItem, onAddToOrder }: CustomizerModalProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedToppings, setSelectedToppings] = useState<CustomizationOption[]>([]);
  const [heatLevel, setHeatLevel] = useState<HeatLevel>('MILD');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Reset modal state when item changes
  useEffect(() => {
    if (menuItem) {
      setQuantity(1);
      setSelectedToppings([]);
      setHeatLevel(menuItem.heatLevel || 'MILD');
      setSpecialInstructions('');
    }
  }, [menuItem]);

  if (!menuItem) return null;

  // Calculate dynamic totals
  const toppingPrice = selectedToppings.reduce((sum, item) => sum + item.price, 0);
  const toppingCalories = selectedToppings.reduce((sum, item) => sum + item.calories, 0);
  const unitPrice = menuItem.price + toppingPrice;
  const unitCalories = menuItem.calories + toppingCalories;
  const totalPrice = unitPrice * quantity;
  const totalCalories = unitCalories * quantity;

  const handleToppingToggle = (option: CustomizationOption) => {
    if (selectedToppings.find((t) => t.id === option.id)) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== option.id));
    } else {
      setSelectedToppings([...selectedToppings, option]);
    }
  };

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAdd = () => {
    const item: CartItem = {
      id: `${menuItem.id}-${Date.now()}`,
      menuItem,
      quantity,
      addedToppings: selectedToppings,
      heatLevel: menuItem.heatLevel ? heatLevel : undefined,
      specialInstructions,
    };
    onAddToOrder(item);
    onClose();
  };

  const heatColorMap: Record<HeatLevel, string> = {
    MILD: 'bg-green-500 text-white',
    SPICY: 'bg-amber-500 text-white',
    INFERNO: 'bg-orange-600 text-white',
    GHOST: 'bg-red-700 text-white animate-pulse',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="customizer-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden border-4 border-foodred shadow-2xl z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header banner */}
            <div className="bg-foodred p-4 flex justify-between items-center text-white">
              <div>
                <span className="text-xs uppercase font-display tracking-widest bg-black px-2 py-0.5 rounded-sm font-semibold">CUSTOMIZING</span>
                <h3 className="text-xl font-display font-bold uppercase tracking-wide leading-tight mt-1">{menuItem.name}</h3>
              </div>
              <button
                id="close-modal-btn"
                onClick={onClose}
                className="p-1 rounded-full bg-black/30 hover:bg-black/60 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Scroll Area */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-black">
              {/* Product visual summary */}
              <div className="flex gap-4 items-center bg-gray-100 p-3 rounded-xl border border-gray-200">
                <img
                  src={menuItem.image}
                  alt={menuItem.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 object-cover rounded-lg border border-black/20"
                />
                <div>
                  <p className="text-xs text-gray-500 font-sans">{menuItem.description}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="font-display font-bold text-foodred">${menuItem.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-500 font-semibold">{menuItem.calories} CAL</span>
                  </div>
                </div>
              </div>

              {/* Heat level scale (if customizable or spicy) */}
              {menuItem.heatLevel && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-5 h-5 text-foodred fill-current" />
                    <h4 className="font-display font-bold uppercase tracking-wider text-sm">CHOOSE YOUR BURN LEVEL</h4>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {(['MILD', 'SPICY', 'INFERNO', 'GHOST'] as HeatLevel[]).map((level) => {
                      const isSelected = heatLevel === level;
                      return (
                        <button
                          key={level}
                          id={`heat-btn-${level}`}
                          type="button"
                          onClick={() => setHeatLevel(level)}
                          className={`p-2.5 rounded-lg border-2 text-center transition-all ${
                            isSelected
                              ? `${heatColorMap[level]} border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] scale-[1.02]`
                              : 'border-gray-200 hover:border-foodred bg-gray-50 text-gray-700 font-semibold text-xs'
                          }`}
                        >
                          <div className="font-display font-bold text-xs">{level}</div>
                          <div className="flex justify-center mt-1">
                            {level === 'MILD' && <FlameKindling className="w-4 h-4" />}
                            {level === 'SPICY' && <Flame className="w-4 h-4 text-amber-500 fill-current" />}
                            {level === 'INFERNO' && (
                              <div className="flex gap-0.5">
                                <Flame className="w-4 h-4 text-orange-600 fill-current" />
                                <Flame className="w-4 h-4 text-orange-600 fill-current" />
                              </div>
                            )}
                            {level === 'GHOST' && <Skull className="w-4 h-4 text-red-700" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Toppings Multi-Select */}
              {menuItem.customizable && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h4 className="font-display font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                      <span>LOAD UP TOppings</span>
                      <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-sans font-normal normal-case">Optional</span>
                    </h4>
                    <span className="text-xs text-gray-500 font-medium">Add some punch!</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CUSTOMIZATION_OPTIONS.map((option) => {
                      const isSelected = !!selectedToppings.find((t) => t.id === option.id);
                      return (
                        <button
                          key={option.id}
                          id={`topping-${option.id}`}
                          type="button"
                          onClick={() => handleToppingToggle(option)}
                          className={`flex items-center justify-between p-3 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? 'border-foodred bg-red-50 text-black shadow-xs'
                              : 'border-gray-200 hover:border-gray-400 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded flex items-center justify-center border-2 ${
                              isSelected ? 'bg-foodred border-foodred text-white' : 'border-gray-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <div>
                              <p className="font-bold text-xs leading-tight">{option.name}</p>
                              <span className="text-[10px] text-gray-500">+{option.calories} CAL</span>
                            </div>
                          </div>
                          <span className="font-display font-bold text-xs text-foodred">
                            +${option.price.toFixed(2)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div className="space-y-2">
                <h4 className="font-display font-bold uppercase tracking-wider text-sm">SPECIAL INSTRUCTIONS</h4>
                <textarea
                  id="special-instructions-input"
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. No pickles, well-done, sauce on the side..."
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-foodred focus:outline-hidden text-xs placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Sticky Modal Footer with Quantity and Pricing details */}
            <div className="bg-gray-100 p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4 bg-white px-4 py-2.5 rounded-full border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <button
                  id="quantity-dec-btn"
                  onClick={handleDecrement}
                  className="p-1 text-gray-600 hover:text-black hover:scale-110 active:scale-95 transition"
                >
                  <Minus className="w-5 h-5 stroke-[2.5]" />
                </button>
                <span className="font-display font-bold text-lg text-black min-w-[20px] text-center">{quantity}</span>
                <button
                  id="quantity-inc-btn"
                  onClick={handleIncrement}
                  className="p-1 text-gray-600 hover:text-black hover:scale-110 active:scale-95 transition"
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Add Button with Live Calculation */}
              <button
                id="add-to-tray-btn"
                onClick={handleAdd}
                className="w-full sm:w-auto bg-black text-white hover:bg-foodred active:translate-y-[2px] transition px-6 py-3.5 rounded-full font-display font-extrabold uppercase tracking-wider text-sm flex justify-between sm:justify-center items-center gap-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_#1a1a1a] hover:border-2 hover:border-black"
              >
                <div className="text-left sm:text-center">
                  <span className="block text-[10px] opacity-75 font-sans font-normal leading-none uppercase">ADD TO TRAY</span>
                  <span className="text-xs">{quantity}x {menuItem.name}</span>
                </div>
                <div className="text-right border-l border-white/20 pl-4">
                  <span className="block font-bold text-sm">${totalPrice.toFixed(2)}</span>
                  <span className="block text-[9px] opacity-75 font-sans font-normal leading-none">{totalCalories} CAL</span>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
