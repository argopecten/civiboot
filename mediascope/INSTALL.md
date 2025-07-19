# MediaScope Theme - Installation & Setup Guide

## Quick Start

1. **Place the theme** in your Drupal themes directory:
   ```
   /themes/custom/mediascope/
   ```

2. **Enable the theme** at `/admin/appearance`

3. **Configure theme settings** at `/admin/appearance/settings/mediascope`

## Recommended Content Types

### Article Content Type
Create or modify your article content type to include:

- **Title** (required)
- **Body** (required) 
- **Featured Image** (`field_image`)
- **Category** (`field_category`) - Taxonomy term reference
- **Tags** (`field_tags`) - Taxonomy term reference
- **Author Bio** (`field_author_bio`) - Long text
- **Related Articles** (`field_related_articles`) - Entity reference to nodes

### Media Gallery Content Type
For enhanced media galleries:

- **Title** (required)
- **Description** (`field_description`)
- **Gallery Images** (`field_gallery_images`) - Media reference, multiple values
- **Gallery Type** (`field_gallery_type`) - List field (grid, slideshow, masonry)

## Theme Configuration

### Basic Settings
- **Logo Upload**: Upload your site logo
- **Favicon**: Upload your site favicon  
- **Color Scheme**: Customize primary, secondary, and accent colors

### Layout Settings
- **Container Width**: Default 1200px
- **Article Width**: Default 800px
- **Sidebar Widths**: Configure sidebar column widths
- **Grid Gutter**: Spacing between grid items

### Media Settings
- **Gallery Columns**: Number of columns for image galleries
- **Image Styles**: Configure image styles for different contexts
- **Lazy Loading**: Enable/disable lazy loading
- **Lightbox**: Enable/disable lightbox functionality

### Typography
- **Headings Font**: Default Playfair Display
- **Body Font**: Default Source Sans Pro
- **UI Font**: Default Inter
- **Font Sizes**: Customize base font sizes

## SCSS Compilation

If you plan to modify styles:

1. **Install Sass**:
   ```bash
   npm install -g sass
   ```

2. **Compile SCSS**:
   ```bash
   sass scss/style.scss css/style.css --watch
   ```

3. **Clear Drupal cache** after CSS changes:
   ```bash
   drush cr
   ```

## Performance Optimization

### Image Optimization
- Use responsive image styles
- Enable lazy loading
- Compress images before upload
- Use appropriate image formats (WebP when possible)

### JavaScript Optimization  
- Enable JS aggregation in Drupal
- Use the minified versions in production
- Consider using a CDN for external libraries

### CSS Optimization
- Enable CSS aggregation in Drupal
- Use the compiled CSS files
- Remove unused CSS with tools like PurgeCSS

## SEO Configuration

### Structured Data
The theme automatically adds Schema.org markup for articles. Configure:
- Site name
- Logo URL
- Author information
- Publishing dates

### Open Graph
Add Open Graph meta tags for better social sharing:
- og:title
- og:description  
- og:image
- og:type

### Twitter Cards
Configure Twitter Card meta tags:
- twitter:card
- twitter:title
- twitter:description
- twitter:image

## Content Strategy

### Articles
- Use compelling headlines
- Include featured images
- Write engaging excerpts
- Add relevant categories and tags
- Include author information

### Media Galleries
- Optimize images for web
- Use descriptive alt text
- Group related images
- Consider gallery layout types

### Navigation
- Keep menu structure simple
- Use descriptive menu labels
- Include search functionality
- Add social media links

## Troubleshooting

### Common Issues

**Images not loading**:
- Check file permissions
- Verify image field configuration
- Clear image style cache

**JavaScript errors**:
- Check browser console
- Verify jQuery is loaded
- Check for conflicting scripts

**Styling issues**:
- Clear Drupal cache
- Check CSS compilation
- Verify Bootstrap dependencies

**Performance issues**:
- Enable caching
- Optimize images
- Use CDN for assets

### Debug Mode
Enable debug mode for development:
```php
$settings['cache']['bins']['render'] = 'cache.backend.null';
$settings['cache']['bins']['dynamic_page_cache'] = 'cache.backend.null';
```

## Maintenance

### Regular Updates
- Update Drupal core
- Update contrib modules
- Update theme dependencies
- Test functionality after updates

### Backup
- Backup theme files
- Backup database
- Backup uploaded media
- Document customizations

### Monitoring
- Check site performance
- Monitor error logs
- Test on different devices
- Validate markup

## Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create detailed bug reports
4. Include environment information

---

Happy theming! 🎨
