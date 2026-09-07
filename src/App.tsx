import { AccountConfirmedHandler } from './components/AccountConfirmedHandler';
import { FeaturesClient } from './components/FeaturesClient';
import { FeaturesWorker } from './components/FeaturesWorker';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { ProfessionalsSearchSection } from './features/professionals';

export default function App() {
  return (
    <div className="min-h-svh">
      <AccountConfirmedHandler />
      <Hero />
      <main>
        <ProfessionalsSearchSection />
        <FeaturesWorker />
        <FeaturesClient />
      </main>
      <Footer />
    </div>
  );
}
