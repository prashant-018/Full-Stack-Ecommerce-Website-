# Clean Mobile Drawer - Production Ready Code

## Complete Redesigned Mobile Drawer JSX

Replace your current mobile drawer section in `ResponsiveNavbar.jsx` with this ultra-clean design:

```jsx
{/* Mobile Menu Overlay - Smooth Backdrop Blur */}
{isMobileMenuOpen && (
  <div
    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
    onClick={() => setIsMobileMenuOpen(false)}
    aria-hidden="true"
  />
)}

{/* Mobile Menu Drawer - Ultra Clean Premium Design */}
<div
  className={`
    fixed top-0 left-0 h-full w-[340px] sm:w-[400px] bg-white z-50 
    transform transition-transform duration-300 ease-out md:hidden
    shadow-2xl flex flex-col
    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
  `}
  role="dialog"
  aria-modal="true"
  aria-label="Mobile navigation menu"
>
  {/* Drawer Header - Minimal */}
  <div className="flex-shrink-0 px-6 py-6 flex items-center justify-between">
    <h2 className="text-base font-normal text-gray-900 tracking-wide">Menu</h2>
    <button
      onClick={() => setIsMobileMenuOpen(false)}
      className="p-2 -mr-2 hover:bg-gray-50 rounded-full transition-colors"
      aria-label="Close menu"
    >
      <X className="w-5 h-5 text-gray-600" />
    </button>
  </div>

  {/* Scrollable Content */}
  <div className="flex-1 overflow-y-auto overscroll-contain">
    {/* Navigation Links - Clean Hierarchy */}
    <nav className="px-6 pb-6">
      {tabs.map((t, idx) => {
        let linkPath = "/";
        if (t === "About") linkPath = "/about";
        else if (t === "Everworld Stories") linkPath = "/everworld-stories";
        else if (t === "Men") linkPath = "/men";
        else if (t === "Women") linkPath = "/women";

        const hasSubmenu = menuData[t];

        return (
          <div key={t} className={idx > 0 ? "mt-1" : ""}>
            <div className="flex items-center justify-between">
              <Link
                to={linkPath}
                onClick={() => !hasSubmenu && setIsMobileMenuOpen(false)}
                className="flex-1 py-4 text-[15px] font-normal text-gray-900 hover:text-gray-600 transition-colors"
              >
                {t}
              </Link>
              {hasSubmenu && (
                <button
                  onClick={() => toggleMobileSubmenu(t)}
                  className="p-2 -mr-2 hover:bg-gray-50 rounded-full transition-colors"
                  aria-label={`Toggle ${t} submenu`}
                >
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      expandedMobileMenu === t ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              )}
            </div>

            {/* Submenu */}
            {hasSubmenu && (
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedMobileMenu === t ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="pl-4 pb-5 pt-2 space-y-5">
                  <div>
                    <h4 className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-3">
                      Highlights
                    </h4>
                    <ul className="space-y-2">
                      {menuData[t].highlights.map((item, index) => (
                        <li key={index}>
                          <a
                            href="#"
                            className="text-[13px] text-gray-700 hover:text-black block py-1.5 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-3">
                      Featured
                    </h4>
                    <ul className="space-y-2">
                      {menuData[t].featured.map((item, index) => (
                        <li key={index}>
                          <a
                            href="#"
                            className="text-[13px] text-gray-700 hover:text-black block py-1.5 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>

    {/* Account Section - Soft Background Layer */}
    <div className="bg-gray-50/80 px-6 py-8 mt-4">
      {isAuthenticated ? (
        <div className="space-y-4">
          {/* User Info Card - Clean & Minimal */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center space-x-4 mb-5">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
              </div>
              {/* User Details */}
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-[13px] text-gray-500 truncate">
                  {user?.email || ''}
                </p>
              </div>
            </div>

            {/* Menu Links - Clean List */}
            <div className="space-y-1">
              {/* Admin Dashboard - Only if admin, subtle design */}
              {isAdmin() && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <UserCircle className="w-4 h-4 text-gray-400" />
                <span>My Profile</span>
              </Link>

              <Link
                to="/my-orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Package className="w-4 h-4 text-gray-400" />
                <span>My Orders</span>
              </Link>

              <Link
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                <span>Account Settings</span>
              </Link>
            </div>

            {/* Sign Out - Separated with subtle divider */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center space-x-3 px-3 py-2.5 text-[14px] text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Link
          to="/login"
          onClick={() => setIsMobileMenuOpen(false)}
          className="block bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-medium text-gray-900 mb-0.5">Sign In</p>
              <p className="text-[13px] text-gray-500">Access your account</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 flex-shrink-0" />
          </div>
        </Link>
      )}
    </div>

    {/* Additional Links - Minimal */}
    <div className="px-6 py-6 space-y-1">
      <a
        href="#"
        className="flex items-center justify-between text-[14px] text-gray-700 hover:text-black py-3 transition-colors"
      >
        <span>Help & Support</span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 -rotate-90" />
      </a>
      <a
        href="#"
        className="flex items-center justify-between text-[14px] text-gray-700 hover:text-black py-3 transition-colors"
      >
        <span>Store Locator</span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 -rotate-90" />
      </a>
    </div>

    {/* Footer - Currency Selector */}
    <div className="px-6 pb-8 pt-4 border-t border-gray-100">
      <button className="flex items-center space-x-2.5 text-[13px] text-gray-600 hover:text-black transition-colors">
        <FlagIndia className="w-5 h-5 flex-shrink-0" />
        <span>India (INR ₹)</span>
        <ChevronDown className="w-3.5 h-3.5 ml-auto" />
      </button>
    </div>
  </div>
</div>
```

## Required Imports

Make sure you have these imports at the top of your ResponsiveNavbar.jsx:

```jsx
import { Shield, UserCircle, Package, Settings, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLogout } from "../hooks/useLogout";
```

## Key Design Changes

### 1. Removed All Orange Highlights
- No more `bg-amber-50`, `text-amber-600`, `border-amber-100`
- Clean gray color palette throughout

### 2. Subtle Admin Dashboard
- No special highlighting
- Same style as other menu items
- Just a Shield icon to indicate admin

### 3. Clean Account Card
- White card with subtle shadow
- Soft gray background layer
- No heavy borders

### 4. Proper Visual Hierarchy
```
Header (text-base)
  ↓
Nav Links (text-[15px])
  ↓
Submenu Labels (text-[10px] uppercase)
  ↓
Submenu Items (text-[13px])
  ↓
Account Section (soft gray bg)
  ↓
Menu Items (text-[14px])
  ↓
Footer (text-[13px])
```

### 5. Sign Out Separated
- Subtle divider (`border-t border-gray-100`)
- Red hover state for clarity
- Clean spacing

### 6. Consistent Spacing
- Header: `px-6 py-6`
- Content: `px-6 py-8`
- Links: `py-3` or `py-2.5`
- Sections: `mt-4` separation

### 7. No Clutter
- Removed unnecessary borders
- Clean rounded corners
- Minimal shadows
- Generous whitespace

## Color Palette

```css
Background:     bg-white, bg-gray-50/80, bg-gray-100
Text Primary:   text-gray-900
Text Secondary: text-gray-700, text-gray-600
Text Tertiary:  text-gray-500
Icons:          text-gray-400
Hover:          hover:bg-gray-50, hover:text-black
Sign Out:       hover:text-red-600, hover:bg-red-50
```

## Typography Scale

```css
Header:    text-base (16px)
Nav:       text-[15px]
Menu:      text-[14px]
Submenu:   text-[13px]
Labels:    text-[10px] uppercase tracking-widest
Footer:    text-[13px]
```

## Result

This design is:
- ✅ Clean and minimal
- ✅ No orange highlights
- ✅ Subtle admin indication
- ✅ Proper visual hierarchy
- ✅ Consistent spacing
- ✅ No clutter
- ✅ Premium aesthetic
- ✅ Production-ready
