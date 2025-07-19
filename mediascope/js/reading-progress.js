/**
 * Reading Progress and Social Sharing for MediaScope
 */

(function ($, Drupal) {
  'use strict';

  /**
   * Reading Progress Behavior
   */
  Drupal.behaviors.readingProgress = {
    attach: function (context, settings) {
      // Initialize only on article pages
      if (!document.querySelector('.has-reading-progress')) {
        return;
      }

      const progressBar = document.querySelector('.reading-progress-bar');
      if (!progressBar) {
        return;
      }

      // Update progress on scroll
      const updateProgress = () => {
        const article = document.querySelector('.article-content');
        if (!article) return;

        const scrollTop = window.pageYOffset;
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calculate progress based on article reading position
        const start = articleTop - windowHeight / 2;
        const end = articleTop + articleHeight - windowHeight / 2;
        const progress = Math.max(0, Math.min(100, ((scrollTop - start) / (end - start)) * 100));

        progressBar.style.width = progress + '%';
        
        // Update reading progress indicator
        const progressIndicator = document.querySelector('.reading-progress-indicator');
        if (progressIndicator) {
          progressIndicator.textContent = Math.round(progress) + '%';
        }
      };

      // Throttled scroll handler
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

      // Add estimated reading time
      addEstimatedReadingTime();
    }
  };

  /**
   * Social Sharing Behavior
   */
  Drupal.behaviors.socialSharing = {
    attach: function (context, settings) {
      // Initialize social sharing buttons
      $('.social-sharing .share-button', context).once('social-sharing').each(function() {
        const button = $(this);
        const platform = button.data('platform') || button.attr('class').match(/\b(facebook|twitter|linkedin|pinterest|email)\b/)?.[1];
        
        if (platform) {
          button.on('click', function(e) {
            e.preventDefault();
            shareContent(platform, button);
          });
        }
      });

      // Add copy link functionality
      $('.copy-link-button', context).once('copy-link').on('click', function(e) {
        e.preventDefault();
        copyToClipboard(window.location.href);
        showNotification('Link copied to clipboard!', 'success');
      });

      // Initialize floating share buttons
      initFloatingShareButtons();
    }
  };

  /**
   * Add estimated reading time to article
   */
  function addEstimatedReadingTime() {
    const article = document.querySelector('.article-content');
    if (!article) return;

    const text = article.textContent || article.innerText;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

    // Find or create reading time element
    let readingTimeElement = document.querySelector('.reading-time');
    if (!readingTimeElement) {
      readingTimeElement = document.createElement('span');
      readingTimeElement.className = 'reading-time';
      
      // Try to insert in article meta
      const articleMeta = document.querySelector('.article-meta');
      if (articleMeta) {
        const metaItem = document.createElement('div');
        metaItem.className = 'meta-item';
        metaItem.appendChild(readingTimeElement);
        articleMeta.appendChild(metaItem);
      }
    }

    readingTimeElement.textContent = readingTime + ' min read';
  }

  /**
   * Share content on social platforms
   */
  function shareContent(platform, button) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const description = encodeURIComponent(getMetaDescription());
    
    let shareUrl = '';
    const width = 600;
    const height = 400;
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'pinterest':
        const image = encodeURIComponent(getFeaturedImage());
        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${image}&description=${title}`;
        break;
      case 'reddit':
        shareUrl = `https://reddit.com/submit?url=${url}&title=${title}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=${description}%0A%0A${url}`;
        window.location.href = shareUrl;
        return;
    }

    if (shareUrl) {
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      
      window.open(shareUrl, 'share', `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`);
    }

    // Track sharing event
    trackSocialShare(platform);
  }

  /**
   * Initialize floating share buttons
   */
  function initFloatingShareButtons() {
    const article = document.querySelector('.article-content');
    if (!article) return;

    const floatingShare = document.createElement('div');
    floatingShare.className = 'floating-share-buttons';
    floatingShare.innerHTML = `
      <button class="floating-share-btn facebook" data-platform="facebook" title="Share on Facebook">
        <i class="fab fa-facebook-f"></i>
      </button>
      <button class="floating-share-btn twitter" data-platform="twitter" title="Share on Twitter">
        <i class="fab fa-twitter"></i>
      </button>
      <button class="floating-share-btn linkedin" data-platform="linkedin" title="Share on LinkedIn">
        <i class="fab fa-linkedin-in"></i>
      </button>
      <button class="floating-share-btn copy-link" title="Copy Link">
        <i class="fas fa-link"></i>
      </button>
    `;

    document.body.appendChild(floatingShare);

    // Show/hide based on scroll position
    const toggleFloatingButtons = () => {
      const scrollTop = window.pageYOffset;
      const articleTop = article.offsetTop;
      const articleBottom = articleTop + article.offsetHeight;
      
      const shouldShow = scrollTop > articleTop && scrollTop < articleBottom;
      floatingShare.classList.toggle('visible', shouldShow);
    };

    window.addEventListener('scroll', throttle(toggleFloatingButtons, 100));

    // Bind click events
    floatingShare.querySelectorAll('.floating-share-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (this.classList.contains('copy-link')) {
          copyToClipboard(window.location.href);
          showNotification('Link copied to clipboard!', 'success');
        } else {
          const platform = this.dataset.platform;
          shareContent(platform, $(this));
        }
      });
    });
  }

  /**
   * Get meta description
   */
  function getMetaDescription() {
    const metaDesc = document.querySelector('meta[name="description"]');
    return metaDesc ? metaDesc.getAttribute('content') : '';
  }

  /**
   * Get featured image URL
   */
  function getFeaturedImage() {
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      return ogImage.getAttribute('content');
    }
    
    const featuredImg = document.querySelector('.article-featured-image img');
    if (featuredImg) {
      return featuredImg.src;
    }
    
    return '';
  }

  /**
   * Copy text to clipboard
   */
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  /**
   * Show notification
   */
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      hideNotification(notification);
    });

    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideNotification(notification);
    }, 5000);
  }

  /**
   * Hide notification
   */
  function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  /**
   * Track social sharing
   */
  function trackSocialShare(platform) {
    // Integration with analytics (Google Analytics, etc.)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'share', {
        method: platform,
        content_type: 'article',
        content_id: window.location.pathname
      });
    }
    
    // Custom tracking can be added here
    console.log(`Content shared on ${platform}`);
  }

  /**
   * Throttle function
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
