import { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  const is404 = statusCode === 404;
  const title = is404 ? '404 - Page Not Found' : `${statusCode || 500} - Server Error`;
  const heading = is404 ? 'Page Not Found' : 'Server Error';
  const message = is404
    ? "The page you're looking for doesn't exist or has been moved."
    : 'Something went wrong on our end. Please try again later.';

  return (
    <>
      <Head>
        <title>{title} | Pana Mia Club</title>
        <meta name="description" content={message} />
      </Head>
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            {statusCode || 500}
          </h1>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{heading}</h2>
          <p style={{ fontSize: '1.125rem', color: '#666', marginBottom: '2rem' }}>
            {message}
          </p>
          <Link href="/" style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.375rem',
            fontWeight: '500'
          }}>
            
              Go Back Home
            
          </Link>
        </div>
      </main>
    </>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
