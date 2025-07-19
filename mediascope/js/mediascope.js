/**
 * MediaScope Main JavaScript
 * Core functionality for the MediaScope theme
 */

(function ($, Drupal) {
  'use strict';

  /**
   * Initialize MediaScope theme functionality
   */
  Drupal.behaviors.mediascope = {
    attach: function (context, settings) {
      // Initialize only once
      if (context !== document) {
        return;
      }

      // Initialize reading progress bar
      initReadingProgress();
      
      // Initialize smooth scrolling
      initSmoothScrolling();
      
      // Initialize search enhancements
      initSearchEnhancements();
      
      // Initialize article enhancements
      initArticleEnhancements();
      
      // Initialize responsive navigation
      initResponsiveNavigation();
    }
  };

  /**
   * Reading progress bar functionality
   */
  function initReadingProgress() {
    if (!document.querySelector('.has-reading-progress')) {
      return;
    }

    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    document.body.appendChild(progressBar);

    // Update progress on scroll
    const updateProgress = () => {
      const article = document.querySelector('.article-content');
      if (!article) return;

      const scrollTop = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / documentHeight) * 100;

      progressBar.style.width = Math.min(progress, 100) + '%';
    };

    // Throttled scroll listener
    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler);
    updateProgress(); // Initial update
  }

  /**
   * Smooth scrolling for anchor links
   */
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Search form enhancements
   */
  function initSearchEnhancements() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
      // Add search suggestions (placeholder for future implementation)
      searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        if (query.length >= 3) {
          // Placeholder for search suggestions
          console.log('Search query:', query);
        }
      });

      // Enhanced search form submission
      searchForm?.addEventListener('submit', function(e) {
        const query = searchInput.value.trim();
        if (query.length < 2) {
          e.preventDefault();
          searchInput.focus();
          showNotification('Please enter at least 2 characters to search.', 'warning');
        }
      });
    }
  }

  /**
   * Article-specific enhancements
   */
  function initArticleEnhancements() {
    // Add reading time to articles
    const articleContent = document.querySelector('.article-content');
    if (articleContent) {
      const readingTime = calculateReadingTime(articleContent);
      const readingTimeElement = document.querySelector('.reading-time');
      
      if (readingTimeElement && readingTime) {
        readingTimeElement.textContent = readingTime + ' min read';
      }
    }

    // Enhanced image handling
    const contentImages = document.querySelectorAll('.article-content img');
    contentImages.forEach(img => {
      // Add loading placeholder
      img.classList.add('lazy-loading');
      
      // Remove placeholder when loaded
      img.addEventListener('load', function() {
        this.classList.remove('lazy-loading');
      });

      // Add click-to-zoom functionality
      img.addEventListener('click', function() {
        openLightbox(this);
      });
    });

    // Table of contents generation
    generateTableOfContents();
  }

  /**
   * Calculate reading time based on content
   */
  function calculateReadingTime(content) {
    const text = content.textContent || content.innerText;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
    return readingTime;
  }

  /**
   * Generate table of contents for articles
   */
  function generateTableOfContents() {
    const headings = document.querySelectorAll('.article-content h2, .article-content h3');
    if (headings.length < 3) return;

    const tocContainer = document.createElement('div');
    tocContainer.className = 'table-of-contents';
    tocContainer.innerHTML = '<h3>Table of Contents</h3>';

    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';

    headings.forEach((heading, index) => {
      // Add ID if not present
      if (!heading.id) {
        heading.id = 'heading-' + index;
      }

      const listItem = document.createElement('li');
      listItem.className = 'toc-item toc-' + heading.tagName.toLowerCase();
      
      const link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent;
      link.className = 'toc-link';
      
      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });

    tocContainer.appendChild(tocList);

    // Insert TOC after the first paragraph
    const firstParagraph = document.querySelector('.article-content p');
    if (firstParagraph) {
      firstParagraph.parentNode.insertBefore(tocContainer, firstParagraph.nextSibling);
    }
  }

  /**
   * Responsive navigation
   */
  function initResponsiveNavigation() {
    const navToggle = document.querySelector('.navbar-toggler');
    const navCollapse = document.querySelector('.navbar-collapse');
    
    if (navToggle && navCollapse) {
      navToggle.addEventListener('click', function() {
        navCollapse.classList.toggle('show');
        this.setAttribute('aria-expanded', 
          navCollapse.classList.contains('show') ? 'true' : 'false'
        );
      });

      // Close menu when clicking outside
      document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navCollapse.contains(e.target)) {
          navCollapse.classList.remove('show');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  /**
   * Lightbox functionality
   */
  function openLightbox(img) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close">&times;</button>
        <img src="${img.src}" alt="${img.alt || ''}" />
      </div>
    `;

    document.body.appendChild(lightbox);
    
    // Animate in
    requestAnimationFrame(() => {
      lightbox.classList.add('active');
    });

    // Close handlers
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', () => closeLightbox(lightbox));
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox(lightbox);
      }
    });

    // Keyboard handling
    const keyHandler = (e) => {
      if (e.key === 'Escape') {
        closeLightbox(lightbox);
      }
    };
    document.addEventListener('keydown', keyHandler);
    
    // Store handler for cleanup
    lightbox._keyHandler = keyHandler;
  }

  /**
   * Close lightbox
   */
  function closeLightbox(lightbox) {
    lightbox.classList.remove('active');
    
    // Remove event listener
    if (lightbox._keyHandler) {
      document.removeEventListener('keydown', lightbox._keyHandler);
    }
    
    // Remove element after animation
    setTimeout(() => {
      if (lightbox.parentNode) {
        lightbox.parentNode.removeChild(lightbox);
      }
    }, 300);
  }

  /**
   * Show notification
   */
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  /**
   * Utility function to debounce events
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Utility function to throttle events
   */
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

})(jQuery, Drupal);
