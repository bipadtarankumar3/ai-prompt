'use client';

import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import SeoHeader from '../components/SeoHeader';
import TemplatesSection from '../components/TemplateCard';
import Footer from '../components/Footer';

export default function TemplatesPage() {
  const router = useRouter();

  const handleUseTemplate = (template) => {
    router.push(`/generator?template=${template.id}`);
  };

  return (
    <main>
      <SeoHeader pageKey="templates" />
      <Navbar />
      <div className="pt-12">
        <TemplatesSection onUseTemplate={handleUseTemplate} />
      </div>
      <Footer />
    </main>
  );
}
