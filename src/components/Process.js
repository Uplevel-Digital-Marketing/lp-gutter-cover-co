import React, { useState } from 'react';
import styles from '../styles/Process.module.css';
import Image from 'next/image';

const Process = () => {
  const [activeStep, setActiveStep] = useState(null);
  
  const steps = [
    {
      id: 1,
      title: 'Initial Consultation',
      description: 'We start by understanding your specific gutter issues and inspect your current gutters without any sales pressure.',
      icon: '🏠',
      color: '#4299E1',
      detail: 'Our consultation is educational, not a sales pitch. We\'ll take measurements, identify problem areas, and answer all your questions.'
    },
    {
      id: 2,
      title: 'Customized Recommendation',
      description: 'We\'ll recommend a solution tailored to your exact situation - not a one-size-fits-all approach.',
      icon: '📋',
      color: '#48BB78',
      detail: 'You\'ll receive detailed options with transparent pricing. We consider your home\'s architecture, tree coverage, and weather patterns specific to your area.'
    },
    {
      id: 3,
      title: 'Thorough Preparation',
      description: 'Free gutter tune up with purchase. We will clean the gutters, check the pitch, reseal and tighten the gutters.',
      icon: '🧹',
      color: '#ED8936',
      detail: 'Many competitors skip this crucial step. We ensure your gutters are properly cleaned, sealed, and pitched for maximum efficiency before installing any protective system.'
    },
    {
      id: 4,
      title: 'Expert Installation',
      description: 'Our skilled tradesmen handle the installation with precision. Most installations are completed in just one day.',
      icon: '🔧',
      color: '#805AD5',
      detail: 'Our installation crews average 15+ years of experience. We use only the highest quality materials and fasteners to ensure your system lasts for decades.'
    },
    {
      id: 5,
      title: 'Final Walkthrough',
      description: 'We\'ll explain how your new system works and ensure you\'re completely satisfied.',
      icon: '✅',
      color: '#38B2AC',
      detail: 'We don\'t consider the job complete until you\'re 100% satisfied. You\'ll receive care instructions and our direct contact information for any future questions.'
    }
  ];

  // Convert hex to RGB for CSS variables
  const hexToRgb = (hex) => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  };

  const handleStepClick = (id) => {
    setActiveStep(activeStep === id ? null : id);
  };

  return (
    <section className={styles.processSection} id="process">
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <h2 className={styles.sectionTitle}>Our 5-Step Installation Process</h2>
          <div className={styles.titleDivider}></div>
          <h3 className={styles.sectionSubtitle}>A thoughtful approach from consultation to completion</h3>
        </div>
        
        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`${styles.step} ${activeStep === step.id ? styles.activeStep : ''}`}
              onClick={() => handleStepClick(step.id)}
              style={{
                '--step-color': step.color,
                '--step-color-rgb': hexToRgb(step.color)
              }}
            >
              <div className={styles.stepNumber}>
                <div className={styles.stepIconWrapper}>
                  <span className={styles.stepIcon}>{step.icon}</span>
                  <span className={styles.stepCounter}>{step.id}</span>
                </div>
              </div>
              
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                <p className={styles.stepDescription}>{step.description}</p>
                
                <div className={`${styles.stepDetails} ${activeStep === step.id ? styles.showDetails : ''}`}>
                  <p>{step.detail}</p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={styles.connector}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className={styles.benefitsSection}>
          <div className={styles.benefitsHeader}>
            <h4>Why Our Process Matters</h4>
          </div>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>⏱️</div>
              <h5 className={styles.benefitTitle}>Time Efficient</h5>
              <p className={styles.benefitText}>Most installations complete in a single day</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🔄</div>
              <h5 className={styles.benefitTitle}>No Hassle</h5>
              <p className={styles.benefitText}>We handle the entire process from start to finish</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>💯</div>
              <h5 className={styles.benefitTitle}>Quality Assured</h5>
              <p className={styles.benefitText}>We don't leave until you're completely satisfied</p>
            </div>
          </div>
        </div>
        
        <div className={styles.testimonialBox}>
          <div className={styles.testimonialContent}>
            <div className={styles.quoteIcon}>"</div>
            <p className={styles.testimonialText}>
              Unlike the large franchises that rush through appointments, we take the time to get it right. 
              That's why we've maintained an A+ Rating with the Better Business Bureau for over 15 years without a formal complaint.
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorInfo}>
                <p className={styles.authorName}>Jim Carbone</p>
                <p className={styles.authorTitle}>Founder, Gutter Cover Co</p>
              </div>
            </div>
          </div>
          <div className={styles.ratingBadge}>
            <span className={styles.ratingLabel}>BBB Rating</span>
            <span className={styles.ratingValue}>A+</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process; 