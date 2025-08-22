import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Partners from './components/Partners';
import PartnerSelection from './components/PartnerSelection';
import PartnerLogin from './components/PartnerLogin';
import BecomePartner from './components/BecomePartner';
import ESPartnerPortal from './components/ESPartnerPortal';
import SRECHome from './components/SRECHome';
import Fulfillment from './components/Fulfillment';
import Homeowners from './components/Homeowners';
import CustomerSupport from './components/CustomerSupport';
import SalesLayout from './components/sales/SalesLayout';
import BusinessSummary from './components/sales/BusinessSummary';
import LeadsManagement from './components/sales/LeadsManagement';
import OpportunitiesManagement from './components/sales/OpportunitiesManagement';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Hero />
            </>
          } />
          <Route path="/homeowners" element={<Homeowners />} />
          <Route path="/partners" element={
            <>
              <Header />
              <PartnerSelection />
            </>
          } />
          <Route path="/partners/login" element={
            <>
              <Header />
              <PartnerLogin />
            </>
          } />
          <Route path="/partners/existing" element={
            <>
              <Header />
              <Partners />
            </>
          } />
          <Route path="/partners/become" element={
            <>
              <Header />
              <BecomePartner />
            </>
          } />
          <Route path="/partners/es-portal" element={
            <>
              <Header />
              <ESPartnerPortal />
            </>
          } />
          <Route path="/partners/es-portal/srec" element={
            <>
              <Header />
              <SRECHome />
            </>
          } />
          <Route path="/partners/es-portal/installation" element={
            <Fulfillment />
          } />
          
          {/* Sales Management Routes */}
          <Route path="/partners/es-portal/sales" element={
            <>
              <Header />
              <SalesLayout>
                <BusinessSummary />
              </SalesLayout>
            </>
          } />
          <Route path="/partners/es-portal/sales/leads" element={
            <>
              <Header />
              <SalesLayout>
                <LeadsManagement />
              </SalesLayout>
            </>
          } />
          <Route path="/partners/es-portal/sales/opportunities" element={
            <>
              <Header />
              <SalesLayout>
                <OpportunitiesManagement />
              </SalesLayout>
            </>
          } />
          <Route path="/partners/es-portal/sales/sites" element={
            <>
              <Header />
              <SalesLayout>
                <div style={{ padding: '50px', textAlign: 'center', color: '#666' }}>
                  <h2>Sites Management</h2>
                  <p>Sites management functionality coming soon...</p>
                </div>
              </SalesLayout>
            </>
          } />
          <Route path="/partners/es-portal/sales/contacts" element={
            <>
              <Header />
              <SalesLayout>
                <div style={{ padding: '50px', textAlign: 'center', color: '#666' }}>
                  <h2>Contacts Management</h2>
                  <p>Contacts management functionality coming soon...</p>
                </div>
              </SalesLayout>
            </>
          } />
          
          <Route path="/support" element={
            <>
              <Header />
              <CustomerSupport />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
