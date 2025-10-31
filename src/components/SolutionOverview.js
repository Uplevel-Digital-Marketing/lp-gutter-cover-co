import React, { useState, useEffect } from 'react';
import styles from '../styles/SolutionOverview.module.css';
import Image from 'next/image';

const SolutionOverview = () => {
  const [activeTab, setActiveTab] = useState('combined');
  const [isAnimating, setIsAnimating] = useState(false);

  const tabContent = {
    combined: {
      title: 'Combined Protection System',
      subtitle: 'The ultimate year-round protection system - no cleaning, no ice dams, no worries.',
      description: 'Our most requested solution combines Heater Cap\'s ice prevention technology with Gutter Topper\'s proven leaf protection.',
      benefits: [
        'Total peace of mind in every season',
        'Prevents clogged gutters and melts ice dams',
        'One system handles everything mother nature throws at your home',
        'Heat only the areas in need or even add it later',
        'Our most popular solution for Northeast Ohio homes'
      ],
      imageSrc: '/assets/gutter-guards/gutter-guards-7.webp',
      imageAlt: 'Combined gutter and heater protection system installed on a home',
      callToAction: 'Learn about our complete protection',
      testimonial: '"After years of water damage from ice dams, this past winter was the first time in 12 years we didn\'t have a single problem with ice or water intrusion." - Michael W., Shaker Heights',
      color: '#3182ce'
    },
    heater: {
      title: 'Heater Cap',
      subtitle: 'Stop dangerous ice dams before they damage your home.',
      description: 'Our innovative heating system melts ice formation in your gutters during Northeast Ohio\'s harsh winters.',
      benefits: [
        'Prevents costly interior water damage from ice backups',
        'Melts dangerous icicles that threaten your family',
        'Safely hardwired directly into your breaker box',
        'Can be added to most existing gutter protection',
        'Control system access from inside the warmth of your home'
      ],
      imageSrc: '/assets/heater-cap/heated-gutters-hero.webp',
      imageAlt: 'Heater Cap system preventing ice dam formation',
      callToAction: 'Discover Heater Cap',
      testimonial: '"After three winters of water damage from ice dams, we installed Heater Cap last year. This past winter was the worst we\'ve seen, but our gutters stayed completely clear of ice." - James K., Lakewood',
      color: '#e53e3e'
    },
    gutter: {
      title: 'Gutter Topper',
      subtitle: 'Never clean those gutters again - guaranteed for life (lifetime performance warranty).',
      description: 'Our flagship product installs directly over your existing gutters, creating a permanent barrier against leaves, pine needles, and debris.',
      benefits: [
        'Water flows in, leaves and debris stay out',
        'Installs directly over your existing gutters',
        'Handles up to 22" inches of rain per hour',
        'Engineered to withstand 110mph winds',
        'Strong enough to handle snow load without collapsing',
        'Backed by a lifetime transferable warranty'
      ],
      imageSrc: '/assets/gutter-guards/gutter-guards-2.webp',
      imageAlt: 'Gutter Topper installed on a residential home',
      callToAction: 'Explore Gutter Topper',
      testimonial: '"We\'ve had our Gutter Topper for 7 years now. Even with massive oak trees surrounding our house, we haven\'t had to clean our gutters once." - Susan T., Mentor',
      color: '#38b2ac'
    }
  };

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setIsAnimating(true);
      setActiveTab(tab);
      
      // Reset animation state after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  };

  const active = tabContent[activeTab];

  return (
    <section className={styles.solutionSection} id="solutions">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Permanent Solutions For Your Gutter Problems</h2>
          <div className={styles.titleDivider}></div>
          <p className={styles.sectionSubtitle}>Choose the right protection for your Northeast Ohio home</p>
        </div>
        
        <div className={styles.tabContainer}>
          <div className={styles.tabs}>
            {Object.keys(tabContent).map((tab) => (
              <button 
                key={tab}
                className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`}
                onClick={() => handleTabChange(tab)}
                style={activeTab === tab ? { borderColor: tabContent[tab].color } : {}}
              >
                <span>{tabContent[tab].title}</span>
              </button>
            ))}
          </div>
          
          <div className={`${styles.tabContent} ${isAnimating ? styles.animating : ''}`}>
            <div className={styles.contentLeft}>
              <div className={styles.contentHeader}>
                <h3 className={styles.contentTitle}>{active.title}</h3>
                <div 
                  className={styles.contentTitleUnderline}
                  style={{ backgroundColor: active.color }}
                ></div>
                <p className={styles.contentSubtitle}>{active.subtitle}</p>
              </div>
              
              <p className={styles.contentDescription}>{active.description}</p>
              
              <h4 className={styles.benefitsTitle}>Key Benefits:</h4>
              <ul className={styles.benefitsList}>
                {active.benefits.map((benefit, index) => (
                  <li key={index} className={styles.benefitItem}>
                    <span className={styles.benefitIcon} style={{ backgroundColor: active.color }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
              
              <a 
                href="#contact" 
                className={styles.actionButton}
                style={{ 
                  backgroundColor: active.color,
                  boxShadow: `0 4px 14px ${active.color}50`
                }}
              >
                {active.callToAction}
                <span className={styles.arrowIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </a>
            </div>
            
            <div className={styles.contentRight}>
              <div className={styles.imageContainer}>
                <div className={styles.imageWrapper} style={{ borderColor: active.color }}>
                  <img
                    src={active.imageSrc}
                    alt={active.imageAlt}
                    className={styles.solutionImage}
                  />
                </div>
                
                <div className={styles.testimonialContainer}>
                  <div 
                    className={styles.testimonialBubble}
                    style={{ backgroundColor: `${active.color}08` }}
                  >
                    <div className={styles.quoteIcon} style={{ color: active.color }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11 7.5c0-1.375-1.125-2.5-2.5-2.5H4.5C3.125 5 2 6.125 2 7.5v4C2 12.875 3.125 14 4.5 14h2C6.125 14 6 13.875 6 13.5V10h1.5c0.562 0 1 0.438 1 1v4.5c0 0.562-0.438 1-1 1H2v3h5.5c1.938 0 3.5-1.562 3.5-3.5V7.5zM22 15.5c0 1.938-1.562 3.5-3.5 3.5H13v-3h5.5c0.562 0 1-0.438 1-1V10c0-0.562-0.438-1-1-1H17V13.5c0 0.375 0.125 0.5 0.5 0.5h-2c-1.375 0-2.5-1.125-2.5-2.5v-4C13 6.125 14.125 5 15.5 5h4C20.875 5 22 6.125 22 7.5V15.5z"/>
                      </svg>
                    </div>
                    <p className={styles.testimonial}>{active.testimonial}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionOverview; 