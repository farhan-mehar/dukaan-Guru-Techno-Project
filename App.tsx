
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import WhyUs from './components/WhyUs';
import Pricing from './components/Pricing';
import Trust from './components/Trust';
import Footer from './components/Footer';
import WaitlistModal from './components/WaitlistModal';
import SetupFlow from './components/SetupFlow';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [shopInfo, setShopInfo] = useState<{name: string, stock: string} | null>(null);

  useEffect(() => {
    const savedSetup = localStorage.getItem('dukaan_guru_shop_setup');
    if (savedSetup) {
      try {
        setShopInfo(JSON.parse(savedSetup));
        setIsSetupComplete(true);
      } catch (e) {
        console.error("Setup data corrupt", e);
      }
    }
  }, []);

  const handleSetupComplete = (name: string, stock: string) => {
    const info = { name, stock };
    localStorage.setItem('dukaan_guru_shop_setup', JSON.stringify(info));
    setShopInfo(info);
    setIsSetupComplete(true);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!isSetupComplete) {
    return <SetupFlow onComplete={handleSetupComplete} />;
  }

  return (
    <div className="min-h-screen animate-scale-in">
      <Navbar onJoinClick={openModal} />
      <Hero onJoinClick={openModal} shopName={shopInfo?.name} />
      <ProblemSection />
      <HowItWorks shopName={shopInfo?.name} initialStock={shopInfo?.stock} />
      <Features />
      <WhyUs />
      <Pricing onJoinClick={openModal} />
      <Trust />
      <Footer onJoinClick={openModal} />
      
      {isModalOpen && <WaitlistModal onClose={closeModal} />}
    </div>
  );
};

export default App;
