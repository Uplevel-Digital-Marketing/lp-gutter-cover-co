import React, { useState } from 'react';
import styles from '../styles/FAQ.module.css';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('gutter-guards');
  const [activeGutterGuards, setActiveGutterGuards] = useState(null);
  const [activeHeatedGutter, setActiveHeatedGutter] = useState(null);
  const [activeAboutUs, setActiveAboutUs] = useState(null);

  const gutterGuardsQuestions = [
    {
      question: 'Can you install over my existing gutters?',
      answer: 'In most cases, yes. During your consultation, we\'ll inspect your current gutters to ensure they\'re in good condition and properly pitched.'
    },
    {
      question: 'Do you need to remove my existing gutter guards?',
      answer: 'Yes, we remove all existing gutter covers before installation to ensure optimal performance.'
    },
    {
      question: 'How long does installation take?',
      answer: 'Most installations are completed in just one day, though this can vary based on your home\'s size and complexity.'
    },
    {
      question: 'What maintenance is required after installation?',
      answer: 'Our gutter guard comes with a lifetime transferral performance warranty.'
    }
  ];

  const heatedGutterQuestions = [
    {
      question: 'Do I need to heat all of my gutters?',
      answer: 'No, and this is where our approach differs from many competitors. We target only the problem areas where ice dams and icicles actually form. This saves you money on both installation and electricity costs.'
    },
    {
      question: 'Can you heat my existing gutter protection?',
      answer: 'In a lot of cases, yes. There are many existing gutter guards we can attach heater cap to. We are not able to confirm until the inspection.'
    },
    {
      question: 'Can I add heating later if I\'m not sure I need it now?',
      answer: 'Absolutely! One of the advantages of our system is its modularity. We can install Gutter Topper now, and if you experience ice dam issues in future winters, we can easily add Heater Cap.'
    },
    {
      question: 'How do I know if I need heated gutters?',
      answer: 'If you\'ve experienced ice dams, icicles forming on your roof edge, or water damage from winter ice buildup, you would likely benefit from our heated gutter solution. We can assess your specific situation during a free consultation.'
    }
  ];

  const aboutUsQuestions = [
    {
      question: 'How long has your company been in business?',
      answer: 'We\'ve been proudly serving Northeast Ohio homeowners since 1998, specializing in gutter protection systems designed for our unique climate.'
    },
    {
      question: 'Do you sell other services like all of the other home remodeling companies?',
      answer: 'No, we specialize in gutter protection, heater gutters and gutters.'
    },
    {
      question: 'What does your lifetime warranty cover?',
      answer: 'Our lifetime warranty for Gutter Topperguarantees that your gutters will remain free-flowing and functional for as long as you own your home. The warranty is also transferable to new homeowners.'
    },
    {
      question: 'Do you offer free estimates?',
      answer: 'Yes! We provide completely free, no-obligation consultations and estimates. We\'ll assess your home\'s specific needs and provide transparent pricing.'
    }
  ];

  const toggleGutterGuards = (index) => {
    setActiveGutterGuards(activeGutterGuards === index ? null : index);
  };

  const toggleHeatedGutter = (index) => {
    setActiveHeatedGutter(activeHeatedGutter === index ? null : index);
  };

  const toggleAboutUs = (index) => {
    setActiveAboutUs(activeAboutUs === index ? null : index);
  };

  const filterCategories = (category) => {
    setActiveCategory(category);
    // Reset all active items when changing categories
    setActiveGutterGuards(null);
    setActiveHeatedGutter(null);
    setActiveAboutUs(null);
  };

  // Count of questions by category
  const countGutterGuards = gutterGuardsQuestions.length;
  const countHeatedGutter = heatedGutterQuestions.length;
  const countAboutUs = aboutUsQuestions.length;

  return (
    <section className={styles.faq} id="faq">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Frequently Asked Questions</h2>
          <div className={styles.titleDivider}></div>
          <p className={styles.subtitle}>Everything you need to know about our gutter solutions</p>
        </div>
        
        <div className={styles.filterContainer}>
          <div className={styles.filterButtons}>
            <button 
              className={`${styles.filterButton} ${activeCategory === 'gutter-guards' ? styles.activeFilter : ''}`}
              onClick={() => filterCategories('gutter-guards')}
            >
              Gutter Guards <span className={styles.questionCount}>{countGutterGuards}</span>
            </button>
            <button 
              className={`${styles.filterButton} ${activeCategory === 'heated-gutter' ? styles.activeFilter : ''}`}
              onClick={() => filterCategories('heated-gutter')}
            >
              Heated Gutter <span className={styles.questionCount}>{countHeatedGutter}</span>
            </button>
            <button 
              className={`${styles.filterButton} ${activeCategory === 'about-us' ? styles.activeFilter : ''}`}
              onClick={() => filterCategories('about-us')}
            >
              About Us <span className={styles.questionCount}>{countAboutUs}</span>
            </button>
          </div>
        </div>
        
        <div className={styles.faqContent}>
          {activeCategory === 'gutter-guards' && (
            <div className={`${styles.faqSection} ${styles.activeFaqSection}`}>
              <div className={styles.questions}>
                {gutterGuardsQuestions.map((item, index) => (
                  <div key={`gutter-${index}`} className={styles.questionWrapper}>
                    <button 
                      className={`${styles.question} ${activeGutterGuards === index ? styles.active : ''}`}
                      onClick={() => toggleGutterGuards(index)}
                    >
                      {item.question}
                      <span className={styles.icon}>{activeGutterGuards === index ? '−' : '+'}</span>
                    </button>
                    <div 
                      className={`${styles.answer} ${activeGutterGuards === index ? styles.showAnswer : ''}`}
                      style={{ maxHeight: activeGutterGuards === index ? '500px' : '0' }}
                    >
                      <p>{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeCategory === 'heated-gutter' && (
            <div className={`${styles.faqSection} ${styles.activeFaqSection}`}>
              <div className={styles.questions}>
                {heatedGutterQuestions.map((item, index) => (
                  <div key={`heated-${index}`} className={styles.questionWrapper}>
                    <button 
                      className={`${styles.question} ${activeHeatedGutter === index ? styles.active : ''}`}
                      onClick={() => toggleHeatedGutter(index)}
                    >
                      {item.question}
                      <span className={styles.icon}>{activeHeatedGutter === index ? '−' : '+'}</span>
                    </button>
                    <div 
                      className={`${styles.answer} ${activeHeatedGutter === index ? styles.showAnswer : ''}`}
                      style={{ maxHeight: activeHeatedGutter === index ? '500px' : '0' }}
                    >
                      <p>{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeCategory === 'about-us' && (
            <div className={`${styles.faqSection} ${styles.activeFaqSection}`}>
              <div className={styles.questions}>
                {aboutUsQuestions.map((item, index) => (
                  <div key={`about-${index}`} className={styles.questionWrapper}>
                    <button 
                      className={`${styles.question} ${activeAboutUs === index ? styles.active : ''}`}
                      onClick={() => toggleAboutUs(index)}
                    >
                      {item.question}
                      <span className={styles.icon}>{activeAboutUs === index ? '−' : '+'}</span>
                    </button>
                    <div 
                      className={`${styles.answer} ${activeAboutUs === index ? styles.showAnswer : ''}`}
                      style={{ maxHeight: activeAboutUs === index ? '500px' : '0' }}
                    >
                      <p>{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.faqCta}>
          <p>Can't find what you're looking for?</p>
          <a href="#contact" className={styles.ctaButton}>Contact Us</a>
        </div>
      </div>
    </section>
  );
};

export default FAQ; 