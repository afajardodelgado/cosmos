import React, { useMemo, useState } from 'react';
import './BecomePartner.css';
import backgroundImage from '../assets/images/Background-1Component4.png';

const BecomePartner: React.FC = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    businessTypes: [] as string[],
    businessTypeOther: '',
    serviceArea: '',
    monthlyInstalls: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const businessTypeOptions = [
    'Sell Qcells panels + storage',
    'Sell/Install solar under Axia by Qcells',
    'Boost revenue through Energy Services (SREC + VPP)',
    'Manage financing (loan/PPA) with EnFin',
  ];

  const monthlyInstallOptions = ['0–10', '11–50', '51–100', '100+'];

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const canSubmit = useMemo(() => {
    return (
      form.firstName.trim() &&
      form.lastName.trim() &&
      form.companyName.trim() &&
      isValidEmail(form.email) &&
      form.businessTypes.length > 0
    );
  }, [form]);

  const updateField = (name: string, value: any) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.companyName.trim()) e.companyName = 'Company name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!isValidEmail(form.email)) e.email = 'Enter a valid email';
    if (form.businessTypes.length === 0) e.businessTypes = 'Select at least one business type';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const key = 'partnerInquirySubmissions';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const payload = { ...form, submittedAt: new Date().toISOString() };
      localStorage.setItem(key, JSON.stringify([payload, ...existing]));
      setSubmitted(true);
      // Reset form
      setForm({
        firstName: '', lastName: '', companyName: '', email: '', phone: '',
        businessTypes: [], businessTypeOther: '', serviceArea: '', monthlyInstalls: '', message: ''
      });
      setErrors({});
    } catch (err) {
      console.error('Failed to save submission', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="become-partner-page" style={{backgroundImage: `url(${backgroundImage})`}}>
      <div className="become-partner-hero">
        <div className="become-partner-badge">Partnership Opportunity</div>
        <h1 className="become-partner-title">
          <span className="title-blue">Become</span> a Partner
        </h1>
        <p className="become-partner-subtitle">
          Join our growing network of solar professionals and unlock new opportunities
        </p>
      </div>
      
      <div className="become-partner-content">
        <div className="partner-info-card">
          <h2>Partnership Benefits</h2>
          <ul>
            <li>Access to premium solar products and solutions</li>
            <li>Technical training and certification programs</li>
            <li>Marketing support and sales resources</li>
            <li>Dedicated partner support team</li>
            <li>Competitive pricing and incentives</li>
          </ul>
          
          <div className="contact-info">
            <h3>Ready to Get Started?</h3>
            <p>Contact our partnership team to learn more about joining the Qcells partner network.</p>
            <a href="mailto:partnerships@qcells.com" className="contact-button">
              Contact Partnership Team
            </a>
          </div>
        </div>

        <div className="partner-form-card">
          <h2 className="form-title">Become A Partner</h2>
          <p className="form-description">
            Join the Cosmos ecosystem and grow your business with Qcells. Complete the form below and our team will follow up with next steps.
          </p>

          {submitted && (
            <div className="success-banner" role="status">
              Thanks! Your request has been received. Our team will reach out shortly.
            </div>
          )}

          <form className="partner-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input id="firstName" type="text" value={form.firstName} onChange={e => updateField('firstName', e.target.value)} required />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input id="lastName" type="text" value={form.lastName} onChange={e => updateField('lastName', e.target.value)} required />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="company">Company Name *</label>
                <input id="company" type="text" value={form.companyName} onChange={e => updateField('companyName', e.target.value)} required />
                {errors.companyName && <span className="error-message">{errors.companyName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input id="email" type="email" value={form.email} onChange={e => updateField('email', e.target.value)} required />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input id="phone" type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="(123) 456-7890" />
              </div>
              <div className="form-group">
                <label htmlFor="serviceArea">Service Area / Markets</label>
                <input id="serviceArea" type="text" value={form.serviceArea} onChange={e => updateField('serviceArea', e.target.value)} placeholder="e.g., CA, AZ, NV" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="businessTypes">Business Type(s) *</label>
                <select
                  id="businessTypes"
                  multiple
                  value={form.businessTypes}
                  onChange={(e) => {
                    const options = Array.from(e.target.selectedOptions).map(o => o.value);
                    updateField('businessTypes', options);
                  }}
                  aria-required="true"
                >
                  {businessTypeOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.businessTypes && <span className="error-message">{errors.businessTypes}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="monthlyInstalls">Approximate Monthly Installations</label>
                <select id="monthlyInstalls" value={form.monthlyInstalls} onChange={e => updateField('monthlyInstalls', e.target.value)}>
                  <option value="">Select...</option>
                  {monthlyInstallOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="businessTypeOther">Other (short answer)</label>
                <input id="businessTypeOther" type="text" value={form.businessTypeOther} onChange={e => updateField('businessTypeOther', e.target.value)} placeholder="Describe other business type..." />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="message">Message to the Cosmos by Qcells Team</label>
                <textarea id="message" rows={4} value={form.message} onChange={e => updateField('message', e.target.value)} placeholder="Share any details that will help our team..." />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={!canSubmit}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomePartner;