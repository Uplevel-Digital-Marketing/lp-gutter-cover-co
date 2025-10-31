import React, { useState, useEffect } from 'react';
import styles from '../styles/SocialProof.module.css';
import Image from 'next/image';

const SocialProof = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const testimonials = [
    {
      stars: 5,
      quote: "After getting quotes from three companies, we chose Gutter Cover Company for their honest approach. The installation was perfect, and we've had zero issues with our gutters for the past three years.",
      author: "Margaret S.",
      location: "Beachwood"
    },
    {
      stars: 5,
      quote: "We had terrible ice dams that caused over $5,000 in interior damage. After installing the Heater Cap system, we haven't had a single problem.",
      author: "Thomas L.",
      location: "Mentor"
    },
    {
      stars: 5,
      quote: "I've had Gutter Topper for over 10 years now. It's outlasted my roof, and I haven't cleaned gutters in a decade!",
      author: "Linda D.",
      location: "Avon"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className={styles.socialProof} id="reviews">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>What Our Neighbors in Northeast Ohio Say</h2>
          <div className={styles.titleDivider}></div>
          <h3 className={styles.subtitle}>Real reviews from homeowners just like you</h3>
        </div>
        
        <div className={styles.testimonialWrapper}>
          <div className={styles.testimonialContainer}>
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`${styles.testimonial} ${activeTestimonial === index ? styles.active : ''}`}
              >
                <div className={styles.testimonialContent}>
                  <div className={styles.stars}>
                    {[...Array(testimonial.stars)].map((_, i) => (
                      <span key={i} className={styles.star}>★</span>
                    ))}
                  </div>
                  <div className={styles.quoteIcon}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11 7.5c0-1.375-1.125-2.5-2.5-2.5H4.5C3.125 5 2 6.125 2 7.5v4C2 12.875 3.125 14 4.5 14h2C6.125 14 6 13.875 6 13.5V10h1.5c0.562 0 1 0.438 1 1v4.5c0 0.562-0.438 1-1 1H2v3h5.5c1.938 0 3.5-1.562 3.5-3.5V7.5zM22 15.5c0 1.938-1.562 3.5-3.5 3.5H13v-3h5.5c0.562 0 1-0.438 1-1V10c0-0.562-0.438-1-1-1H17V13.5c0 0.375 0.125 0.5 0.5 0.5h-2c-1.375 0-2.5-1.125-2.5-2.5v-4C13 6.125 14.125 5 15.5 5h4C20.875 5 22 6.125 22 7.5V15.5z"/>
                    </svg>
                  </div>
                  <p className={styles.quote}>{testimonial.quote}</p>
                  <div className={styles.authorInfo}>
                    <div className={styles.authorImage}>
                      {testimonial.image ? (
                        <div className={styles.imageWrapper}>
                          <Image 
                            src={testimonial.image} 
                            alt={testimonial.author}
                            width={48}
                            height={48}
                            className={styles.avatar}
                          />
                        </div>
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          {testimonial.author.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className={styles.authorDetails}>
                      <p className={styles.author}>{testimonial.author}</p>
                      <p className={styles.location}>{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.testimonialControls}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`${styles.testimonialDot} ${activeTestimonial === index ? styles.activeDot : ''}`}
                onClick={() => setActiveTestimonial(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof; 