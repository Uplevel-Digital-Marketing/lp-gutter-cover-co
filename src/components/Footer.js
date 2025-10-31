import React from 'react';
import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <div className={styles.companyInfo}>
            <h2 className={styles.companyName}>Gutter Cover Company</h2>
            
            <div className={styles.contactSection}>
              <h3 className={styles.sectionTitle}>Contact Us</h3>
              <p className={styles.contactItem}>Phone: <a href="tel:4403368092">(440) 336-8092</a></p>
              <p className={styles.contactItem}>Email: <a href="mailto:info@guttercoversco.com">info@guttercoversco.com</a></p>
              <p className={styles.contactItem}>Cleveland, OH Area</p>
              <p className={styles.contactItem}>Hours: Monday-Friday 8am-5pm, Saturday 9am-1pm</p>
            </div>
          </div>
          
          <div className={styles.serviceSection}>
            <h3 className={styles.sectionTitle}>Service Area</h3>
            <p className={styles.serviceItem}>Cuyahoga County</p>
            <p className={styles.serviceItem}>Lake County</p>
            <p className={styles.serviceItem}>Geauga County</p>
            <p className={styles.serviceItem}>Summit County</p>
            <p className={styles.serviceItem}>Portage County</p>
            <p className={styles.serviceItem}>Medina County</p>
            <p className={styles.serviceItem}>Lorain County</p>
          </div>
          
          <div className={styles.linksSection}>
            <h3 className={styles.sectionTitle}>Quick Links</h3>
            <ul className={styles.linksList}>
              <li><a href="/">Home</a></li>
              <li><a href="#solutions">Solutions</a></li>
              <li><a href="#why-choose-us">Why Choose Us</a></li>
              <li><a href="#reviews">Reviews</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className={styles.copyright}>
          <p>© {new Date().getFullYear()} Gutter Cover Company. All rights reserved.</p>
          <p>Family owned and operated in Northeast Ohio since 1998.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 