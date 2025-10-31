import React, { useState } from 'react';
import styles from '../styles/WhyDifferent.module.css';
import Image from 'next/image';

// Helper function to convert hex to rgb
const hexToRgb = (hex) => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
};

const WhyDifferent = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  
  const features = [
    {
      id: 1,
      title: 'Local Experts You\'ll Actually Talk To',
      description: 'When you call us, you reach our team - not a call center halfway across the country. We\'ve been serving Northeast Ohio since 1998 with personalized service.',
      icon: '🏠',
      color: '#4299E1'
    },
    {
      id: 2,
      title: 'No High-Pressure Sales Tactics',
      description: 'We don\'t use cheasy salespeople or "today-only" pricing gimmicks. Our consultations feel like talking to a knowledgeable friend.',
      icon: '🤝',
      color: '#48BB78'
    },
    {
      id: 3,
      title: 'Complete Gutter Preparation',
      description: 'We clean, reseal, and ensure proper pitch before installation - steps the competition often skips.',
      icon: '🧹',
      color: '#ED8936'
    },
    {
      id: 4,
      title: 'Heat Only What You Need',
      description: 'Unlike competitors who want to sell you heating for every inch of gutter, we target only the problem areas.',
      icon: '🌡️',
      color: '#E53E3E'
    },
    {
      id: 5,
      title: 'We Fix What Others Can\'t',
      description: 'We regularly remove and replace failed gutter covers from national brands.',
      icon: '🔧',
      color: '#805AD5'
    },
    {
      id: 6,
      title: 'Always On Time',
      description: 'We respect your schedule and arrive when promised - it\'s a point of pride for our team.',
      icon: '⏱️',
      color: '#38B2AC'
    }
  ];

  return (
    <section className={styles.differentSection} id="why-choose-us">
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <h2 className={styles.sectionTitle}>We're Different By Design</h2>
          <div className={styles.titleDivider}></div>
          <h3 className={styles.sectionSubtitle}>What makes Northeast Ohio homeowners choose us over national brands?</h3>
        </div>
        
        <div className={styles.featureGrid}>
          {features.map(feature => (
            <div 
              key={feature.id} 
              className={`${styles.featureCard} ${activeFeature === feature.id ? styles.activeCard : ''}`}
              onMouseEnter={() => setActiveFeature(feature.id)}
              onMouseLeave={() => setActiveFeature(null)}
              style={{
                '--feature-color': feature.color,
                '--feature-color-rgb': hexToRgb(feature.color)
              }}
            >
              <div className={styles.featureHeader}>
                <div className={styles.featureIconWrapper}>
                  <span className={styles.featureIcon}>{feature.icon}</span>
                </div>
                <div className={styles.featureNumber}>{feature.id}</div>
              </div>
              
              <h4 className={styles.featureTitle}>{feature.title}</h4>
              <p className={styles.featureDescription}>{feature.description}</p>
              
              <div className={styles.featureHighlight}></div>
            </div>
          ))}
        </div>
        
        <div className={styles.companyInfo}>
          <div className={styles.infoCol}>
            <div className={styles.locallyOwnedImageContainer}>
              <Image 
                src="/local-owned-logo.webp" 
                alt="Locally Owned and Operated" 
                width={200}
                height={150}
                className={styles.locallyOwnedImage} 
              />
            </div>
          </div>
          
          <div className={styles.infoCol}>
            <div className={styles.statBox}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>25+</span>
                <span className={styles.statLabel}>Years in Business</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>5,000+</span>
                <span className={styles.statLabel}>Happy Customers</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>4.9</span>
                <span className={styles.statLabel}>Average Rating</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.quote}>
          <p className={styles.quoteText}>"We don't just install gutter covers - we solve problems that big national companies can't or won't handle."</p>
          <p className={styles.quoteAuthor}>— Jim Carbone, Owner</p>
        </div>
      </div>
    </section>
  );
};

export default WhyDifferent; 