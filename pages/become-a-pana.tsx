import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import styles from '../styles/Affiliate.module.css';

const Affiliate: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/form/become-a-pana');
  }, [router]);

  return <></>;
};

// Force server-side rendering to ensure router is available
export async function getServerSideProps() {
  return { props: {} };
}

export default Affiliate;
