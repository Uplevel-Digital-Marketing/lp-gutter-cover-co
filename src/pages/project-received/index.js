import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from '../../styles/ThankYou.module.css';
import Link from 'next/link';

const ProjectReceived = () => {
  // Project photos data using existing images
  const projectPhotos = [
    { id: 1, src: '/assets/gutter-guards/gutter-guards-2.webp', alt: 'Gutter guard installation on home' },
    { id: 2, src: '/assets/gutter-guards/gutter-guards-6.webp', alt: 'Close-up of gutter protection system' },
    { id: 3, src: '/assets/gutter-guards/gutter-guards-7.webp', alt: 'Gutter guard preventing leaf buildup' },
  ];
  
  // Sample reviews data
  const customerReviews = [
    {
      id: 1,
      name: 'Michael S.',
      location: 'Raleigh, NC',
      rating: 5,
      text: 'The installation was quick and professional. No more climbing ladders to clean gutters - what a relief!'
    },
    {
      id: 2,
      name: 'Jennifer L.',
      location: 'Cary, NC',
      rating: 5,
      text: 'Our home had serious issues with ice dams every winter. After installing these gutter guards, we haven\'t had a single problem. Highly recommended!'
    },
    {
      id: 3,
      name: 'Robert D.',
      location: 'Durham, NC',
      rating: 5,
      text: 'Great service from start to finish. The team was knowledgeable and helped us choose the right solution for our home.'
    }
  ];

  return (
    <div className={styles.pageContainer}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.thankYouContent}>
            <h1 className={styles.title}>Thank You!</h1>
            <div className={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z"></path>
              </svg>
            </div>
            <p className={styles.message}>
              Your information has been submitted successfully. One of our gutter protection specialists will contact you shortly to schedule your free consultation.
            </p>
            <p className={styles.submessage}>
              Thank you for choosing us for your gutter protection needs!
            </p>
            <div className={styles.actions}>
              <Link href="/" className={styles.button}>
                Return to Homepage
              </Link>
            </div>
          </div>
          
          {/* Project Photos Section */}
          <section className={styles.projectSection}>
            <h2 className={styles.sectionTitle}>Recent Projects</h2>
            <p className={styles.sectionDescription}>
              Take a look at some of our recent gutter protection installations
            </p>
            
            <div className={styles.photoGrid}>
              {projectPhotos.map(photo => (
                <div key={photo.id} className={styles.photoCard}>
                  <img 
                    src={photo.src} 
                    alt={photo.alt} 
                    className={styles.projectImage}
                  />
                </div>
              ))}
            </div>
          </section>
          
          {/* Customer Reviews Section */}
          <section className={styles.reviewsSection}>
            <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
            <p className={styles.sectionDescription}>
              Don't just take our word for it - hear from our satisfied customers
            </p>
            
            <div className={styles.reviewsGrid}>
              {customerReviews.map(review => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerInfo}>
                      <h3 className={styles.reviewerName}>{review.name}</h3>
                      <p className={styles.reviewerLocation}>{review.location}</p>
                    </div>
                    <div className={styles.rating}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? styles.starFilled : styles.starEmpty}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className={styles.reviewText}>"{review.text}"</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectReceived; 