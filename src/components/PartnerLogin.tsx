import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PartnerLogin.css';
import backgroundImage from '../assets/images/BACKGROUND_GROUP.png';
import partnerPortalIcon from '../assets/icons/partner_portal.png';
import { BackLink } from './common/BackLink';

interface LoginFormData {
  email: string;
  password: string;
}

const PartnerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoggingIn(true);

    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, any valid email/password combination will work
      console.log('Login attempt:', formData);
      
      // Navigate to partners page on successful login
      navigate('/partners/existing');
    } catch (error) {
      alert('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDemoAccess = () => {
    navigate('/partners/existing');
  };

  const handleSSOLogin = (provider: string) => {
    alert(`${provider} SSO coming soon!`);
  };

  return (
    <div className="partner-login-page" style={{backgroundImage: `url(${backgroundImage})`}}>
      <BackLink fallbackTo="/partners" />
      
      <div className="login-hero">
        <div className="login-badge">Partner Access</div>
        <h1 className="login-title">
          <span className="title-blue">Welcome</span> Back
        </h1>
        <p className="login-subtitle">
          Sign in to access your partner portal and resources
        </p>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <img src={partnerPortalIcon} alt="Partner Login" className="icon-image" />
            </div>
            <h2>Partner Login</h2>
          </div>

          {/* SSO Buttons Section */}
          <div className="sso-section">
            <button 
              type="button" 
              className="sso-button microsoft-button"
              onClick={() => handleSSOLogin('Microsoft')}
            >
              <div className="sso-icon microsoft-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect width="9" height="9" fill="currentColor"/>
                  <rect x="11" width="9" height="9" fill="currentColor"/>
                  <rect y="11" width="9" height="9" fill="currentColor"/>
                  <rect x="11" y="11" width="9" height="9" fill="currentColor"/>
                </svg>
              </div>
              Sign in with Microsoft
            </button>
            
            <button 
              type="button" 
              className="sso-button okta-button"
              onClick={() => handleSSOLogin('Okta')}
            >
              <div className="sso-icon okta-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="10" fill="currentColor"/>
                  <circle cx="10" cy="10" r="6" fill="#0A0A0A"/>
                </svg>
              </div>
              Sign in with Okta
            </button>
          </div>

          {/* Divider */}
          <div className="sso-divider">
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <div className="forgot-password">
              <button type="button" className="forgot-password-link" onClick={() => {}}>Forgot your password?</button>
            </div>
            
            <div className="demo-section">
              <div className="demo-divider">
                <span>or</span>
              </div>
              <button 
                type="button" 
                className="demo-button"
                onClick={handleDemoAccess}
              >
                Demo Access
              </button>
              <small className="demo-note">
                Explore the partner portal without logging in
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerLogin;