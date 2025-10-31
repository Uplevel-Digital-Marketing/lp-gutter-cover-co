import React from 'react';
import styles from '../styles/ErrorBoundary.module.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>⚠️</div>
            <h1 className={styles.errorTitle}>Oops! Something went wrong</h1>
            <p className={styles.errorMessage}>
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <div className={styles.errorActions}>
              <button
                onClick={this.handleReset}
                className={styles.refreshButton}
              >
                Refresh Page
              </button>
              <a
                href="tel:4403368092"
                className={styles.callButton}
              >
                Call Us: (440) 336-8092
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
