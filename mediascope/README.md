# MediaScope - Drupal Media Theme

MediaScope is a modern, media-focused Drupal subtheme built on top of the Cerulean Bootstrap theme. It's specifically designed for online media sites, news portals, blogs, and content-heavy websites that need enhanced media handling, article presentation, and user engagement features.

## Features

### 🎨 Design & Layout
- **Modern Media-Focused Design**: Clean, contemporary layout optimized for media content
- **Responsive Grid System**: Flexible layouts that work perfectly on all devices
- **Article Cards**: Beautiful card-based layout for article listings
- **Hero Sections**: Eye-catching hero areas for featured content
- **Typography**: Custom font combinations (Playfair Display + Source Sans Pro)

### 📸 Media Enhancement
- **Advanced Gallery System**: Interactive photo galleries with lightbox support
- **Video Integration**: Seamless video embedding and playback
- **Lazy Loading**: Performance-optimized image and media loading
- **Responsive Images**: Automatic image optimization for different screen sizes
- **Media Lightbox**: Full-screen media viewing experience

### 📖 Reading Experience
- **Reading Progress Bar**: Visual progress indicator for articles
- **Estimated Reading Time**: Automatic reading time calculation
- **Table of Contents**: Auto-generated TOC for long articles
- **Social Sharing**: Built-in social media sharing buttons
- **Print Optimization**: Clean print styles for articles

### 🚀 Performance
- **Lazy Loading**: Images, videos, and iframes load on demand
- **Optimized CSS**: Modular SCSS architecture with Bootstrap customization
- **JavaScript Optimization**: Efficient, modern JavaScript with minimal dependencies
- **SEO-Friendly**: Built-in structured data and meta tag optimization

## Installation

1. **Download and Install**:
   - Place the `mediascope` folder in your Drupal themes directory (`/themes/custom/`)
   - Enable the theme in Appearance (`/admin/appearance`)

2. **Dependencies**:
   - Requires Cerulean theme (which requires Bootstrap5 theme)
   - Drupal 10.1+ or 11.0+

3. **Configuration**:
   - Configure theme settings at `/admin/appearance/settings/mediascope`
   - Set up media fields and content types as needed

## Theme Structure

```
mediascope/
├── config/
│   └── install/
│       └── mediascope.settings.yml
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
└── mediascope.theme
```

## Customization

### Colors
The theme uses a modern color palette that can be customized in `scss/_variables_drupal.scss`:

- **Primary**: #2c3e50 (Dark blue-gray)
- **Secondary**: #3498db (Bright blue)
- **Accent**: #e74c3c (Red)

### Typography
Three font families are used:
- **Headlines**: Playfair Display (serif)
- **Body**: Source Sans Pro (sans-serif)
- **UI Elements**: Inter (sans-serif)

### Layouts
The theme supports flexible layouts with configurable:
- Container max-width (default: 1200px)
- Article max-width (default: 800px)
- Grid gutter spacing (default: 30px)

## Content Types

### Article
The theme is optimized for article content with:
- Featured image support
- Category and tag taxonomy
- Author bio integration
- Related articles
- Social sharing
- Reading time estimation

### Media Gallery
Built-in support for:
- Photo galleries
- Video collections
- Mixed media presentations
- Slideshow mode
- Lightbox viewing

## JavaScript Features

### Core Functionality (`mediascope.js`)
- Reading progress tracking
- Smooth scrolling
- Search enhancements
- Image lightbox
- Responsive navigation

### Media Gallery (`media-gallery.js`)
- Interactive photo galleries
- Slideshow presentations
- Keyboard navigation
- Touch/swipe support
- Lazy loading integration

### Reading Progress (`reading-progress.js`)
- Visual progress indicator
- Social sharing buttons
- Estimated reading time
- Floating share buttons

### Lazy Loading (`lazy-loading.js`)
- Images, videos, and iframes
- Intersection Observer API
- Fallback for older browsers
- Performance monitoring

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### SCSS Compilation
To compile SCSS files:
```bash
# Install dependencies
npm install -g sass

# Compile SCSS
sass scss/style.scss css/style.css --watch
```

### JavaScript Development
All JavaScript is written in ES6+ and is compatible with modern browsers. For older browser support, consider using Babel for transpilation.

## Configuration Options

Theme settings available at `/admin/appearance/settings/mediascope`:

- **Layout Options**: Container width, sidebar widths, fluid container
- **Media Settings**: Gallery columns, image styles, lazy loading
- **Typography**: Font selections, sizes, line heights
- **Colors**: Brand colors, accent colors
- **Performance**: CSS/JS minification, image optimization
- **SEO**: Structured data, Open Graph, Twitter Cards

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This theme is licensed under the GNU General Public License v2.0 or later.

## Support

For support, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## Changelog

### Version 1.0.0
- Initial release
- Full media gallery system
- Reading progress tracking
- Social sharing integration
- Responsive design
- Performance optimizations

---

Built with ❤️ for the Drupal community.
