import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import styles from '@/styles/admin/Action.module.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import PanaButton from '@/components/PanaButton';

const Admin_Profile_Approve: NextPage = () => {
  const router = useRouter();
  const [actionResponse, setActionResponse] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [totalProfiles, setTotalProfiles] = useState(0);

  useEffect(() => {
    const { email, access: accessKey, action } = router.query;

    // Only proceed if we have the required query parameters
    if (action === 'approve' || action === 'decline') {
      axios
        .post(
          '/api/admin/profile/action',
          { email, access: accessKey, action },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          if (response?.data?.success) {
            const data = response.data.data[0];
            setActionResponse(data.message);
            setProfileUrl(`/profile/${data.handle}`);
            setProfileName(data.name);
            setTotalProfiles(data.total);
          } else {
            setActionResponse(response.data.error);
          }
        })
        .catch((error) => {
          console.error('Error processing profile action:', error);
          setActionResponse('An error occurred processing this action');
        });
    }
  }, [router.query]);

  return (
    <div className={styles.actionPage}>
      <p>
        <strong>Profile:</strong> {profileName}{' '}
      </p>
      <p>
        <strong>Status:</strong> {actionResponse}
      </p>
      <PanaButton href={profileUrl}>View Profile</PanaButton>
      <p>
        <small>
          Active Profiles:{' '}
          {totalProfiles > 0 ? totalProfiles : 'calculating...'}
        </small>
      </p>
    </div>
  );
};

// Force server-side rendering for this admin page
export async function getServerSideProps() {
  return { props: {} };
}

export default Admin_Profile_Approve;
