import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Partners from './components/Partners';
import PartnerSelection from './components/PartnerSelection';
import PartnerLogin from './components/PartnerLogin';
import BecomePartner from './components/BecomePartner';
import ESPartnerPortal from './components/ESPartnerPortal';
import SRECLayout from './components/srec/SRECLayout';
import SRECDashboard from './components/srec/SRECDashboard';
import SRECRecords from './components/srec/SRECRecords';
import SRECInvoicing from './components/srec/SRECInvoicing';
import SRECTasks from './components/srec/SRECTasks';
import EnergyServicesDashboard from './components/energy-services/EnergyServicesDashboard';
import VPPLayout from './components/vpp/VPPLayout';
import VPPDashboard from './components/vpp/VPPDashboard';
import VPPDevices from './components/vpp/VPPDevices';
import VPPMonitoring from './components/vpp/VPPMonitoring';
import Fulfillment from './components/Fulfillment';
import Homeowners from './components/Homeowners';
import CustomerSupport from './components/CustomerSupport';
import CustomerSupportLayout from './components/support/CustomerSupportLayout';
import SupportDashboard from './components/support/SupportDashboard';
import MyTickets from './components/support/MyTickets';
import SubmitTicket from './components/support/SubmitTicket';
import NotFound from './components/NotFound';
import { SkipLink } from './components/common/SkipLink';
import SalesLayout from './components/sales/SalesLayout';
import BusinessSummary from './components/sales/BusinessSummary';
import LeadsManagement from './components/sales/LeadsManagement';
import OpportunitiesManagement from './components/sales/OpportunitiesManagement';
import SitesManagement from './components/sales/SitesManagement';
import InstallationLayout from './components/installation/InstallationLayout';
import InstallationSummary from './components/installation/InstallationSummary';
import ActiveProjects from './components/installation/ActiveProjects';
import ScheduledInstallations from './components/installation/ScheduledInstallations';
import CompletedProjects from './components/installation/CompletedProjects';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <SkipLink />
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
          {/* Energy Services Routes */}
          <Route path="/partners/es-portal/energy-services" element={
            <>
              <Header />
              <EnergyServicesDashboard />
            </>
          } />
          
          {/* SREC Management Routes - Updated paths */}
          <Route path="/partners/es-portal/energy-services/srec" element={
            <>
              <Header />
              <SRECLayout>
                <SRECDashboard />
              </SRECLayout>
            </>
          } />
          <Route path="/partners/es-portal/energy-services/srec/records" element={
            <>
              <Header />
              <SRECLayout>
                <SRECRecords />
              </SRECLayout>
            </>
          } />
          <Route path="/partners/es-portal/energy-services/srec/invoicing" element={
            <>
              <Header />
              <SRECLayout>
                <SRECInvoicing />
              </SRECLayout>
            </>
          } />
          <Route path="/partners/es-portal/energy-services/srec/tasks" element={
            <>
              <Header />
              <SRECLayout>
                <SRECTasks />
              </SRECLayout>
            </>
          } />
          
          {/* VPP Management Routes */}
          <Route path="/partners/es-portal/energy-services/vpp" element={
            <>
              <Header />
              <VPPLayout>
                <VPPDashboard />
              </VPPLayout>
            </>
          } />
          <Route path="/partners/es-portal/energy-services/vpp/devices" element={
            <>
              <Header />
              <VPPLayout>
                <VPPDevices />
              </VPPLayout>
            </>
          } />
          <Route path="/partners/es-portal/energy-services/vpp/monitoring" element={
            <>
              <Header />
              <VPPLayout>
                <VPPMonitoring />
              </VPPLayout>
            </>
          } />
          <Route path="/partners/es-portal/energy-services/vpp/events" element={
            <>
              <Header />
              <VPPLayout>
                <div style={{ padding: '50px', textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
                  <h2>Grid Events</h2>
                  <p>Grid events functionality coming soon...</p>
                </div>
              </VPPLayout>
            </>
          } />
          <Route path="/partners/es-portal/energy-services/vpp/earnings" element={
            <>
              <Header />
              <VPPLayout>
                <div style={{ padding: '50px', textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
                  <h2>Earnings & Payments</h2>
                  <p>Earnings tracking functionality coming soon...</p>
                </div>
              </VPPLayout>
            </>
          } />
          
          {/* Legacy SREC Routes (for backward compatibility) */}
          <Route path="/partners/es-portal/srec" element={
            <>
              <Header />
              <SRECLayout>
                <SRECDashboard />
              </SRECLayout>
            </>
          } />
          <Route path="/partners/es-portal/srec/records" element={
            <>
              <Header />
              <SRECLayout>
                <SRECRecords />
              </SRECLayout>
            </>
          } />
          <Route path="/partners/es-portal/srec/invoicing" element={
            <>
              <Header />
              <SRECLayout>
                <SRECInvoicing />
              </SRECLayout>
            </>
          } />
          <Route path="/partners/es-portal/srec/tasks" element={
            <>
              <Header />
              <SRECLayout>
                <SRECTasks />
              </SRECLayout>
            </>
          } />
          {/* Installation Management Routes */}
          <Route path="/partners/es-portal/installation" element={
            <>
              <Header />
              <InstallationLayout>
                <InstallationSummary />
              </InstallationLayout>
            </>
          } />
          <Route path="/partners/es-portal/installation/active" element={
            <>
              <Header />
              <InstallationLayout>
                <ActiveProjects />
              </InstallationLayout>
            </>
          } />
          <Route path="/partners/es-portal/installation/scheduled" element={
            <>
              <Header />
              <InstallationLayout>
                <ScheduledInstallations />
              </InstallationLayout>
            </>
          } />
          <Route path="/partners/es-portal/installation/completed" element={
            <>
              <Header />
              <InstallationLayout>
                <CompletedProjects />
              </InstallationLayout>
            </>
          } />
          <Route path="/partners/es-portal/installation/crew" element={
            <>
              <Header />
              <InstallationLayout>
                <div style={{ padding: '50px', textAlign: 'center', color: '#666' }}>
                  <h2>Crew Management</h2>
                  <p>Crew management functionality coming soon...</p>
                </div>
              </InstallationLayout>
            </>
          } />
          
          {/* Legacy Installation Route for backward compatibility */}
          <Route path="/partners/es-portal/fulfillment" element={
            <>
              <Header />
              <Fulfillment />
            </>
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
                <SitesManagement />
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
          
          {/* Customer Support Module Routes */}
          <Route path="/partners/es-portal/support" element={
            <>
              <Header />
              <CustomerSupportLayout>
                <SupportDashboard />
              </CustomerSupportLayout>
            </>
          } />
          <Route path="/partners/es-portal/support/submit" element={
            <>
              <Header />
              <CustomerSupportLayout>
                <SubmitTicket />
              </CustomerSupportLayout>
            </>
          } />
          <Route path="/partners/es-portal/support/tickets" element={
            <>
              <Header />
              <CustomerSupportLayout>
                <MyTickets />
              </CustomerSupportLayout>
            </>
          } />
          
          {/* Catch-all route for 404 pages */}
          <Route path="*" element={
            <>
              <Header />
              <NotFound />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
