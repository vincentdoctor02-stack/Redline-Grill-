import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Trash2, Flame, FlameKindling, Skull, Sparkles, Clock, CheckCircle2, Ticket } from 'lucide-react';
import { CartItem, Order, HeatLevel } from '../types';

interface OrderTrayProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearTray: () => void;
  onPlaceOrder: (customerName: string) => void;
  activeOrder: Order | null;
  onResetOrder: () => void;
}

export default function OrderTray({
  items,
  onRemoveItem,
  onClearTray,
  onPlaceOrder,
  activeOrder,
  onResetOrder,
}: OrderTrayProps) {
  const [customerName, setCustomerName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const itemTotal = items.reduce((sum, item) => {
    const toppingCost = item.addedToppings.reduce((tSum, t) => tSum + t.price, 0);
    return sum + (item.menuItem.price + toppingCost) * item.quantity;
  }, 0);

  const calTotal = items.reduce((sum, item) => {
    const toppingCals = item.addedToppings.reduce((tSum, t) => tSum + t.calories, 0);
    return sum + (item.menuItem.calories + toppingCals) * item.quantity;
  }, 0);

  // Calculate order heat score
  const calculateHeatScore = () => {
    let score = 0;
    items.forEach((item) => {
      const heat = item.heatLevel || item.menuItem.heatLevel;
      if (heat === 'MILD') score += 1 * item.quantity;
      if (heat === 'SPICY') score += 2 * item.quantity;
      if (heat === 'INFERNO') score += 4 * item.quantity;
      if (heat === 'GHOST') score += 8 * item.quantity;
    });
    return score;
  };

  const heatScore = calculateHeatScore();

  const handleSizzleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('We need a name for the grill ticket!');
      return;
    }
    setErrorMsg('');
    onPlaceOrder(customerName);
  };

  const statusProgress: Record<string, { label: string; desc: string; progress: number }> = {
    QUEUED: {
      label: 'Ticket Queued',
      desc: 'Order ticket spiked. Griller prepping the station.',
      progress: 10,
    },
    SEARING: {
      label: 'On the Sizzle Grid',
      desc: 'Smash patties searing on the blazing-hot 450°F cast iron!',
      progress: 35,
    },
    ASSEMBLING: {
      label: 'Melt & Stack Station',
      desc: 'Melting premium cheeses & stacking fresh gourmet toppings.',
      progress: 65,
    },
    PACKAGING: {
      label: 'Greaseproof Wrapping',
      desc: 'Wrapping in our dynamic thermal Redline foil to lock in heat.',
      progress: 85,
    },
    READY: {
      label: 'SIZZLING HOT & READY',
      desc: 'Grab your tray from the counter! Burn notice active.',
      progress: 100,
    },
  };

  return (
    <div id="order-tray-section" className="bg-darkgray border-sticker p-6 rounded-2xl flex flex-col text-white h-full justify-between">
      <div>
        {/* Title */}
        <div className="border-b-2 border-foodred pb-4 mb-4 flex justify-between items-center">
          <h2 className="font-display font-black text-2xl uppercase tracking-wider flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-foodred" />
            <span>THE GRILL TRAY</span>
          </h2>
          {items.length > 0 && !activeOrder && (
            <button
              id="clear-tray-btn"
              onClick={onClearTray}
              className="text-xs uppercase text-gray-400 hover:text-foodred transition font-bold font-display"
            >
              DUMP TRAY
            </button>
          )}
        </div>

        {/* 1. ACTIVE ORDER TRACKER MODE */}
        {activeOrder ? (
          <div className="space-y-6">
            <div className="bg-black/40 border border-white/10 p-5 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-display font-bold text-gray-500">TICKET NUMBER</span>
                  <p className="text-2xl font-display font-black text-foodred">#{activeOrder.id.slice(-4).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-display font-bold text-gray-500">CUSTOMER</span>
                  <p className="font-display font-bold uppercase text-sm">{activeOrder.customerName}</p>
                </div>
              </div>

              {/* Status Visual Gauge */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-display font-bold uppercase tracking-wider text-foodred">
                    {statusProgress[activeOrder.status].label}
                  </span>
                  <span className="font-sans font-bold text-gray-400">
                    {statusProgress[activeOrder.status].progress}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-3 w-full bg-charcoal rounded-full overflow-hidden border border-white/10">
                  <motion.div
                    className="h-full bg-foodred rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${statusProgress[activeOrder.status].progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-xs text-gray-300 italic font-sans pt-1">
                  &ldquo;{statusProgress[activeOrder.status].desc}&rdquo;
                </p>
              </div>

              {/* Live steps list */}
              <div className="space-y-2 text-xs font-display font-bold text-gray-400 pt-2 border-t border-white/5">
                {(['QUEUED', 'SEARING', 'ASSEMBLING', 'PACKAGING', 'READY'] as const).map((step) => {
                  const stepIndex = ['QUEUED', 'SEARING', 'ASSEMBLING', 'PACKAGING', 'READY'].indexOf(step);
                  const activeIndex = ['QUEUED', 'SEARING', 'ASSEMBLING', 'PACKAGING', 'READY'].indexOf(activeOrder.status);
                  const isDone = stepIndex < activeIndex;
                  const isCurrent = stepIndex === activeIndex;

                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-2 ${
                        isCurrent ? 'text-foodred scale-[1.01]' : isDone ? 'text-white' : 'opacity-30'
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        isCurrent ? 'bg-foodred animate-pulse' : isDone ? 'bg-green-400' : 'bg-gray-700'
                      }`} />
                      <span className="uppercase tracking-wider">{step}</span>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-green-400 inline ml-auto" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulated Receipt printable ticket */}
            {activeOrder.status === 'READY' && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white text-black p-5 rounded-lg border-2 border-dashed border-gray-400 font-mono text-xs space-y-3 shadow-xl"
              >
                <div className="text-center border-b border-dashed border-gray-300 pb-3">
                  <h4 className="font-display font-black text-lg tracking-widest uppercase">REDLINE GRILL TICKET</h4>
                  <p className="text-[10px] text-gray-500">2026 ROAD-GRILL STREET STATION</p>
                </div>
                <div className="space-y-1">
                  <p><strong>TICKET ID:</strong> #{activeOrder.id.slice(-4).toUpperCase()}</p>
                  <p><strong>CUSTOMER:</strong> {activeOrder.customerName.toUpperCase()}</p>
                  <p><strong>STAMP:</strong> {activeOrder.createdAt}</p>
                </div>
                <div className="border-t border-b border-dashed border-gray-300 py-2 my-2 space-y-1">
                  {activeOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p>{item.quantity}x {item.menuItem.name.toUpperCase()}</p>
                        {item.addedToppings.map((t) => (
                          <p key={t.id} className="text-[10px] text-gray-500 pl-2">+ {t.name.toUpperCase()}</p>
                        ))}
                        {item.heatLevel && (
                          <p className="text-[10px] text-foodred pl-2">* HEAT: {item.heatLevel}</p>
                        )}
                      </div>
                      <p>${(item.menuItem.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-sm">
                  <span>TOTAL PAID:</span>
                  <span>${activeOrder.totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-gray-500 text-center italic pt-2">
                  Show this ticket at the counter. Warning: food is hot!
                </p>
              </motion.div>
            )}

            {/* Back to menu button */}
            <button
              id="new-order-btn"
              onClick={onResetOrder}
              className="w-full bg-foodred hover:bg-white hover:text-black py-4 px-6 rounded-xl font-display font-bold uppercase tracking-wider text-xs transition duration-200 shadow-[3px_3px_0px_rgba(0,0,0,1)]"
            >
              Order More Grub
            </button>
          </div>
        ) : items.length === 0 ? (
          /* 2. EMPTY STATE */
          <div className="py-12 flex flex-col items-center text-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-charcoal border-2 border-foodred flex items-center justify-center text-gray-500">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg uppercase tracking-wide">Tray is Cold</h3>
              <p className="text-xs text-gray-400 font-sans max-w-[240px] mx-auto mt-1 leading-relaxed">
                Click on the menu to customize and stack some high-energy fuel on your tray.
              </p>
            </div>
          </div>
        ) : (
          /* 3. ACTIVE CART TRAYS */
          <div className="space-y-4">
            {/* Scrollable list of items */}
            <div className="max-h-[360px] overflow-y-auto space-y-3 pr-1">
              <AnimatePresence>
                {items.map((item) => {
                  const toppingsCost = item.addedToppings.reduce((s, t) => s + t.price, 0);
                  const itemSubtotal = (item.menuItem.price + toppingsCost) * item.quantity;
                  const itemCalories = (item.menuItem.calories + item.addedToppings.reduce((s, t) => s + t.calories, 0)) * item.quantity;

                  return (
                    <motion.div
                      key={item.id}
                      id={`cart-item-${item.id}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-black/40 border border-white/10 p-3.5 rounded-xl flex gap-3 relative group"
                    >
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 object-cover rounded-lg border border-white/10"
                      />
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-display font-bold uppercase text-xs truncate leading-none pt-0.5">
                            {item.quantity}x {item.menuItem.name}
                          </h4>
                          <span className="font-display font-bold text-xs text-foodred whitespace-nowrap">
                            ${itemSubtotal.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-sans mt-0.5">{itemCalories} CAL total</p>

                        {/* Customizations display */}
                        {item.addedToppings.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.addedToppings.map((top) => (
                              <span
                                key={top.id}
                                className="text-[8px] font-sans font-semibold bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-300"
                              >
                                + {top.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Spice Tag */}
                        {item.heatLevel && (
                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-[8px] font-display font-extrabold tracking-widest text-foodred bg-red-500/10 px-1.5 py-0.5 rounded border border-foodred/20 uppercase flex items-center">
                              <Flame className="w-2.5 h-2.5 text-foodred fill-current mr-0.5" />
                              BURN: {item.heatLevel}
                            </span>
                          </div>
                        )}

                        {/* Instructions */}
                        {item.specialInstructions && (
                          <p className="text-[9px] text-gray-400 italic font-sans mt-1 bg-charcoal/40 p-1.5 rounded border border-white/5">
                            &ldquo;{item.specialInstructions}&rdquo;
                          </p>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        id={`remove-item-btn-${item.id}`}
                        onClick={() => onRemoveItem(item.id)}
                        className="absolute right-2 top-2 p-1 rounded-md text-gray-400 hover:text-foodred hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Custom Interactive Spiciness Index / Burn Gauge */}
            {heatScore > 0 && (
              <div className="bg-black/30 border border-white/10 p-3 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-foodred/15 rounded border border-foodred/30">
                    {heatScore > 12 ? (
                      <Skull className="w-5 h-5 text-foodred animate-bounce" />
                    ) : (
                      <Flame className="w-5 h-5 text-foodred fill-current animate-pulse" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-display font-black text-[10px] tracking-wider uppercase text-foodred">ORDER BURN INDEX</h5>
                    <p className="text-[10px] text-gray-400 font-sans leading-none mt-0.5">
                      {heatScore > 12 ? 'CAUTION: HAZARDOUS HEAT' : heatScore > 6 ? 'WARNING: EXTREMELY SPICY' : 'STANDARD GRUB BURN'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-charcoal px-2.5 py-1 rounded-md border border-white/10">
                  <span className="font-display font-extrabold text-xs">{heatScore}</span>
                  <span className="text-[9px] text-gray-500 font-sans">🔥</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER FORM (ONLY IF ITEMS EXIST AND NOT ORDERED) */}
      {items.length > 0 && !activeOrder && (
        <div className="pt-4 border-t-2 border-foodred mt-4 space-y-4">
          {/* Subtotals */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center text-gray-400">
              <span className="font-display font-bold">TOTAL ITEMS</span>
              <span className="font-sans font-bold">{items.reduce((s, i) => s + i.quantity, 0)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-400">
              <span className="font-display font-bold">TOTAL ENERGY</span>
              <span className="font-display font-black text-foodred bg-red-500/10 px-1.5 rounded">{calTotal} CAL</span>
            </div>
            <div className="flex justify-between items-center font-display font-black text-lg pt-1 border-t border-white/5">
              <span>ORDER TOTAL</span>
              <span className="text-xl text-white font-mono">${itemTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Sizzle Submit Ticket Form */}
          <form onSubmit={handleSizzleSubmit} className="space-y-3">
            <div>
              <label htmlFor="customer-name" className="block text-[10px] font-display font-black tracking-wider text-gray-400 uppercase mb-1">
                NAME FOR GRILL TICKET
              </label>
              <input
                id="customer-name"
                type="text"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (e.target.value.trim()) setErrorMsg('');
                }}
                placeholder="e.g. Maverick, Sarah..."
                className="w-full bg-charcoal border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-hidden focus:border-foodred placeholder:text-gray-600"
              />
              {errorMsg && (
                <p className="text-[10px] text-foodred font-bold font-sans mt-1 flex items-center gap-1 animate-shake">
                  ⚠ {errorMsg}
                </p>
              )}
            </div>

            <button
              id="sizzle-grill-btn"
              type="submit"
              className="w-full bg-foodred hover:bg-white hover:text-black py-4 px-6 rounded-xl font-display font-black uppercase tracking-widest text-xs transition duration-200 flex justify-center items-center gap-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              <Flame className="w-4 h-4 fill-current text-white group-hover:text-black" />
              SIZZLE ORDER & SEND TO GRILL
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
