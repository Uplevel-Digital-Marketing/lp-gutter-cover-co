import React, { useState, useEffect } from 'react';
import styles from '../styles/SeasonalAwareness.module.css';
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

const SeasonalAwareness = () => {
  const [activeTab, setActiveTab] = useState('winter');
  const [isAnimating, setIsAnimating] = useState(false);

  const seasonalInfo = {
    winter: {
      title: "Dealing with Ice Dam Damage?",
      description: "Winter in Northeast Ohio brings beautiful snow, but also the risk of destructive ice dams. If you've experienced water intrusion, damaged drywall, or dangerous icicles, our Heater Cap system provides targeted protection exactly where you need it.",
      benefits: [
        "Prevents costly water damage to your home's interior",
        "Eliminates dangerous icicles that threaten your family",
        "Targets only problem areas for maximum energy efficiency",
        "Works from the warmth inside of your home"
      ],
      image: "/assets/heater-cap/before-after-heater-1.jpg",
      icon: "❄️",
      color: "#3182CE",
      label: "Winter/Spring Protection"
    },
    summer: {
      title: "Tired of Cleaning Leaf-Clogged Gutters?",
      description: "As Northeast Ohio's beautiful trees shed their leaves each fall, your gutters become collection points for debris. Our Gutter Topper system permanently eliminates gutter cleaning while ensuring proper water flow away from your home.",
      benefits: [
        "Never clean those gutters again - guaranteed",
        "Prevents foundation damage from overflowing gutters",
        "Keeps birds and small animals out of your gutter system",
        "Strengthens your existing gutters for longer lifespan"
      ],
      image: "/assets/gutter-guards/gutter-guards-10.webp",
      icon: "🍂",
      color: "#ED8936",
      label: "Summer/Fall Protection"
    }
  };

  const handleTabChange = (tab) => {
    if (tab !== activeTab && !isAnimating) {
      setIsAnimating(true);
      setActiveTab(tab);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  // Auto-rotate tabs if no interaction for a while
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setActiveTab(prev => prev === 'winter' ? 'summer' : 'winter');
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <section className={styles.seasonalSection}>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <h2 className={styles.sectionTitle}>Year-Round Gutter Protection</h2>
          <div className={styles.titleDivider}></div>
          <h3 className={styles.sectionSubtitle}>Different seasons present different challenges for Northeast Ohio homes</h3>
        </div>
        
        <div className={styles.tabsContainer}>
          <div className={styles.tabButtons}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'winter' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('winter')}
              style={{
                '--tab-color': seasonalInfo.winter.color,
                '--tab-color-rgb': hexToRgb(seasonalInfo.winter.color)
              }}
            >
              <span className={styles.tabIcon}>{seasonalInfo.winter.icon}</span>
              <span className={styles.tabLabel}>{seasonalInfo.winter.label}</span>
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'summer' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('summer')}
              style={{
                '--tab-color': seasonalInfo.summer.color,
                '--tab-color-rgb': hexToRgb(seasonalInfo.summer.color)
              }}
            >
              <span className={styles.tabIcon}>{seasonalInfo.summer.icon}</span>
              <span className={styles.tabLabel}>{seasonalInfo.summer.label}</span>
            </button>
          </div>
          
          <div className={styles.seasonalContent}>
            <div className={`${styles.seasonalPanel} ${isAnimating ? styles.animating : ''}`}>
              <div className={styles.contentText}>
                <h3 className={styles.contentTitle} 
                  style={{
                    '--content-color': seasonalInfo[activeTab].color
                  }}
                >
                  {seasonalInfo[activeTab].title}
                </h3>
                <p className={styles.contentDescription}>
                  {seasonalInfo[activeTab].description}
                </p>
                
                <div className={styles.benefitsList}>
                  <h4 className={styles.benefitsTitle}>Key Benefits:</h4>
                  <ul className={styles.benefits}>
                    {seasonalInfo[activeTab].benefits.map((benefit, index) => (
                      <li key={index} className={styles.benefitItem}>
                        <div className={styles.benefitIcon} 
                          style={{
                            '--benefit-color': seasonalInfo[activeTab].color
                          }}
                        >✓</div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={styles.actionArea}>
                  <button className={styles.actionButton} 
                    style={{
                      '--action-color': seasonalInfo[activeTab].color,
                      '--action-color-rgb': hexToRgb(seasonalInfo[activeTab].color)
                    }}
                  >
                    Learn More About {activeTab === 'winter' ? 'Heater Cap' : 'Gutter Topper'}
                  </button>
                </div>
              </div>
              
              <div className={styles.contentImage}>
                <div className={styles.imageContainer}>
                  <Image 
                    src={seasonalInfo[activeTab].image}
                    alt={`${activeTab} gutter protection solution`}
                    width={500}
                    height={400}
                    className={styles.seasonalImage}
                  />
                  <div className={styles.imageLabel} 
                    style={{
                      '--label-color': seasonalInfo[activeTab].color
                    }}
                  >
                    {activeTab === 'winter' ? 'Heater Cap System' : 'Gutter Topper System'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.seasonalTagline}>
          <div className={styles.taglineIcon}>🏠</div>
          <p className={styles.taglineText}>
            <strong>One company, complete protection:</strong> Our solutions work together to protect your home throughout all four seasons of Northeast Ohio weather.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SeasonalAwareness; 