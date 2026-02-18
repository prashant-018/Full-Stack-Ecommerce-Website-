# Responsive Design Guide - Everlane E-commerce

## Overview
This guide provides comprehensive responsive design fixes for the Everlane-style e-commerce website using React + Vite + Tailwind CSS.

## Tailwind Breakpoints Reference

```
sm: 640px   - Small devices (landscape phones)
md: 768px   - Medium devices (tablets)
lg: 1024px  - Large devices (desktops)
xl: 1280px  - Extra large devices
2xl: 1536px - 2X Extra large devices
```

## Key Responsive Principles

### 1. Mobile-First Approach
Always start with mobile styles, then add larger breakpoints:
```jsx
// ✅ CORRECT - Mobile first
<div className="w-full md:w-1/2 lg:w-1/3">

// ❌ WRONG - Desktop first
<div className="w-1/3 md:w-1/2 sm:w-full">
```

### 2. Image Responsiveness
```jsx
// ✅ CORRECT - Responsive images
<img 
  src={imageUrl}
  alt="Product"
  className="w-full h-auto object-cover"
  loading="lazy"
/>

// For aspect ratio containers
<div className="aspect-[3/4] w-full overflow-hidden">
  <img 
    src={imageUrl}
    className="w-full h-full object-cover hover:scale-105 transition-transform"
  />
</div>
```

### 3. Grid Layouts
```jsx
// Product grids - 1 col mobile, 2 col tablet, 3+ desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
  {products.map(product => <ProductCard key={product.id} product={product} />)}
</div>
```

### 4. Container Max-Width
```jsx
// Use consistent container pattern
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

### 5. Typography Scaling
```jsx
// Scale text sizes appropriately
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
<p className="text-sm sm:text-base lg:text-lg">
```

### 6. Spacing
```jsx
// Responsive padding and margins
<div className="p-4 sm:p-6 lg:p-8">
<div className="space-y-4 sm:space-y-6 lg:space-y-8">
<div className="gap-4 sm:gap-6 lg:gap-8">
```

### 7. Hide/Show Elements
```jsx
// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop only</div>

// Show on mobile, hide on desktop
<div className="block md:hidden">Mobile only</div>

// Flex direction changes
<div className="flex flex-col md:flex-row">
```

## Component-Specific Fixes

### Navbar
- Mobile: Hamburger menu, stacked layout
- Tablet: Partial navigation visible
- Desktop: Full horizontal navigation

### Hero Section
- Mobile: Smaller text, adjusted padding
- Tablet: Medium text size
- Desktop: Full-size hero with large text

### Product Grid
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

### Footer
- Mobile: Stacked sections
- Tablet: 2 columns
- Desktop: 5 columns

### Sidebar Filters
- Mobile: Collapsible drawer/modal
- Tablet: Collapsible sidebar
- Desktop: Fixed sidebar

## Common Responsive Patterns

### 1. Responsive Navigation
```jsx
// Mobile hamburger menu
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

<button 
  className="md:hidden"
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
>
  <MenuIcon />
</button>

<nav className={`
  fixed inset-0 bg-white z-50 transform transition-transform
  ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
  md:relative md:translate-x-0 md:flex
`}>
  {/* Navigation items */}
</nav>
```

### 2. Responsive Cards
```jsx
<div className="
  bg-white rounded-lg shadow-sm
  p-4 sm:p-6
  space-y-3 sm:space-y-4
">
  <img className="w-full h-auto aspect-square object-cover" />
  <h3 className="text-sm sm:text-base font-medium">
  <p className="text-xs sm:text-sm text-gray-600">
</div>
```

### 3. Responsive Forms
```jsx
<form className="space-y-4 sm:space-y-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <input className="w-full px-3 py-2 sm:px-4 sm:py-3" />
    <input className="w-full px-3 py-2 sm:px-4 sm:py-3" />
  </div>
</form>
```

### 4. Responsive Tables
```jsx
// Mobile: Card layout
// Desktop: Table layout
<div className="block md:hidden">
  {/* Card view for mobile */}
</div>

<div className="hidden md:block overflow-x-auto">
  <table className="min-w-full">
    {/* Table view for desktop */}
  </table>
</div>
```

## Testing Checklist

- [ ] Test on mobile (320px - 640px)
- [ ] Test on tablet (640px - 1024px)
- [ ] Test on desktop (1024px+)
- [ ] No horizontal scrolling on any screen size
- [ ] Images load and scale properly
- [ ] Text is readable on all devices
- [ ] Touch targets are at least 44x44px on mobile
- [ ] Navigation works on all devices
- [ ] Forms are usable on mobile
- [ ] Modals/overlays work on mobile

## Performance Tips

1. **Lazy load images**: Use `loading="lazy"` attribute
2. **Optimize images**: Use appropriate sizes for different breakpoints
3. **Use CSS transforms**: Better performance than changing layout properties
4. **Minimize re-renders**: Use React.memo for expensive components
5. **Code splitting**: Load mobile/desktop components separately if needed

## Accessibility

- Ensure touch targets are large enough (min 44x44px)
- Maintain proper heading hierarchy
- Ensure sufficient color contrast
- Test with screen readers
- Support keyboard navigation
- Add proper ARIA labels

## Common Mistakes to Avoid

❌ Fixed widths without responsive alternatives
❌ Absolute positioning without mobile consideration
❌ Overflow hidden that cuts off content
❌ Small touch targets on mobile
❌ Horizontal scrolling
❌ Text that's too small on mobile
❌ Images that don't scale
❌ Desktop-only navigation patterns

## Resources

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev Responsive Images](https://web.dev/responsive-images/)
