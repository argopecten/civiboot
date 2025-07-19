/**
 * Media Gallery JavaScript for MediaScope theme
 * Enhanced gallery functionality with slideshow and lightbox
 */

(function ($, Drupal) {
  'use strict';

  /**
   * Media Gallery behavior
   */
  Drupal.behaviors.mediaGallery = {
    attach: function (context, settings) {
      // Initialize photo galleries
      $('.photo-gallery', context).once('media-gallery').each(function() {
        new PhotoGallery(this);
      });

      // Initialize slideshow galleries
      $('.gallery-slideshow', context).once('gallery-slideshow').each(function() {
        new GallerySlideshow(this);
      });

      // Initialize video galleries
      $('.video-gallery', context).once('video-gallery').each(function() {
        new VideoGallery(this);
      });
    }
  };

  /**
   * Photo Gallery Class
   */
  class PhotoGallery {
    constructor(container) {
      this.container = container;
      this.items = container.querySelectorAll('.photo-gallery-item');
      this.currentIndex = 0;
      this.lightbox = null;
      
      this.init();
    }

    init() {
      this.bindEvents();
      this.setupLazyLoading();
      this.setupKeyboardNavigation();
    }

    bindEvents() {
      // Gallery item click handlers
      this.items.forEach((item, index) => {
        item.addEventListener('click', () => {
          this.openLightbox(index);
        });
      });

      // Filter controls
      const filterButtons = this.container.parentElement.querySelectorAll('.gallery-filter');
      filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.filterGallery(button.dataset.filter);
        });
      });
    }

    setupLazyLoading() {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const src = img.dataset.src;
              if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                img.classList.remove('lazy-loading');
                observer.unobserve(img);
              }
            }
          });
        });

        this.items.forEach(item => {
          const img = item.querySelector('img[data-src]');
          if (img) {
            img.classList.add('lazy-loading');
            observer.observe(img);
          }
        });
      }
    }

    setupKeyboardNavigation() {
      document.addEventListener('keydown', (e) => {
        if (this.lightbox && this.lightbox.classList.contains('active')) {
          switch(e.key) {
            case 'ArrowLeft':
              e.preventDefault();
              this.previousImage();
              break;
            case 'ArrowRight':
              e.preventDefault();
              this.nextImage();
              break;
            case 'Escape':
              e.preventDefault();
              this.closeLightbox();
              break;
          }
        }
      });
    }

    filterGallery(filter) {
      this.items.forEach(item => {
        const categories = item.dataset.categories?.split(',') || [];
        const shouldShow = filter === 'all' || categories.includes(filter);
        
        item.style.display = shouldShow ? 'block' : 'none';
      });

      // Update active filter button
      const filterButtons = this.container.parentElement.querySelectorAll('.gallery-filter');
      filterButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.filter === filter);
      });
    }

    openLightbox(index) {
      this.currentIndex = index;
      this.createLightbox();
      this.showCurrentImage();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    createLightbox() {
      if (this.lightbox) {
        this.lightbox.remove();
      }

      this.lightbox = document.createElement('div');
      this.lightbox.className = 'lightbox-overlay';
      this.lightbox.innerHTML = `
        <div class="lightbox-content">
          <button class="lightbox-close" aria-label="Close">&times;</button>
          <button class="lightbox-prev" aria-label="Previous">‹</button>
          <button class="lightbox-next" aria-label="Next">›</button>
          <div class="lightbox-image-container">
            <img class="lightbox-image" src="" alt="" />
          </div>
          <div class="lightbox-info">
            <h3 class="lightbox-title"></h3>
            <p class="lightbox-description"></p>
            <div class="lightbox-counter">
              <span class="current-index"></span> / <span class="total-images"></span>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(this.lightbox);

      // Bind lightbox events
      this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
        this.closeLightbox();
      });

      this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
        this.previousImage();
      });

      this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
        this.nextImage();
      });

      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) {
          this.closeLightbox();
        }
      });

      // Animate in
      requestAnimationFrame(() => {
        this.lightbox.classList.add('active');
      });
    }

    showCurrentImage() {
      const currentItem = this.items[this.currentIndex];
      const img = currentItem.querySelector('img');
      const title = currentItem.querySelector('.overlay-title')?.textContent || '';
      const description = currentItem.querySelector('.overlay-caption')?.textContent || '';

      // Update lightbox content
      const lightboxImg = this.lightbox.querySelector('.lightbox-image');
      const lightboxTitle = this.lightbox.querySelector('.lightbox-title');
      const lightboxDescription = this.lightbox.querySelector('.lightbox-description');
      const currentIndexSpan = this.lightbox.querySelector('.current-index');
      const totalImagesSpan = this.lightbox.querySelector('.total-images');

      lightboxImg.src = img.dataset.fullsize || img.src;
      lightboxImg.alt = img.alt;
      lightboxTitle.textContent = title;
      lightboxDescription.textContent = description;
      currentIndexSpan.textContent = this.currentIndex + 1;
      totalImagesSpan.textContent = this.items.length;

      // Update navigation buttons
      const prevBtn = this.lightbox.querySelector('.lightbox-prev');
      const nextBtn = this.lightbox.querySelector('.lightbox-next');
      
      prevBtn.style.display = this.currentIndex === 0 ? 'none' : 'block';
      nextBtn.style.display = this.currentIndex === this.items.length - 1 ? 'none' : 'block';
    }

    previousImage() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.showCurrentImage();
      }
    }

    nextImage() {
      if (this.currentIndex < this.items.length - 1) {
        this.currentIndex++;
        this.showCurrentImage();
      }
    }

    closeLightbox() {
      if (this.lightbox) {
        this.lightbox.classList.remove('active');
        
        setTimeout(() => {
          if (this.lightbox && this.lightbox.parentNode) {
            this.lightbox.parentNode.removeChild(this.lightbox);
          }
          this.lightbox = null;
        }, 300);
      }

      // Restore body scroll
      document.body.style.overflow = '';
    }
  }

  /**
   * Gallery Slideshow Class
   */
  class GallerySlideshow {
    constructor(container) {
      this.container = container;
      this.slides = container.querySelectorAll('.slideshow-slide');
      this.currentSlide = 0;
      this.isPlaying = false;
      this.interval = null;
      
      this.init();
    }

    init() {
      this.setupNavigation();
      this.setupThumbnails();
      this.setupAutoplay();
      this.bindEvents();
      this.showSlide(0);
    }

    setupNavigation() {
      const prevBtn = this.container.querySelector('.slideshow-prev');
      const nextBtn = this.container.querySelector('.slideshow-next');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => this.previousSlide());
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.nextSlide());
      }
    }

    setupThumbnails() {
      const thumbnailsContainer = this.container.querySelector('.slideshow-thumbnails');
      if (!thumbnailsContainer) return;

      this.slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        const thumbnail = document.createElement('div');
        thumbnail.className = 'slideshow-thumbnail';
        thumbnail.innerHTML = `<img src="${img.src}" alt="${img.alt}" />`;
        
        thumbnail.addEventListener('click', () => {
          this.showSlide(index);
        });

        thumbnailsContainer.appendChild(thumbnail);
      });
    }

    setupAutoplay() {
      const playBtn = this.container.querySelector('.slideshow-play');
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          this.toggleAutoplay();
        });
      }
    }

    bindEvents() {
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (this.isVisible()) {
          switch(e.key) {
            case 'ArrowLeft':
              e.preventDefault();
              this.previousSlide();
              break;
            case 'ArrowRight':
              e.preventDefault();
              this.nextSlide();
              break;
            case ' ':
              e.preventDefault();
              this.toggleAutoplay();
              break;
          }
        }
      });

      // Touch/swipe support
      let startX = 0;
      let startY = 0;

      this.container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      });

      this.container.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;

        // Only handle horizontal swipes
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
          if (diffX > 0) {
            this.nextSlide();
          } else {
            this.previousSlide();
          }
        }
      });
    }

    showSlide(index) {
      if (index < 0 || index >= this.slides.length) return;

      // Hide all slides
      this.slides.forEach(slide => {
        slide.classList.remove('active');
      });

      // Show current slide
      this.slides[index].classList.add('active');
      this.currentSlide = index;

      // Update thumbnails
      const thumbnails = this.container.querySelectorAll('.slideshow-thumbnail');
      thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
      });

      // Update counter
      const counter = this.container.querySelector('.slideshow-counter');
      if (counter) {
        counter.textContent = `${index + 1} / ${this.slides.length}`;
      }
    }

    nextSlide() {
      const nextIndex = (this.currentSlide + 1) % this.slides.length;
      this.showSlide(nextIndex);
    }

    previousSlide() {
      const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
      this.showSlide(prevIndex);
    }

    toggleAutoplay() {
      if (this.isPlaying) {
        this.stopAutoplay();
      } else {
        this.startAutoplay();
      }
    }

    startAutoplay() {
      this.isPlaying = true;
      this.interval = setInterval(() => {
        this.nextSlide();
      }, 5000);

      const playBtn = this.container.querySelector('.slideshow-play');
      if (playBtn) {
        playBtn.textContent = 'Pause';
      }
    }

    stopAutoplay() {
      this.isPlaying = false;
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }

      const playBtn = this.container.querySelector('.slideshow-play');
      if (playBtn) {
        playBtn.textContent = 'Play';
      }
    }

    isVisible() {
      const rect = this.container.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    }
  }

  /**
   * Video Gallery Class
   */
  class VideoGallery {
    constructor(container) {
      this.container = container;
      this.videos = container.querySelectorAll('.video-item');
      
      this.init();
    }

    init() {
      this.setupVideoPlayers();
      this.bindEvents();
    }

    setupVideoPlayers() {
      this.videos.forEach(video => {
        const videoElement = video.querySelector('video');
        const playBtn = video.querySelector('.video-play-btn');
        
        if (videoElement && playBtn) {
          playBtn.addEventListener('click', () => {
            this.playVideo(videoElement);
          });
        }
      });
    }

    bindEvents() {
      // Pause other videos when one starts playing
      this.videos.forEach(video => {
        const videoElement = video.querySelector('video');
        if (videoElement) {
          videoElement.addEventListener('play', () => {
            this.pauseOtherVideos(videoElement);
          });
        }
      });
    }

    playVideo(videoElement) {
      videoElement.play();
      videoElement.controls = true;
      
      const playBtn = videoElement.parentElement.querySelector('.video-play-btn');
      if (playBtn) {
        playBtn.style.display = 'none';
      }
    }

    pauseOtherVideos(currentVideo) {
      this.videos.forEach(video => {
        const videoElement = video.querySelector('video');
        if (videoElement && videoElement !== currentVideo) {
          videoElement.pause();
        }
      });
    }
  }

})(jQuery, Drupal);
