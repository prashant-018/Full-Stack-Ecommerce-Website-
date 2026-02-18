# Responsive Design Best Practices - Everlane Style

## Design Philosophy

The Everlane aesthetic is characterized by:
- **Minimal luxury**: Clean, uncluttered layouts
- **Quality over quantity**: Fewer, better-designed elements
- **Whitespace**: Generous spacing that breathes
- **Typography**: Clear hierarchy with elegant fonts
- **Imagery**: High-quality, aspirational product photography

## Mobile-First Responsive Strategy

### Why Mobile-First?

1. **Performance**: Smaller devices get optimized code first
2. **Progressive enhancement**: Add features as screen size increases
3. **Simpler logic**: Easier to add than remove
4. **User-centric**: Most traffic comes from mobile

### Mobile-First Workflow

```jsx
// ✅ CORRECT - Mobile first
<div className="
  text-sm          /* Mobile: 14px */
  sm:text-base     /* Tablet: 16px */
  lg:text-lg       /* Desktop: 18px */
">

// ❌ WRONG - Desktop first
<div className="
  text-lg          /* All sizes: 18px */
  sm:text-base     /* Tablet: 16px */
  text-sm          /* Mobile: 14px - Won't work! */
">
```

## Responsive Image Strategy

### 1. Product Images

```jsx
// Product Card Image
<div className="aspect-[3/4] w-full overflow-hidden bg-gray-100">
  <img
    src={product.image}
    alt={product.name}
    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
    loading="lazy"
  />
</div>
```

### 2. Hero Images

```jsx
// Hero Banner with Responsive Height
<div className="
  relative w-full overflow-hidden
  h-[400px]      /* Mobile */
  sm:h-[500px]   /* Tablet */
  lg:h-[700px]   /* Desktop */
">
  <img
    src={heroImage}
    alt="Hero"
    className="w-full h-full object-cover object-center"
  />
</div>
```

### 3. Gallery Images

```jsx
// Masonry Grid
<div className="
  columns-1        /* Mobile: 1 column */
  sm:columns-2     /* Tablet: 2 columns */
  lg:columns-3     /* Desktop: 3 columns */
  gap-4 sm:gap-6
">
  {images.map(img => (
    <img
      key={img.id}
      src={img.src}
      className="w-full h-auto mb-4 sm:mb-6"
      loading="lazy"
    />
  ))}
</div>
```

## Typography Scale

### Everlane-Style Typography

```jsx
// Headings
<h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight">
<h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
<h3 className="text-xl sm:text-2xl lg:text-3xl font-medium">
<h4 className="text-lg sm:text-xl lg:text-2xl font-medium">

// Body Text
<p className="text-sm sm:text-base lg:text-lg text-gray-700">

// Small Text
<span className="text-xs sm:text-sm text-gray-500">

// Button Text
<button className="text-xs sm:text-sm tracking-wide uppercase">
```

## Spacing System

### Consistent Spacing

```jsx
// Container Padding
<div className="px-4 sm:px-6 lg:px-8">

// Section Padding
<section className="py-8 sm:py-12 lg:py-16">

// Card Padding
<div className="p-4 sm:p-6 lg:p-8">

// Stack Spacing
<div className="space-y-4 sm:space-y-6 lg:space-y-8">

// Grid Gap
<div className="gap-4 sm:gap-6 lg:gap-8">
```

## Grid Layouts

### Product Grids

```jsx
// Standard Product Grid
<div className="
  grid
  grid-cols-1        /* Mobile: 1 column */
  sm:grid-cols-2     /* Tablet: 2 columns */
  lg:grid-cols-3     /* Desktop: 3 columns */
  xl:grid-cols-4     /* Large: 4 columns */
  gap-4 sm:gap-6 lg:gap-8
">

// Featured Products (Larger)
<div className="
  grid
  grid-cols-1        /* Mobile: 1 column */
  md:grid-cols-2     /* Tablet+: 2 columns */
  gap-6 sm:gap-8 lg:gap-12
">

// Category Grid
<div className="
  grid
  grid-cols-2        /* Mobile: 2 columns */
  md:grid-cols-3     /* Tablet: 3 columns */
  lg:grid-cols-4     /* Desktop: 4 columns */
  gap-3 sm:gap-4 lg:gap-6
">
```

## Navigation Patterns

### Desktop Navigation

```jsx
<nav className="hidden md:flex items-center space-x-8">
  {links.map(link => (
    <Link
      key={link.id}
      to={link.path}
      className="text-sm text-gray-700 hover:text-black transition-colors"
    >
      {link.label}
    </Link>
  ))}
</nav>
```

### Mobile Navigation

```jsx
// Hamburger Button
<button
  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
  onClick={() => setMobileMenuOpen(true)}
>
  <Menu className="w-5 h-5" />
</button>

// Mobile Drawer
<div className={`
  fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50
  transform transition-transform duration-300
  ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
  md:hidden
`}>
  {/* Mobile menu content */}
</div>
```

## Form Layouts

### Responsive Forms

```jsx
<form className="space-y-6 sm:space-y-8">
  {/* Two-column on tablet+ */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        First Name
      </label>
      <input
        type="text"
        className="
          w-full
          px-3 sm:px-4
          py-2 sm:py-3
          text-sm sm:text-base
          border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-black
        "
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Last Name
      </label>
      <input
        type="text"
        className="
          w-full
          px-3 sm:px-4
          py-2 sm:py-3
          text-sm sm:text-base
          border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-black
        "
      />
    </div>
  </div>

  {/* Full-width field */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Email Address
    </label>
    <input
      type="email"
      className="
        w-full
        px-3 sm:px-4
        py-2 sm:py-3
        text-sm sm:text-base
        border border-gray-300 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-black
      "
    />
  </div>

  {/* Responsive button */}
  <button
    type="submit"
    className="
      w-full sm:w-auto
      px-6 sm:px-8
      py-3
      bg-black text-white
      text-sm sm:text-base
      font-medium
      rounded-lg
      hover:bg-gray-800
      transition-colors
    "
  >
    Submit
  </button>
</form>
```

## Button Styles

### Everlane-Style Buttons

```jsx
// Primary Button
<button className="
  px-4 sm:px-6 lg:px-8
  py-2 sm:py-3
  bg-black text-white
  text-xs sm:text-sm
  font-medium tracking-wide uppercase
  hover:bg-gray-800
  transition-colors
  min-h-[44px]  /* Touch-friendly */
">
  Shop Now
</button>

// Secondary Button
<button className="
  px-4 sm:px-6 lg:px-8
  py-2 sm:py-3
  border-2 border-black
  text-black
  text-xs sm:text-sm
  font-medium tracking-wide uppercase
  hover:bg-black hover:text-white
  transition-colors
  min-h-[44px]
">
  Learn More
</button>

// Text Button
<button className="
  text-sm sm:text-base
  text-gray-700
  hover:text-black
  underline
  transition-colors
  py-2
">
  View Details
</button>
```

## Card Components

### Product Card

```jsx
<div className="group cursor-pointer">
  {/* Image */}
  <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 mb-3 sm:mb-4">
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      loading="lazy"
    />
  </div>

  {/* Content */}
  <div className="space-y-1 sm:space-y-2">
    <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">
      {product.name}
    </h3>
    <p className="text-xs sm:text-sm text-gray-600">
      {product.category}
    </p>
    <div className="flex items-center space-x-2">
      <span className="text-sm sm:text-base font-semibold text-gray-900">
        ₹{product.price}
      </span>
      {product.originalPrice && (
        <span className="text-xs sm:text-sm text-gray-500 line-through">
          ₹{product.originalPrice}
        </span>
      )}
    </div>
  </div>
</div>
```

## Performance Optimization

### 1. Image Optimization

```jsx
// Use appropriate sizes
<img
  src={product.image}
  srcSet={`
    ${product.image_small} 400w,
    ${product.image_medium} 800w,
    ${product.image_large} 1200w
  `}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt={product.name}
  loading="lazy"
/>
```

### 2. Lazy Loading

```jsx
// Images
<img src={url} loading="lazy" />

// Components (React.lazy)
const ProductDetail = React.lazy(() => import('./ProductDetail'));

<Suspense fallback={<LoadingSpinner />}>
  <ProductDetail />
</Suspense>
```

### 3. Minimize Re-renders

```jsx
// Memoize expensive components
const ProductCard = React.memo(({ product }) => {
  // Component code
});

// Memoize callbacks
const handleClick = useCallback(() => {
  // Handler code
}, [dependencies]);
```

## Accessibility

### Touch Targets

```jsx
// Minimum 44x44px for touch targets
<button className="
  min-w-[44px] min-h-[44px]
  p-2
  hover:bg-gray-100
  rounded-lg
  transition-colors
">
  <Icon className="w-5 h-5" />
</button>
```

### Focus States

```jsx
// Visible focus indicators
<button className="
  px-4 py-2
  bg-black text-white
  focus:outline-none
  focus:ring-2
  focus:ring-black
  focus:ring-offset-2
">
  Click Me
</button>
```

### ARIA Labels

```jsx
// Icon buttons need labels
<button
  aria-label="Open cart"
  className="p-2 hover:bg-gray-100 rounded-lg"
>
  <ShoppingBag className="w-5 h-5" />
</button>
```

## Testing Strategy

### 1. Responsive Breakpoints

Test at these exact widths:
- 320px (iPhone SE)
- 375px (iPhone 12/13)
- 390px (iPhone 14)
- 414px (iPhone Plus)
- 768px (iPad Portrait)
- 1024px (iPad Landscape)
- 1280px (Desktop)
- 1920px (Large Desktop)

### 2. Browser Testing

- Chrome (Desktop & Mobile)
- Safari (Desktop & iOS)
- Firefox (Desktop & Mobile)
- Edge (Desktop)

### 3. Device Testing

- iPhone (various models)
- Android phones (various sizes)
- iPad
- Android tablets

### 4. Orientation Testing

- Portrait mode
- Landscape mode

## Common Pitfalls to Avoid

### ❌ Don't Do This

```jsx
// Fixed widths
<div className="w-[1200px]">

// Desktop-first breakpoints
<div className="text-lg md:text-base sm:text-sm">

// Tiny touch targets
<button className="w-6 h-6">

// No responsive images
<img src={largeImage} />

// Horizontal scrolling
<div className="flex space-x-4 overflow-x-auto">
```

### ✅ Do This Instead

```jsx
// Flexible widths
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Mobile-first breakpoints
<div className="text-sm sm:text-base lg:text-lg">

// Touch-friendly targets
<button className="min-w-[44px] min-h-[44px] p-2">

// Responsive images
<img src={image} className="w-full h-auto" loading="lazy" />

// Proper grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

## Maintenance

### Regular Checks

- [ ] Test on new device releases
- [ ] Update breakpoints if needed
- [ ] Optimize images regularly
- [ ] Monitor performance metrics
- [ ] Check accessibility compliance
- [ ] Review analytics for device usage
- [ ] Update documentation

### Performance Monitoring

Use tools like:
- Lighthouse (Chrome DevTools)
- WebPageTest
- GTmetrix
- Google PageSpeed Insights

Target metrics:
- First Contentful Paint < 1.8s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- Time to Interactive < 3.8s

## Conclusion

Following these best practices will ensure your Everlane-style e-commerce site:
- Works beautifully on all devices
- Loads quickly
- Is accessible to all users
- Maintains the minimal luxury aesthetic
- Provides an excellent user experience

Remember: **Test early, test often, test on real devices.**
