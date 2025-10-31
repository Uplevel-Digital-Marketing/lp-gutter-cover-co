import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/ProblemAwareness.module.css';
import Image from 'next/image';

const ProblemAwareness = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const tabsRef = useRef(null);

  const problems = [
    {
      id: 0,
      title: 'Ice Dams',
      fullTitle: 'Dangerous Ice Dams & Icicles',
      description: 'Winter\'s beauty quickly turns destructive when ice backs up in your gutters, forcing water under your shingles and into your home. These ice formations aren\'t just a hazard to people walking below - they can cause thousands in water damage to your ceilings and walls.',
      image: '/assets/heater-cap/before-after-heater-1.jpg',
      icon: '❄️',
      stats: 'The average ice dam repair costs Cleveland homeowners $4,000-$8,000'
    },
    {
      id: 1,
      title: 'Clogged Gutters',
      fullTitle: 'Clogged & Overflowing Gutters',
      description: 'Water cascading over your gutters during heavy rain doesn\'t just create waterfalls around your home - it damages your landscaping, siding, and even your foundation. Those beautiful trees surrounding your property should enhance your home, not become a maintenance nightmare.',
      image: '/assets/gutter-guards/gutter-guards-10.webp',
      icon: '🌧️',
      stats: '90% of Northeast Ohio homes experience this issue at least once a year'
    },
    {
      id: 2,
      title: 'Gutter Gardens',
      fullTitle: 'The Rooftop Garden',
      description: 'Found plants growing in your gutters? You\'re not alone! We\'ve seen everything from small trees to vegetable gardens taking root in neglected gutters across Cleveland. This organic matter holds moisture against your fascia boards, accelerating rot and creating perfect conditions for pests.',
      image: '/assets/gutter-guards/gutter-guards-set2-7.webp',
      icon: '🌱',
      stats: 'Clogged gutters weigh 370% more than clean ones, straining your gutter fasteners'
    },
    {
      id: 3,
      title: 'Ladder Danger',
      fullTitle: 'The Dangerous Ladder Climb',
      description: 'Climbing ladders multiple times a year to clean gutters puts you at significant risk of serious injury. As we get older, this necessary maintenance becomes increasingly dangerous. Emergency rooms see over 164,000 ladder-related injuries annually - a risk no homeowner should take.',
      image: '/assets/gutter-guards/gutter-guards-7.webp',
      icon: '🪜',
      stats: '1 in 5 fall injuries among homeowners involves ladder use during maintenance'
    },
    {
      id: 4,
      title: 'Failed DIY',
      fullTitle: 'Failed DIY Solutions',
      description: 'Those mesh screens and cheap plastic covers from the hardware store seemed like a good idea at first, but now they\'re collapsing or completely ineffective. Many of our customers come to us after wasting money on temporary fixes that created more problems than they solved.',
      image: '/assets/gutter-guards/gutter-guards-set2-8.webp',
      icon: '🔨',
      stats: '73% of DIY gutter guards fail or significantly degrade within 2 years'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setActiveTab(prevTab => (prevTab + 1) % problems.length);
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [isAnimating, problems.length]);

  const handleTabChange = (index) => {
    setIsAnimating(true);
    setActiveTab(index);
    setTimeout(() => setIsAnimating(false), 500);
    
    // Ensure the selected tab is visible by scrolling to it if needed
    if (tabsRef.current) {
      const tabElement = tabsRef.current.children[index];
      if (tabElement) {
        tabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  return (
    <section className={styles.problemSection}>
      <div className={styles.container}>
        <div className={styles.problemHeader}>
          <h2 className={styles.problemTitle}>Gutter Problems Plaguing Northeast Ohio Homes</h2>
          <p className={styles.problemSubtitle}>Is your home suffering from any of these common issues?</p>
        </div>

        <div className={styles.problemDisplay}>
          <div className={styles.tabsContainer} ref={tabsRef}>
            {problems.map((problem, index) => (
              <button
                key={problem.id}
                className={`${styles.tabButton} ${activeTab === index ? styles.activeTab : ''}`}
                onClick={() => handleTabChange(index)}
                aria-selected={activeTab === index}
              >
                <span className={styles.tabIcon}>{problem.icon}</span>
                <span className={styles.tabText}>{problem.title}</span>
              </button>
            ))}
          </div>

          <div className={styles.contentArea}>
            <div className={styles.imageContainer}>
              <Image
                src={problems[activeTab].image}
                alt={problems[activeTab].fullTitle}
                fill
                className={styles.problemImage}
                priority
              />
              <div className={styles.imageOverlay}></div>
            </div>

            <div className={styles.detailsContainer}>
              <h3 className={styles.detailsTitle}>{problems[activeTab].fullTitle}</h3>
              <p className={styles.detailsDescription}>{problems[activeTab].description}</p>
              <div className={styles.problemStats}>
                <div className={styles.statIcon}>📊</div>
                <p className={styles.statText}>{problems[activeTab].stats}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actionSection}>
          <h3 className={styles.actionTitle}>Stop dealing with these problems once and for all</h3>
          <button className={styles.actionButton}>Schedule Your Free Assessment</button>
          <p className={styles.actionNote}>Our solutions are permanent and require zero maintenance</p>
        </div>
      </div>
    </section>
  );
};

export default ProblemAwareness; 