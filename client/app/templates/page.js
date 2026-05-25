'use client';

import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import TemplatesSection from '../components/TemplateCard';
import Footer from '../components/Footer';

export default function TemplatesPage() {
  const router = useRouter();

  const handleUseTemplate = (template) => {
    router.push(`/generator?template=${template.id}`);
  };

  return (
    <main>
      <Navbar />
      <div className="pt-12">
        <TemplatesSection onUseTemplate={handleUseTemplate} />
      </div>
      <Footer />
    </main>
  );
}
