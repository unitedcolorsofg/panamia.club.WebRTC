import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import styles from '../styles/Affiliate.module.css';
import { Local } from '@/lib/localstorage';

const Affiliate: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Handle affiliate code from query params
    const affiliate = router.query.code;
    if (affiliate) {
      console.log('affiliate', affiliate);
      Local.set('affiliate', affiliate.toString(), 24 * 14); // consume the affiliate code
    }

    // Handle redirect parameter
    const redirectTo = router.query.to;
    if (redirectTo) {
      const redirect_key = redirectTo.toString().toUpperCase();
      if (redirect_key == 'BECOMEAPANA') {
        console.log('Redirect:BECOMEAPANA');
        setTimeout(function () {
          router.replace('/form/become-a-pana');
        }, 250);
        return;
      }
    }

    // Default redirect to homepage
    router.replace('/');
  }, [router]);

  return <div className={styles.affiliatePage}>Redirecting...</div>;
};

// Force server-side rendering to ensure router.query is available
export async function getServerSideProps() {
  return { props: {} };
}

export default Affiliate;
