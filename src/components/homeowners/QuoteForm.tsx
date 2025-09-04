import React, { useState } from 'react';
import './QuoteForm.css';
import { FlowState } from './ConsultationFlow';
import vppLogo from '../../assets/icons/vpp-logo.jpeg';

interface QuoteFormProps {
  flowState: FlowState;
  onUpdate: (updates: Partial<FlowState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  flowState,
  onUpdate,
  onNext,
  onBack
}) => {
  const [formData, setFormData] = useState(flowState.userInfo);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const features = [
    {
      icon: '●',
      title: 'Harness Solar Power',
      description: 'Monitor your energy production and consumption in real-time.'
    },
    {
      icon: '●',
      title: 'Cloud-Based Management',
      description: 'Access your energy data securely from anywhere, anytime.'
    },
    {
      icon: '●',
      title: 'Smart Energy Insights',
      description: 'Receive personalized recommendations to optimize your savings.'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate({ userInfo: updated });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{3}-\d{3}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter phone in format: XXX-XXX-XXXX';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('phone', formatted);
  };

  return (
    <div className="quote-form">
      <div className="quote-layout">
        {/* Left Side - Features */}
        <div className="features-section">
          <div className="quote-hero">
            <h2 className="hero-title">
              Embark on a journey to effortless energy management
            </h2>
            <p className="hero-subtitle">
              Join Cosmos today and unlock a universe of smart solar services designed for you.
            </p>
          </div>
          
          <div className="features-list">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="illustration">
            <img src={vppLogo} alt="Solar Energy Illustration" className="illustration-image" />
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="form-section">
          <form onSubmit={handleSubmit} className="consultation-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="XXX-XXX-XXXX"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                type="email"
                id="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="terms-section">
              <p className="terms-text">
                Format: XXX-XXX-XXXX
              </p>
            </div>
            
            <div className="form-actions">
              <button type="button" className="back-btn" onClick={onBack}>
                Back
              </button>
              <button type="submit" className="create-account-btn">
                Create Your Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuoteForm;