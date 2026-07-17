import { Flame, Star, Coffee, Moon } from 'lucide-react';

interface HeaderProps {
  activeCategory: 'all' | 'burgers' | 'wings' | 'sides' | 'drinks';
  setActiveCategory: (cat: 'all' | 'burgers' | 'wings' | 'sides' | 'drinks') => void;
  activeTagFilter: string | null;
  setActiveTagFilter: (tag: string | null) => void;
}

export default function Header({
  activeCategory,
  setActiveCategory,
  activeTagFilter,
  setActiveTagFilter,
}: HeaderProps) {
  const categories = [
    { id: 'all', name: 'ALL GRUB' },
    { id: 'burgers', name: 'SMASH BURGERS' },
    { id: 'wings', name: 'SPICY WINGS' },
    { id: 'sides', name: 'LOADED SIDES' },
    { id: 'drinks', name: 'CRAFT SODA' },
  ] as const;

  const filters = [
    { id: 'SIGNATURE', label: '⭐ SIGNATURE' },
    { id: 'SPICY', label: '🔥 SPICY' },
    { id: 'CHEESY', label: '🧀 CHEESY' },
  ];

  return (
    <header className="bg-foodred text-white border-b-8 border-black shadow-2xl">
      {/* Top Brand Banner */}
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-black text-white border-2 border-white px-4 py-1.5 rounded-md font-display font-black tracking-widest text-xs uppercase mb-4 shadow-[3px_3px_0px_rgba(255,255,255,1)] animate-bounce">
          <Flame className="w-4 h-4 text-foodred fill-current" />
          EST. 2026 // OPEN SIZZLING 24/7
        </div>

        <h1 className="text-6xl sm:text-8xl md:text-9xl font-display font-black tracking-tighter uppercase text-white drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] leading-none select-none">
          REDLINE <span className="text-black bg-white px-2 sm:px-4 py-1 inline-block -skew-x-6 transform">GRILL</span>
        </h1>

        <p className="font-display font-bold text-sm sm:text-xl tracking-[0.2em] sm:tracking-[0.3em] text-white uppercase mt-4 max-w-2xl opacity-95 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
          STREET FOOD REVOLUTION — GOURMET SMASH & HEAT
        </p>

        {/* Live operational indicators - authentic human labels */}
        <div className="flex flex-wrap justify-center gap-6 mt-6 pt-6 border-t border-white/20 w-full max-w-lg text-xs font-display font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 absolute" />
            <span>GRILLS: HIGH TEMP</span>
          </div>
          <span className="opacity-40">|</span>
          <div>EST. WAIT TIME: 8-12 MINS</div>
          <span className="opacity-40">|</span>
          <div>CURB PICKUP ACTIVE</div>
        </div>
      </div>

      {/* Navigation and Category Tabs */}
      <div className="bg-black py-4 border-t-2 border-white/20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Categories */}
          <nav className="flex overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-none" aria-label="Menu categories">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-md font-display font-black text-xs tracking-wider uppercase whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-foodred text-white border-2 border-white shadow-[2px_2px_0px_rgba(255,255,255,1)] scale-[1.03]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </nav>

          {/* Quick Filters */}
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-display font-black tracking-widest text-gray-500 uppercase">
              FILTER GRUB:
            </span>
            <div className="flex gap-1.5 flex-wrap">
              <button
                id="filter-all-btn"
                onClick={() => setActiveTagFilter(null)}
                className={`px-3 py-1.5 rounded text-[10px] font-display font-bold tracking-wider uppercase transition-all ${
                  activeTagFilter === null
                    ? 'bg-white text-black font-black border-2 border-white'
                    : 'bg-darkgray text-gray-300 hover:bg-gray-800'
                }`}
              >
                SHOW ALL
              </button>
              {filters.map((filter) => {
                const isActive = activeTagFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    id={`filter-btn-${filter.id}`}
                    onClick={() => setActiveTagFilter(filter.id)}
                    className={`px-3 py-1.5 rounded text-[10px] font-display font-bold tracking-wider uppercase transition-all ${
                      isActive
                        ? 'bg-foodred text-white border-2 border-foodred'
                        : 'bg-darkgray text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
