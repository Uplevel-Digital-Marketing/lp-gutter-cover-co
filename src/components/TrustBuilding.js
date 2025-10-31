import React from 'react';
import styles from '../styles/TrustBuilding.module.css';

const TrustBuilding = () => {
  return (
    <section className={styles.trustBuilding}>
      <div className={styles.container}>
        <h2 className={styles.title}>Your Neighbors Have Trusted Us Since 1998</h2>
        <h3 className={styles.subtitle}>Local expertise you can count on</h3>
        
        <div className={styles.trustPoints}>
          <ul className={styles.pointsList}>
            <li>Protecting Northeast Ohio homes for over 25 years</li>
            <li>Recognized as the highest volume Heater Cap dealer in the country</li>
            <li>A+ Rating with the Better Business Bureau for over 15 years without a formal complaint</li>
            <li>Hundreds of 5-star reviews from your neighbors</li>
          </ul>
        </div>
        
        <div className={styles.ownerMessage}>
          <h4 className={styles.messageTitle}>A Personal Message From Our Owner</h4>
          <div className={styles.messageContent}>
            <div className={styles.ownerImage}>
              <img src="/assets/owner-photo.jpg" alt="Company Owner" />
            </div>
            <div className={styles.messageText}>
              <p>
                "I joined Gutter Cover Co in 2006 as an estimator and salesperson, having worked in the industry since 2001. 
                When the previous owner retired in 2019, I took ownership because I believe in our approach: 
                providing exceptional solutions with honesty and integrity.
              </p>
              <p>
                We're not like the big companies with high-pressure sales tactics and confusing pricing games. 
                We're your neighbors, focused on building relationships through quality work and fair prices.
              </p>
              <p>
                I personally guarantee you'll receive the best gutter protection available, 
                installed with care by skilled professionals who respect your home and your time."
              </p>
            </div>
          </div>
        </div>
        
        <div className={styles.ctaContainer}>
          <button className={styles.ctaButton}>Get Started Today</button>
        </div>
      </div>
    </section>
  );
};

export default TrustBuilding; 