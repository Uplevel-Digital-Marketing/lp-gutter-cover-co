import React from 'react';
import styles from '../styles/ServiceArea.module.css';

const ServiceArea = () => {
  const counties = [
    { 
      id: 'cuyahoga', 
      name: 'Cuyahoga County', 
      highlight: '#3182ce'
    },
    { 
      id: 'lake', 
      name: 'Lake County', 
      highlight: '#38b2ac'
    },
    { 
      id: 'geauga', 
      name: 'Geauga County', 
      highlight: '#4299e1'
    },
    { 
      id: 'summit', 
      name: 'Summit County', 
      highlight: '#319795'
    },
    { 
      id: 'portage', 
      name: 'Portage County', 
      highlight: '#2b6cb0'
    },
    { 
      id: 'medina', 
      name: 'Medina County', 
      highlight: '#2c7a7b'
    },
    { 
      id: 'lorain', 
      name: 'Lorain County', 
      highlight: '#3182ce'
    },
    { 
      id: 'erie', 
      name: 'Erie County', 
      highlight: '#4299e1'
    },
    { 
      id: 'huron', 
      name: 'Huron County', 
      highlight: '#319795'
    },
    { 
      id: 'ashtabula', 
      name: 'Ashtabula County', 
      highlight: '#2b6cb0'
    }
  ];
  
  return (
    <section className={styles.serviceArea}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Our Northeast Ohio Service Area</h2>
          <div className={styles.titleDivider}></div>
          <h3 className={styles.subtitle}>We proudly serve these communities with personalized, local expertise</h3>
        </div>
        
        <div className={styles.countiesContainer}>
          <div className={styles.countiesIntro}>
            <div className={styles.infoIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p>Our service area includes all of Northeast Ohio</p>
          </div>
          
          <div className={styles.countiesList}>
            {counties.map((county) => (
              <div 
                key={county.id}
                className={`${styles.countyItem}`}
                style={{ borderColor: county.highlight }}
              >
                <div className={styles.countyHeader}>
                  <h5 className={styles.countyName}>{county.name}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.specialization}>
          <div className={styles.specializationIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p>
            "We specialize in homes in established neighborhoods with mature trees - 
            exactly where gutter problems are most common in Northeast Ohio."
          </p>
        </div>
        
        <div className={styles.serviceCallout}>
          <p>Not sure if you're in our service area? <a href="/contact">Contact us</a> for a quick confirmation.</p>
        </div>
      </div>
    </section>
  );
};

export default ServiceArea; 