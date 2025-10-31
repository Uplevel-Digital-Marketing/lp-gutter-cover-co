import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/PreQualificationForm.module.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { formatPhoneNumber } from '../utils/formatters';

const PreQualificationForm = () => {
  const router = useRouter();
  const addressInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    property_type: '',
    issue: '',
    details: '',
    // UTM tracking fields
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    utm_term: '',
    up_source: '',
  });
  
  // Initialize Google Places Autocomplete
  useEffect(() => {
    // Wait for Google Maps API to load
    const initAutocomplete = () => {
      try {
        if (typeof window !== 'undefined' &&
            window.google &&
            window.google.maps &&
            window.google.maps.places &&
            window.google.maps.places.Autocomplete &&
            addressInputRef.current) {

          const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
            componentRestrictions: { country: 'us' },
            fields: ['address_components', 'formatted_address'],
            types: ['address']
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place && place.formatted_address) {
              setFormData(prevState => ({
                ...prevState,
                address: place.formatted_address
              }));
            }
          });
        }
      } catch (error) {
        // Silently fail - address input will work as regular text input
        console.warn('Google Places API not available - using standard address input');
      }
    };

    // Try to initialize immediately
    initAutocomplete();

    // Also listen for Google Maps script load event
    if (typeof window !== 'undefined') {
      window.addEventListener('load', initAutocomplete);
      return () => window.removeEventListener('load', initAutocomplete);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount
  
  // Get UTM parameters from URL and store in cookies on component mount
  useEffect(() => {
    const utmParams = [
      'utm_source', 
      'utm_medium', 
      'utm_campaign', 
      'utm_content', 
      'utm_term',
      'up_source'
    ];
    
    const params = {};
    
    // Check for UTM parameters in URL
    utmParams.forEach(param => {
      if (router.query[param]) {
        params[param] = router.query[param];
        // Store in cookie for 30 days
        Cookies.set(param, router.query[param], { expires: 30 });
      } else if (Cookies.get(param)) {
        // If not in URL but in cookies, use cookie value
        params[param] = Cookies.get(param);
      }
    });
    
    // Update form data with UTM parameters
    if (Object.keys(params).length > 0) {
      setFormData(prevState => ({
        ...prevState,
        ...params
      }));
    }
  }, [router.query]);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';

      case 'phone':
        const digits = value.replace(/\D/g, '');
        if (!digits) return 'Phone number is required';
        if (digits.length < 10) return 'Phone number must be 10 digits';
        return '';

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';

      case 'address':
        if (!value.trim()) return 'Address is required';
        return '';

      case 'property_type':
        if (!value) return 'Please select a property type';
        return '';

      case 'issue':
        if (!value) return 'Please select your main issue';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate field on change if already touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
    
    if (name === 'phone') {
      // Format phone number as user types
      setFormData(prevState => ({
        ...prevState,
        [name]: formatPhoneNumber(value)
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['name', 'phone', 'address', 'property_type', 'issue'];

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    // Also validate email if provided
    if (formData.email) {
      const emailError = validateField('email', formData.email);
      if (emailError) newErrors.email = emailError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = ['name', 'phone', 'email', 'address', 'property_type', 'issue', 'details'];
    const touchedFields = {};
    allFields.forEach(field => touchedFields[field] = true);
    setTouched(touchedFields);

    // Validate all fields
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Send form data to webhook
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Redirect to project-received page with trailing slash
        router.push('/project-received/');
      } else {
        // Show error message to user
        alert('There was an error submitting your form. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      alert('There was an error submitting your form. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.formSection} id="contact">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Request Your Free Consultation & Estimate</h2>
        <p className={styles.sectionDescription}>
          Fill out the form below and a member of our team will contact you to schedule your free, 
          no-pressure consultation. We'll help you find the right solution for your home's specific needs.
        </p>
        
        <form className={styles.preQualForm} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.name && errors.name ? styles.inputError : ''}
                required
                aria-invalid={touched.name && errors.name ? 'true' : 'false'}
                aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
              />
              {touched.name && errors.name && (
                <span className={styles.errorMessage} id="name-error" role="alert">
                  {errors.name}
                </span>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.phone && errors.phone ? styles.inputError : ''}
                placeholder="(555) 555-5555"
                required
                aria-invalid={touched.phone && errors.phone ? 'true' : 'false'}
                aria-describedby={touched.phone && errors.phone ? 'phone-error' : undefined}
              />
              {touched.phone && errors.phone && (
                <span className={styles.errorMessage} id="phone-error" role="alert">
                  {errors.phone}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.email && errors.email ? styles.inputError : ''}
                aria-invalid={touched.email && errors.email ? 'true' : 'false'}
                aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
              />
              {touched.email && errors.email && (
                <span className={styles.errorMessage} id="email-error" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address">Street Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                ref={addressInputRef}
                className={touched.address && errors.address ? styles.inputError : ''}
                placeholder="Start typing your address"
                required
                aria-invalid={touched.address && errors.address ? 'true' : 'false'}
                aria-describedby={touched.address && errors.address ? 'address-error' : undefined}
              />
              {touched.address && errors.address && (
                <span className={styles.errorMessage} id="address-error" role="alert">
                  {errors.address}
                </span>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="property_type">Property Type *</label>
              <select
                id="property_type"
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.property_type && errors.property_type ? styles.inputError : ''}
                required
                aria-invalid={touched.property_type && errors.property_type ? 'true' : 'false'}
                aria-describedby={touched.property_type && errors.property_type ? 'property-type-error' : undefined}
              >
                <option value="">Please Select</option>
                <option value="Single Family">Single Family Home</option>
                <option value="Multi Family">Multi-Family Home</option>
                <option value="Condo">Condo/Townhouse</option>
                <option value="Commercial">Commercial Property</option>
              </select>
              {touched.property_type && errors.property_type && (
                <span className={styles.errorMessage} id="property-type-error" role="alert">
                  {errors.property_type}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="issue">Main Gutter Issue *</label>
              <select
                id="issue"
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.issue && errors.issue ? styles.inputError : ''}
                required
                aria-invalid={touched.issue && errors.issue ? 'true' : 'false'}
                aria-describedby={touched.issue && errors.issue ? 'issue-error' : undefined}
              >
                <option value="">Please Select</option>
                <option value="Clogging">Clogged Gutters</option>
                <option value="Ice Dams">Ice Dams/Icicles</option>
                <option value="Overflowing">Overflowing Gutters</option>
                <option value="Damaged">Damaged/Sagging Gutters</option>
                <option value="Preventative">Preventative Protection</option>
                <option value="Other">Other</option>
              </select>
              {touched.issue && errors.issue && (
                <span className={styles.errorMessage} id="issue-error" role="alert">
                  {errors.issue}
                </span>
              )}
            </div>
            
            <div className={styles.formGroup + ' ' + styles.fullWidth}>
              <label htmlFor="details">Additional Details (optional)</label>
              <textarea 
                id="details" 
                name="details" 
                value={formData.details} 
                onChange={handleChange} 
                rows="4"
              ></textarea>
            </div>
          </div>
          
          <div className={styles.formFooter}>
            <p className={styles.privacyNote}>
              * Required fields. We respect your privacy and will never share your information.
            </p>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className={styles.loadingSpinner}>
                  <svg className={styles.spinnerIcon} viewBox="0 0 50 50">
                    <circle className={styles.spinnerPath} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                  </svg>
                  <span>Submitting...</span>
                </span>
              ) : (
                'Request Free Consultation'
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PreQualificationForm; 