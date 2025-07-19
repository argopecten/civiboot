/**
 * Lazy Loading Implementation for MediaScope
 */

(function ($, Drupal) {
  'use strict';

  /**
   * Lazy Loading Behavior
   */
  Drupal.behaviors.lazyLoading = {
    attach: function (context, settings) {
      // Initialize lazy loading for images
      initImageLazyLoading(context);
      
      // Initialize lazy loading for videos
      initVideoLazyLoading(context);
      
      // Initialize lazy loading for iframes
      initIframeLazyLoading(context);
    }
  };

  /**
   * Initialize lazy loading for images
   */
  function initImageLazyLoading(context) {
    const images = context.querySelectorAll('img[data-src]:not(.lazy-loaded)');
    
    if (!images.length) return;

    // Use Intersection Observer if available
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      images.forEach(img => {
        imageObserver.observe(img);
        addLoadingPlaceholder(img);
      });
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        loadImage(img);
      });
    }
  }

  /**
   * Initialize lazy loading for videos
   */
  function initVideoLazyLoading(context) {
    const videos = context.querySelectorAll('video[data-src]:not(.lazy-loaded)');
    
    if (!videos.length) return;

    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const video = entry.target;
            loadVideo(video);
            observer.unobserve(video);
          }
        });
      }, {
        rootMargin: '100px 0px',
        threshold: 0.01
      });

      videos.forEach(video => {
        videoObserver.observe(video);
        addLoadingPlaceholder(video);
      });
    } else {
      videos.forEach(video => {
        loadVideo(video);
      });
    }
  }

  /**
   * Initialize lazy loading for iframes
   */
  function initIframeLazyLoading(context) {
    const iframes = context.querySelectorAll('iframe[data-src]:not(.lazy-loaded)');
    
    if (!iframes.length) return;

    if ('IntersectionObserver' in window) {
      const iframeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const iframe = entry.target;
            loadIframe(iframe);
            observer.unobserve(iframe);
          }
        });
      }, {
        rootMargin: '200px 0px',
        threshold: 0.01
      });

      iframes.forEach(iframe => {
        iframeObserver.observe(iframe);
        addLoadingPlaceholder(iframe);
      });
    } else {
      iframes.forEach(iframe => {
        loadIframe(iframe);
      });
    }
  }

  /**
   * Load image with lazy loading
   */
  function loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    
    if (!src) return;

    // Create a new image to preload
    const imageLoader = new Image();
    
    imageLoader.onload = function() {
      // Image loaded successfully
      img.src = src;
      
      if (srcset) {
        img.srcset = srcset;
      }
      
      img.classList.add('lazy-loaded');
      img.classList.remove('lazy-loading');
      
      // Remove data attributes
      img.removeAttribute('data-src');
      img.removeAttribute('data-srcset');
      
      // Trigger custom event
      const event = new CustomEvent('lazyloaded', {
        detail: { element: img }
      });
      img.dispatchEvent(event);
    };
    
    imageLoader.onerror = function() {
      // Handle error
      img.classList.add('lazy-error');
      img.classList.remove('lazy-loading');
      
      // Show fallback image or placeholder
      const fallback = img.dataset.fallback || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMzIuNTU0IDk3LjAzMTVMMTIyLjMzNSA4Mi4zMTI1QzEyMS4xNjYgODAuNzAzMSAxMTkuMzMzIDc5LjgxMjUgMTE3LjMzNSA3OS44MTI1QzExNS4zMzYgNzkuODEyNSAxMTMuNTAzIDgwLjcwMzEgMTEyLjMzNSA4Mi4zMTI1TDkwLjY2NDcgMTA5LjY4OEw3OC42NjQ3IDk0LjY4NzVDNzcuNTMxIDkzLjIxODggNzUuNzQ2IDkyLjM0MzcgNzMuODA5NCA5Mi4zNDM3QzcxLjg3MjggOTIuMzQzNyA3MC4wODc5IDkzLjIxODggNjguOTU0MSA5NC42ODc1TDQ5LjMzNTMgMTIwLjMxMkM0OC4zMzYgMTIxLjY0MSA0Ny44NzUgMTIzLjMyIDQ4LjA1IDEyNUM0OC4yMjUgMTI2LjY4IDQ5LjAzNDIgMTI4LjIzNSA1MC4zMzUzIDEyOS4yNThDNTEuNjM2NSAxMzAuMjgxIDUzLjMyNjEgMTMwLjY4NyA1NC45NzIgMTMwLjI4MUM1Ni42MTc5IDEyOS44NzUgNTcuOTc5OCAxMjguNzUgNTguNzIyIDEyNy4yNTlMNzMuODA5NCAxMDcuMzEyTDg1LjgwOTQgMTIyLjMxMkM4Ni45NDMxIDEyMy43ODEgODguNzI3OSAxMjQuNjU2IDkwLjY2NDcgMTI0LjY1NkM5Mi42MDE1IDEyNC42NTYgOTQuMzg2MyAxMjMuNzgxIDk1LjUyIDEyMi4zMTJMMTE3LjMzNSA5NC42ODc1TDEyNy41NTQgMTA5LjQwNkMxMjguNzE5IDExMC45OTkgMTMwLjUzNiAxMTEuODc1IDEzMi41MTQgMTExLjg3NUMxMzQuNDkzIDExMS44NzUgMTM2LjMxIDExMC45OTkgMTM3LjQ3NSAxMDkuNDA2TDE2NC44MDkgNzQuNTYyNUMxNjUuNzkzIDczLjIyMDMgMTY2LjI0IDcxLjUzNDQgMTY2LjA1MiA2OS44NDM4QzE2NS44NjMgNjguMTUzMSAxNjUuMDUgNjYuNjA5MyAxNjMuNzU5IDY1LjU5MzhDMTYyLjQ2OCA2NC41NzgxIDE2MC43OTQgNjQuMTc3IDE1OS4xNTkgNjQuNTc4MUMxNTcuNTI0IDY0Ljk3OTMgMTU2LjE2NiA2Ni4wOTE5IDE1NS40MzEgNjcuNTYyNUwxMzIuNTU0IDk3LjAzMTVaTTEzMi41NTQgOTcuMDMxNSIgZmlsbD0iIzlBQTZBOCIvPgo8L3N2Zz4K';
      img.src = fallback;
    };
    
    // Start loading
    imageLoader.src = src;
  }

  /**
   * Load video with lazy loading
   */
  function loadVideo(video) {
    const src = video.dataset.src;
    const poster = video.dataset.poster;
    
    if (!src) return;

    video.src = src;
    
    if (poster) {
      video.poster = poster;
      video.removeAttribute('data-poster');
    }
    
    video.classList.add('lazy-loaded');
    video.classList.remove('lazy-loading');
    
    // Remove data attributes
    video.removeAttribute('data-src');
    
    // Trigger custom event
    const event = new CustomEvent('lazyloaded', {
      detail: { element: video }
    });
    video.dispatchEvent(event);
  }

  /**
   * Load iframe with lazy loading
   */
  function loadIframe(iframe) {
    const src = iframe.dataset.src;
    
    if (!src) return;

    iframe.src = src;
    iframe.classList.add('lazy-loaded');
    iframe.classList.remove('lazy-loading');
    
    // Remove data attributes
    iframe.removeAttribute('data-src');
    
    // Trigger custom event
    const event = new CustomEvent('lazyloaded', {
      detail: { element: iframe }
    });
    iframe.dispatchEvent(event);
  }

  /**
   * Add loading placeholder
   */
  function addLoadingPlaceholder(element) {
    element.classList.add('lazy-loading');
    
    // Add loading animation
    const placeholder = document.createElement('div');
    placeholder.className = 'lazy-placeholder';
    placeholder.innerHTML = `
      <div class="lazy-spinner"></div>
      <div class="lazy-text">Loading...</div>
    `;
    
    // Position placeholder
    element.style.position = 'relative';
    element.parentNode.insertBefore(placeholder, element);
    
    // Remove placeholder when content loads
    element.addEventListener('lazyloaded', function() {
      if (placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
      }
    });
  }

  /**
   * Preload critical images
   */
  function preloadCriticalImages() {
    const criticalImages = document.querySelectorAll('img[data-critical]');
    
    criticalImages.forEach(img => {
      const src = img.dataset.src;
      if (src) {
        const preloader = new Image();
        preloader.onload = function() {
          img.src = src;
          img.classList.add('lazy-loaded');
          img.removeAttribute('data-src');
          img.removeAttribute('data-critical');
        };
        preloader.src = src;
      }
    });
  }

  /**
   * Handle responsive images
   */
  function handleResponsiveImages() {
    const responsiveImages = document.querySelectorAll('img[data-sizes]');
    
    responsiveImages.forEach(img => {
      const sizes = img.dataset.sizes;
      const srcset = img.dataset.srcset;
      
      if (sizes && srcset) {
        img.sizes = sizes;
        img.srcset = srcset;
        img.removeAttribute('data-sizes');
        img.removeAttribute('data-srcset');
      }
    });
  }

  /**
   * Initialize on DOM ready
   */
  document.addEventListener('DOMContentLoaded', function() {
    preloadCriticalImages();
    handleResponsiveImages();
  });

  /**
   * Retry failed lazy loads
   */
  function retryFailedLoads() {
    const failedImages = document.querySelectorAll('.lazy-error');
    
    failedImages.forEach(img => {
      img.classList.remove('lazy-error');
      img.classList.add('lazy-loading');
      
      setTimeout(() => {
        loadImage(img);
      }, 1000);
    });
  }

  // Add global retry function
  window.retryLazyLoads = retryFailedLoads;

  /**
   * Performance monitoring
   */
  function monitorLazyLoadingPerformance() {
    let loadedImages = 0;
    let totalImages = 0;

    document.addEventListener('lazyloaded', function(e) {
      loadedImages++;
      
      // Log performance metrics
      if (window.performance && window.performance.timing) {
        const loadTime = performance.now();
        console.log(`Lazy loaded image ${loadedImages}/${totalImages} at ${loadTime}ms`);
      }
    });

    // Count total lazy images
    const observer = new MutationObserver(function() {
      totalImages = document.querySelectorAll('img[data-src], video[data-src], iframe[data-src]').length;
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Initialize performance monitoring in development
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('dev')) {
    monitorLazyLoadingPerformance();
  }

})(jQuery, Drupal);
