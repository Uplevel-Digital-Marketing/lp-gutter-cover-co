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
  const [submitError, setSubmitError] = useState('');
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
  
  // Business location for biasing autocomplete results
  const BUSINESS_LOCATION = { lat: 41.3683, lng: -82.1076 }; // 175 Abbe Rd S, Elyria, OH 44035

  // State for autocomplete predictions
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [sessionToken, setSessionToken] = useState(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const predictionsRef = useRef(null);

  // Helper function to wait for Google Maps API to load
  const waitForGoogleMaps = () => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window is not defined'));
        return;
      }

      // If already loaded
      if (window.google && window.google.maps && window.google.maps.importLibrary) {
        resolve();
        return;
      }

      // Wait for up to 10 seconds
      let attempts = 0;
      const maxAttempts = 50; // 50 * 200ms = 10 seconds

      const checkInterval = setInterval(() => {
        attempts++;

        if (window.google && window.google.maps && window.google.maps.importLibrary) {
          clearInterval(checkInterval);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          reject(new Error('Google Maps API failed to load after 10 seconds'));
        }
      }, 200);
    });
  };

  // Initialize session token on mount
  useEffect(() => {
    const initSessionToken = async () => {
      try {
        // Wait for Google Maps API to be available
        await waitForGoogleMaps();

        const { AutocompleteSessionToken } = await window.google.maps.importLibrary('places');
        setSessionToken(new AutocompleteSessionToken());
        setIsApiReady(true);
      } catch (error) {
        console.error('Failed to initialize Google Places API:', error);
        setIsApiReady(false);
      }
    };

    initSessionToken();
  }, []);

  // Fetch autocomplete predictions
  const fetchPredictions = async (input) => {
    if (!input || input.length < 3) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    // Don't fetch if API isn't ready
    if (!isApiReady || !sessionToken) {
      console.warn('Google Maps API not ready yet');
      return;
    }

    try {
      if (!window.google || !window.google.maps || !window.google.maps.importLibrary) {
        throw new Error('Google Maps API not available');
      }

      const { AutocompleteSuggestion } = await window.google.maps.importLibrary('places');

      const request = {
        input: input,
        locationRestriction: {
          west: BUSINESS_LOCATION.lng - 0.5,
          north: BUSINESS_LOCATION.lat + 0.5,
          east: BUSINESS_LOCATION.lng + 0.5,
          south: BUSINESS_LOCATION.lat - 0.5,
        },
        origin: BUSINESS_LOCATION,
        includedPrimaryTypes: ['street_address', 'premise'],
        language: 'en-US',
        region: 'us',
        sessionToken: sessionToken,
      };

      const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

      setPredictions(suggestions || []);
      setShowPredictions(true);
    } catch (error) {
      console.error('Failed to fetch autocomplete predictions:', error);
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  // Handle address input change
  const handleAddressChange = (e) => {
    const value = e.target.value;
    handleChange(e);
    fetchPredictions(value);
  };

  // Handle prediction selection
  const handlePredictionSelect = async (prediction) => {
    try {
      if (!window.google || !window.google.maps || !window.google.maps.importLibrary) {
        throw new Error('Google Maps API not available');
      }

      const place = prediction.placePrediction.toPlace();
      await place.fetchFields({
        fields: ['formattedAddress', 'displayName'],
      });

      setFormData(prevState => ({
        ...prevState,
        address: place.formattedAddress || place.displayName,
      }));

      setPredictions([]);
      setShowPredictions(false);

      // Create new session token for next search
      const { AutocompleteSessionToken } = await window.google.maps.importLibrary('places');
      setSessionToken(new AutocompleteSessionToken());
    } catch (error) {
      console.error('Failed to get place details:', error);
      // Still close the dropdown
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  // Close predictions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (predictionsRef.current && !predictionsRef.current.contains(event.target) &&
          addressInputRef.current && !addressInputRef.current.contains(event.target)) {
        setShowPredictions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
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

    // Clear previous submit error
    setSubmitError('');

    // Mark all fields as touched
    const allFields = ['name', 'phone', 'email', 'address', 'property_type', 'issue', 'details'];
    const touchedFields = {};
    allFields.forEach(field => touchedFields[field] = true);
    setTouched(touchedFields);

    // Validate all fields
    if (!validateForm()) {
      setSubmitError('Please fix the errors above before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send form data to API
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to project-received page with trailing slash
        router.push('/project-received/');
      } else {
        // Show error message inline based on field
        if (data.field && data.field !== 'submit' && data.field !== 'form') {
          // Field-specific error
          setErrors(prev => ({ ...prev, [data.field]: data.error }));
          setTouched(prev => ({ ...prev, [data.field]: true }));
          setSubmitError(`Please fix the ${data.field} field and try again.`);
        } else {
          // General submit error
          setSubmitError(data.error || 'Unable to submit form. Please try again or call us at (440) 336-8092.');
        }
        setIsSubmitting(false);
      }
    } catch (error) {
      setSubmitError('Network error. Please check your connection and try again.');
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

            <div className={styles.formGroup} style={{ position: 'relative' }}>
              <label htmlFor="address">Street Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleAddressChange}
                onBlur={handleBlur}
                ref={addressInputRef}
                className={touched.address && errors.address ? styles.inputError : ''}
                placeholder="Start typing your address"
                autoComplete="off"
                required
                aria-invalid={touched.address && errors.address ? 'true' : 'false'}
                aria-describedby={touched.address && errors.address ? 'address-error' : undefined}
                aria-autocomplete="list"
                aria-controls="address-predictions"
                aria-expanded={showPredictions}
              />
              {showPredictions && predictions.length > 0 && (
                <ul
                  id="address-predictions"
                  ref={predictionsRef}
                  className={styles.predictions}
                  role="listbox"
                >
                  {predictions.map((suggestion, index) => (
                    suggestion.placePrediction && (
                      <li
                        key={index}
                        onClick={() => handlePredictionSelect(suggestion)}
                        className={styles.predictionItem}
                        role="option"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handlePredictionSelect(suggestion);
                          }
                        }}
                      >
                        {suggestion.placePrediction.text.toString()}
                      </li>
                    )
                  ))}
                </ul>
              )}
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
            {submitError && (
              <div className={styles.submitErrorBanner} role="alert">
                <svg className={styles.errorIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p className={styles.submitErrorText}>{submitError}</p>
              </div>
            )}
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