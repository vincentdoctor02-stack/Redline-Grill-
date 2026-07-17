import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import MenuCard from './components/MenuCard';
import OrderTray from './components/OrderTray';
import CustomizerModal from './components/CustomizerModal';
import { MENU_ITEMS } from './data';
import { CartItem, MenuItem, Order } from './types';
import { AlertCircle, Flame, CheckCircle, Info } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'burgers' | 'wings' | 'sides' | 'drinks'>('all');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // References to track order timers
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter items based on active tabs & tags
  const filteredItems = MENU_ITEMS.filter((item) => {
    const categoryMatches = activeCategory === 'all' || item.category === activeCategory;
    const tagMatches = activeTagFilter === null || item.tags.includes(activeTagFilter);
    return categoryMatches && tagMatches;
  });

  const handleCustomizeClick = (item: MenuItem) => {
    setCustomizingItem(item);
    setIsCustomizerOpen(true);
  };

  const handleAddToOrder = (cartItem: CartItem) => {
    setCart((prevCart) => {
      // Check if item has same exact specification (toppings and heat)
      const existingItemIndex = prevCart.findIndex((pItem) => {
        if (pItem.menuItem.id !== cartItem.menuItem.id) return false;
        if (pItem.heatLevel !== cartItem.heatLevel) return false;
        if (pItem.addedToppings.length !== cartItem.addedToppings.length) return false;
        
        // Compare toppings array
        const pToppingIds = pItem.addedToppings.map((t) => t.id).sort().join(',');
        const cToppingIds = cartItem.addedToppings.map((t) => t.id).sort().join(',');
        return pToppingIds === cToppingIds;
      });

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += cartItem.quantity;
        return newCart;
      }

      return [...prevCart, cartItem];
    });
  };

  const handleRemoveFromTray = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleClearTray = () => {
    setCart([]);
  };

  const handlePlaceOrder = (customerName: string) => {
    // Calculate final stats
    const totalCost = cart.reduce((sum, item) => {
      const toppingCost = item.addedToppings.reduce((tSum, t) => tSum + t.price, 0);
      return sum + (item.menuItem.price + toppingCost) * item.quantity;
    }, 0);

    const totalCals = cart.reduce((sum, item) => {
      const toppingCals = item.addedToppings.reduce((tSum, t) => tSum + t.calories, 0);
      return sum + (item.menuItem.calories + toppingCals) * item.quantity;
    }, 0);

    const orderObj: Order = {
      id: `redline-${Math.random().toString(36).substr(2, 9)}`,
      items: [...cart],
      totalPrice: totalCost,
      totalCalories: totalCals,
      status: 'QUEUED',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      customerName,
    };

    setActiveOrder(orderObj);
    setCart([]); // Clear active cart

    // Start simulated live cooking timer sequence
    simulateCookingProgress();
  };

  const simulateCookingProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const stages: Order['status'][] = ['QUEUED', 'SEARING', 'ASSEMBLING', 'PACKAGING', 'READY'];
    let currentStageIndex = 0;

    const runNextStage = () => {
      if (currentStageIndex < stages.length - 1) {
        currentStageIndex++;
        const nextStage = stages[currentStageIndex];
        setActiveOrder((prev) => (prev ? { ...prev, status: nextStage } : null));

        // Setup next trigger with differing times for realism
        let nextDelay = 3500;
        if (nextStage === 'ASSEMBLING') nextDelay = 4500;
        if (nextStage === 'PACKAGING') nextDelay = 3500;
        if (nextStage === 'READY') nextDelay = 3000;

        timerRef.current = setTimeout(runNextStage, nextDelay);
      }
    };

    // First delay
    timerRef.current = setTimeout(runNextStage, 3000);
  };

  const handleResetOrder = () => {
    setActiveOrder(null);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-charcoal text-white font-sans flex flex-col selection:bg-foodred selection:text-white">
      {/* Top Header Banner */}
      <Header
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        activeTagFilter={activeTagFilter}
        setActiveTagFilter={setActiveTagFilter}
      />

      {/* Main App Workspace */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {/* Menu Items Grid: takes 2 columns on desktop */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h2 className="font-display font-bold uppercase tracking-wider text-lg flex items-center gap-1.5">
              <span>ACTIVE MENU SPECS</span>
              <span className="text-xs bg-darkgray text-gray-400 px-2.5 py-0.5 rounded border border-white/5 font-sans font-medium">
                {filteredItems.length} ITEM{filteredItems.length !== 1 ? 'S' : ''}
              </span>
            </h2>

            <div className="text-xs text-gray-400 font-medium hidden sm:block">
              All patties are 100% aged prime beef
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="py-20 text-center bg-darkgray rounded-2xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center p-6">
              <AlertCircle className="w-12 h-12 text-foodred mb-3" />
              <h3 className="font-display font-bold text-lg uppercase tracking-wide">NO MATCHING GRUB FOUND</h3>
              <p className="text-xs text-gray-400 font-sans mt-1 max-w-[320px] leading-relaxed">
                We don&apos;t have items matching that combination. Try picking a different category tab or clear the filter above!
              </p>
              <button
                id="reset-filters-btn"
                onClick={() => {
                  setActiveCategory('all');
                  setActiveTagFilter(null);
                }}
                className="mt-4 bg-foodred hover:bg-white hover:text-black text-white px-4 py-2 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onCustomize={handleCustomizeClick}
                />
              ))}
            </div>
          )}
        </section>

        {/* Order Tray Panel: takes 1 column on desktop */}
        <aside className="lg:col-span-1 h-fit lg:sticky lg:top-8">
          <OrderTray
            items={cart}
            onRemoveItem={handleRemoveFromTray}
            onClearTray={handleClearTray}
            onPlaceOrder={handlePlaceOrder}
            activeOrder={activeOrder}
            onResetOrder={handleResetOrder}
          />

          {/* Quick Notice Card */}
          {!activeOrder && (
            <div className="mt-4 bg-darkgray/40 border border-white/5 p-4 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-foodred shrink-0 mt-0.5" />
              <div className="text-[11px] text-gray-400 font-sans leading-relaxed">
                <strong>GRILL MASTER NOTICE:</strong> Customizing items adds calories and costs dynamically. Spiciness levels will aggregate on the Tray and trigger safety notices if you exceed 12 Fire Score points!
              </div>
            </div>
          )}
        </aside>
      </main>

      {/* Footer information */}
      <footer className="border-t border-white/10 bg-black/60 py-6 mt-12 text-xs text-center text-gray-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:justify-between items-center gap-2">
          <p>&copy; 2026 Redline Gourmet Grill. Proudly serving high-octane street food.</p>
          <p className="text-foodred font-display font-bold tracking-widest uppercase">STRICT HYGIENE & SUPREME SIZZLE</p>
        </div>
      </footer>

      {/* Customize Modal Portal */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        menuItem={customizingItem}
        onAddToOrder={handleAddToOrder}
      />
    </div>
  );
}
