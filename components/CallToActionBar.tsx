'use client';

import { useState } from 'react';
import styles from './CallToActionBar.module.css';
import SignupModal from './SignupModal';
import { Button } from '@/components/ui/button';

export default function CallToActionBar() {
  // Check if hostname contains "panamia.club" (only runs once during initialization)
  const [isProductionSite] = useState(() => {
    if (typeof window === 'undefined') return true; // Default during SSR
    return window.location.hostname.includes('panamia.club');
  });

  return (
    <div className={styles.callToAction}>
      {isProductionSite ? (
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <span className="hidden-sm">Stay updated on PanaMia! &nbsp;</span>
          <Button
            variant="default"
            size="default"
            className="bg-gradient-to-r from-pink-500 to-purple-600 font-semibold text-white shadow-lg hover:from-pink-600 hover:to-purple-700"
            asChild
          >
            <a href="#newsletter-signup">Sign Up for our Newsletter</a>
          </Button>
        </div>
      ) : (
        <div className="-ml-40 flex flex-col items-start gap-2 sm:ml-0 sm:flex-row sm:items-center">
          <span className="text-lg font-bold">
            You are visiting a test site!
          </span>
          <Button
            variant="default"
            size="default"
            className="bg-gradient-to-r from-pink-500 to-purple-600 font-semibold text-white shadow-lg hover:from-pink-600 hover:to-purple-700"
            asChild
          >
            <a href="https://www.panamia.club">Visit Panamia Club</a>
          </Button>
        </div>
      )}
    </div>
  );
}
