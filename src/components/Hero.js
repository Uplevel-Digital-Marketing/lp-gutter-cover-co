import styles from '../styles/Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.badge}>Northeast Ohio's #1 Gutter Protection</div>
          <h1>Stop Cleaning Your Gutters & Prevent Winter Ice Damage</h1>
          <h2>Permanent Solutions for Northeast Ohio Homes Since 1998</h2>
          <p>
            We're local experts who understand Northeast Ohio's unique challenges 
            with clogged gutters and winter ice dams. Our permanent solutions keep 
            you off the ladder for good.
          </p>
          <div className={styles.ctaContainer}>
            <a href="#contact" className={styles.ctaButton}>
              Get Your Free Estimate
              <span className={styles.arrowIcon}>→</span>
            </a>
            <div className={styles.guaranteeTag}>No-Pressure • No Obligation</div>
          </div>
          <div className={styles.familyNoteWrapper}>
            <p className={styles.familyNote}>
              "We're a family-owned business focused on your home's protection, not high-pressure sales tactics."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 