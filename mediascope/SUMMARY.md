# MediaScope - Drupal Subtheme

## Overview
MediaScope is a comprehensive Drupal subtheme built on top of the Cerulean theme, specifically designed for online media sites, news portals, and content-heavy websites. It provides enhanced media handling, beautiful article layouts, and modern user interface elements.

## Features Created

### 🎨 **Theme Structure**
- **Complete theme configuration** (`mediascope.info.yml`)
- **Library definitions** (`mediascope.libraries.yml`) 
- **Responsive breakpoints** (`mediascope.breakpoints.yml`)
- **Theme functions** (`mediascope.theme`) with hooks for media functionality

### 📐 **SCSS Architecture**
- **Variables system** with Drupal and Bootstrap customizations
- **Modular SCSS** with separate files for different components
- **Main stylesheet** (`style.scss`) with comprehensive media-focused styles
- **Custom color palette** optimized for media sites

### 🎭 **Templates**
- **Article template** (`node--article.html.twig`) with structured data
- **Article teaser** (`node--article--teaser.html.twig`) for listings
- **Page template** (`page.html.twig`) with enhanced regions
- **Responsive layouts** with flexible sidebar configurations

### 🌟 **CSS Components**
- **Article cards** with hover effects and category badges
- **Hero sections** for featured content
- **Media galleries** with grid and masonry layouts
- **Reading progress bar** with smooth animations
- **Social sharing buttons** with platform-specific styling
- **Typography enhancements** with custom font loading

### ⚡ **JavaScript Features**
- **Core functionality** (`mediascope.js`) with modern ES6+ code
- **Media gallery system** (`media-gallery.js`) with lightbox and slideshow
- **Reading progress tracking** (`reading-progress.js`) with social sharing
- **Lazy loading** (`lazy-loading.js`) for performance optimization
- **Responsive navigation** with mobile-friendly interactions

### 🔧 **Configuration**
- **Theme settings** (`mediascope.settings.yml`) with media-specific options
- **Flexible layouts** with configurable widths and spacing
- **Performance optimizations** with lazy loading and efficient loading
- **SEO enhancements** with structured data and meta tags

## Technical Implementation

### **Parent Theme Integration**
- Extends Cerulean theme (which extends Bootstrap5)
- Overrides parent styling while maintaining compatibility
- Inherits Bootstrap components and enhances them

### **Media Enhancements**
- Advanced image gallery with multiple display modes
- Video integration with responsive containers
- Lazy loading for improved performance
- Lightbox functionality for full-screen viewing

### **Article Experience**
- Reading progress indicator
- Estimated reading time calculation
- Social sharing integration
- Table of contents auto-generation
- Print-optimized layouts

### **Performance Features**
- Intersection Observer for lazy loading
- Throttled scroll events
- Efficient CSS with minimal redundancy
- Optimized JavaScript with modern practices

## File Structure Created

```
mediascope/
├── config/install/
│   └── mediascope.settings.yml
├── css/
│   ├── style.css
│   ├── ck5style.css
│   ├── media-layout.css
│   └── gallery.css
├── js/
│   ├── mediascope.js
│   ├── media-gallery.js
│   ├── reading-progress.js
│   └── lazy-loading.js
├── scss/
│   ├── style.scss
│   ├── _variables_drupal.scss
│   └── _variables_bootstrap.scss
├── templates/
│   ├── page.html.twig
│   ├── node--article.html.twig
│   └── node--article--teaser.html.twig
├── mediascope.info.yml
├── mediascope.libraries.yml
├── mediascope.breakpoints.yml
├── mediascope.theme
├── logo.svg
├── README.md
└── INSTALL.md
```

## Usage Instructions

### **Installation**
1. Place the `mediascope` folder in `/themes/custom/`
2. Enable the theme at `/admin/appearance`
3. Configure settings at `/admin/appearance/settings/mediascope`

### **Content Setup**
- Create article content type with image fields
- Set up media gallery content type
- Configure taxonomy for categories and tags
- Add author bio and related article fields

### **Customization**
- Modify SCSS variables for colors and spacing
- Compile SCSS to CSS using Sass
- Customize templates for specific needs
- Add custom JavaScript for additional functionality

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

## Dependencies
- Drupal 10.1+ or 11.0+
- Cerulean theme
- Bootstrap5 theme
- Modern browser with ES6+ support

This theme provides a solid foundation for any media-focused Drupal website with modern design, enhanced functionality, and excellent performance characteristics.

---

**Built for the modern web** 🚀
