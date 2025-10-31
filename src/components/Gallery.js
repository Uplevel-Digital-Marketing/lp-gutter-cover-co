import React, { useState } from 'react';
import styles from '../styles/Gallery.module.css';
import Image from 'next/image';

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('gutter-guards');
  const [modalImage, setModalImage] = useState(null);

  // Limit to 6 images per category
  const gutterGuardImages = [
    { 
      id: 'gg1', 
      src: '/assets/gutter-guards/gutter-guards-2.webp', 
      alt: 'Gutter guards installation',
      title: 'Gutter Topper Installation',
      description: 'Professional installation on a colonial-style home in Beachwood, OH'
    },
    { 
      id: 'gg2', 
      src: '/assets/gutter-guards/gutter-guards-6.webp', 
      alt: 'Gutter protection system',
      title: 'Leaf Protection System',
      description: 'Close-up of our patented leaf protection technology'
    },
    { 
      id: 'gg3', 
      src: '/assets/gutter-guards/gutter-guards-7.webp', 
      alt: 'Leaf protection for gutters',
      title: 'Gutter Cover Solution',
      description: 'Guard system installed on modern residential property'
    },
    { 
      id: 'gg4', 
      src: '/assets/gutter-guards/gutter-guards-10.webp', 
      alt: 'Professional gutter guard installation',
      title: 'Clean Gutter System',
      description: 'After installation showing the clean, seamless appearance'
    },
    { 
      id: 'gg5', 
      src: '/assets/gutter-guards/gutter-guards-set2-4.webp', 
      alt: 'Gutter covers on home',
      title: 'Residential Application',
      description: 'Full home protection system in Cleveland Heights'
    },
    { 
      id: 'gg6', 
      src: '/assets/gutter-guards/gutter-guards-set2-7.webp', 
      alt: 'Debris protection system',
      title: 'Debris Defense Technology',
      description: 'Close-up showing how our system handles debris'
    }
  ];
  
  const heaterCapImages = [
    { 
      id: 'hc1', 
      src: '/assets/heater-cap/heated-gutters-1-1.webp', 
      alt: 'Heated gutter system',
      title: 'Heater Cap Installation',
      description: 'Complete heated gutter system on a lakefront property'
    },
    { 
      id: 'hc2', 
      src: '/assets/heater-cap/heated-gutters-3.webp', 
      alt: 'Ice dam prevention system',
      title: 'Ice Dam Prevention',
      description: 'System installed to prevent dangerous winter ice dams'
    },
    { 
      id: 'hc3', 
      src: '/assets/heater-cap/heated-gutters-new-1.webp', 
      alt: 'Heater cap installation',
      title: 'New Heater Cap Technology',
      description: 'Latest technology in heated gutter protection'
    },
    { 
      id: 'hc4', 
      src: '/assets/heater-cap/heated-gutters-hero.webp', 
      alt: 'Winter gutter protection',
      title: 'Winter Protection Solution',
      description: 'Full home protection for harsh Northeast Ohio winters'
    },
    { 
      id: 'hc5', 
      src: '/assets/heater-cap/before-after-heater-1.jpg', 
      alt: 'Before and after heated gutters',
      title: 'Before & After',
      description: 'Dramatic results from our heating system installation'
    },
    { 
      id: 'hc6', 
      src: '/assets/heater-cap/before-after-heater-2.jpg', 
      alt: 'Ice dam prevention before and after',
      title: 'Ice Dam Resolution',
      description: 'How our system eliminates dangerous ice formations'
    }
  ];
  
  const getFilteredImages = () => {
    switch (activeCategory) {
      case 'gutter-guards':
        return gutterGuardImages;
      case 'heater-cap':
        return heaterCapImages;
      default:
        return gutterGuardImages;
    }
  };

  const openModal = (image) => {
    setModalImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalImage(null);
    document.body.style.overflow = 'auto';
  };
  
  return (
    <section className={styles.gallerySection} id="gallery">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Our Work In Northeast Ohio</h2>
          <div className={styles.titleDivider}></div>
          <h3 className={styles.sectionSubtitle}>See real installations from Cleveland area homes</h3>
        </div>
        
        <div className={styles.filterButtons}>
          <button 
            className={`${styles.filterButton} ${activeCategory === 'gutter-guards' ? styles.active : ''}`}
            onClick={() => setActiveCategory('gutter-guards')}
          >
            Gutter Guards
          </button>
          <button 
            className={`${styles.filterButton} ${activeCategory === 'heater-cap' ? styles.active : ''}`}
            onClick={() => setActiveCategory('heater-cap')}
          >
            Heated Gutter Systems
          </button>
        </div>
        
        <div className={styles.galleryGrid}>
          {getFilteredImages().map(image => (
            <div key={image.id} className={styles.galleryItem} onClick={() => openModal(image)}>
              <div className={styles.imageContainer}>
                <img 
                  src={image.src}
                  alt={image.alt}
                  className={styles.galleryImage}
                />
                <div className={styles.imageOverlay}>
                  <div className={styles.imageContent}>
                    <h4 className={styles.imageTitle}>{image.title}</h4>
                    <p className={styles.imageDescription}>{image.description}</p>
                    <span className={styles.viewPrompt}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 14V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 3L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      View Larger
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.galleryCallout}>
          <p>Want to see more examples of our work? Check out our <a href="/case-studies">customer case studies</a> or <a href="/contact">contact us</a> for a personalized consultation.</p>
        </div>
      </div>
      
      {modalImage && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>×</button>
            <div className={styles.modalImageContainer}>
              <img
                src={modalImage.src}
                alt={modalImage.alt}
                className={styles.modalImage}
              />
            </div>
            <div className={styles.modalCaption}>
              <h4>{modalImage.title}</h4>
              <p>{modalImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery; 