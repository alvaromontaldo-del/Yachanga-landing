import { FeaturesClient } from './components/FeaturesClient';
import { FeaturesWorker } from './components/FeaturesWorker';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';

export default function App() {
  return (
    <div className="min-h-svh">
      <Hero />
      <main>
        <FeaturesWorker />
        <FeaturesClient />
      </main>
      <Footer />
    </div>
  );
}
