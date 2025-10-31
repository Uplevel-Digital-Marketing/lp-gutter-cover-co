import React from 'react';
import styles from '../styles/WhyActNow.module.css';

const WhyActNow = () => {
  return (
    <section className={styles.whyActNow}>
      <div className={styles.container}>
        <h2 className={styles.title}>Don't Wait Until Your Gutters Cause Serious Damage</h2>
        <h3 className={styles.subtitle}>Small gutter issues quickly become expensive home repairs</h3>
        
        <div className={styles.content}>
          <div className={styles.textContent}>
            <p className={styles.intro}>Left unaddressed, clogged gutters and ice dams can lead to:</p>
            <ul className={styles.damageList}>
              <li>Foundation damage costing $5,000-$15,000 to repair</li>
              <li>Interior water damage averaging $2,500-$7,500 per incident</li>
              <li>Mold remediation starting at $3,000</li>
              <li>Landscaping erosion requiring complete replanting</li>
            </ul>
            
            <div className={styles.offer}>
              <h4 className={styles.offerTitle}>Spring Special Offer</h4>
              <p className={styles.offerText}>
                Save $300 on any Combined Protection System installation
              </p>
              <p className={styles.offerTerms}>
                *Offer valid through June 30th - Limited appointments available*
              </p>
              <button className={styles.ctaButton}>
                Claim Your Free Estimate Today
              </button>
            </div>
          </div>
          
          <div className={styles.imageContent}>
            <img src="/assets/damage-example.jpg" alt="Water damage from clogged gutters" className={styles.damageImage} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyActNow; 