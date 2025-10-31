import React, { useState } from 'react';
import styles from '../styles/CustomerJourneys.module.css';
import Image from 'next/image';

// Helper function to convert hex to rgb
const hexToRgb = (hex) => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

const CustomerJourneys = () => {
  const [activeCard, setActiveCard] = useState(null);
  
  const journeys = [
    {
      id: 1,
      title: "I've Tried Screens and DIY Solutions",
      description: "Like many homeowners, you've probably tried hardware store options that promised to solve your gutter problems. If you're still having issues, it's time for a permanent solution.",
      detail: "We remove failed gutter covers every day and replace them with systems that actually work.",
      image: "/assets/gutter-guards/gutter-guards-set2-8.webp",
      icon: "🛠️",
      color: "#ED8936",
      action: "See How We're Different",
      persona: "DIY Homeowner"
    },
    {
      id: 2,
      title: "I've Had Water Damage from Ice Dams",
      description: "When water can't drain properly in winter, it backs up under your shingles and into your home. This isn't just a gutter problem—it's a potential construction disaster.",
      detail: "Our heating solutions target this problem directly and prevent costly interior repairs.",
      image: "/assets/heater-cap/before-after-heater-1.jpg",
      icon: "❄️",
      color: "#3182CE",
      action: "Explore Heating Solutions",
      persona: "Damage Prevention"
    },
    {
      id: 3,
      title: "I'm Getting Too Old for Ladder Climbing",
      description: "Many of our customers simply want to eliminate the dangerous task of cleaning gutters multiple times a year. Our permanent protection gives you peace of mind.",
      detail: "With a lifetime warranty, you'll never need to worry about gutter maintenance again.",
      image: "/assets/gutter-guards/gutter-guards-10.webp",
      icon: "🪜",
      color: "#38B2AC",
      action: "End Gutter Cleaning Forever",
      persona: "Safety Conscious"
    }
  ];

  return (
    <section className={styles.journeysSection}>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <h2 className={styles.sectionTitle}>Which Situation Sounds Like Yours?</h2>
          <div className={styles.titleDivider}></div>
          <h3 className={styles.sectionSubtitle}>We've helped thousands of Northeast Ohio homeowners with these common problems</h3>
        </div>
        
        <div className={styles.journeysGrid}>
          {journeys.map((journey) => (
            <div 
              key={journey.id}
              className={`${styles.journeyCard} ${activeCard === journey.id ? styles.activeCard : ''}`}
              onMouseEnter={() => setActiveCard(journey.id)}
              onMouseLeave={() => setActiveCard(null)}
              style={{
                '--card-color': journey.color,
                '--card-color-rgb': hexToRgb(journey.color)
              }}
            >
              <div className={styles.cardImageContainer}>
                <Image 
                  src={journey.image}
                  alt={journey.title}
                  width={400}
                  height={300}
                  className={styles.cardImage}
                />
                <div className={styles.imageOverlay}></div>
                <div className={styles.personaTag}>{journey.persona}</div>
              </div>
              
              <div className={styles.cardContent}>
                <div className={styles.cardIconContainer}>
                  <span className={styles.cardIcon}>{journey.icon}</span>
                </div>
                <h3 className={styles.cardTitle}>"{journey.title}"</h3>
                <p className={styles.cardDescription}>{journey.description}</p>
                <div className={styles.cardDivider}></div>
                <p className={styles.cardDetail}>{journey.detail}</p>
                
                <a href="#contact" className={styles.cardButton}>
                  {journey.action}
                  <svg className={styles.buttonArrow} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
              
              {/* Card highlight effects */}
              <div className={styles.cardHighlight}></div>
            </div>
          ))}
        </div>
        
        <div className={styles.journeysCallout}>
          <p className={styles.calloutText}>
            Not seeing your specific situation? <a href="#contact" className={styles.calloutHighlight}>Contact us</a> for a personalized consultation
          </p>
        </div>
      </div>
    </section>
  );
};

export default CustomerJourneys; 