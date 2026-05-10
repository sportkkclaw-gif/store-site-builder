import type { GetServerSideProps } from 'next';

type VersionProps = {
  version: string;
  commit: string;
  commitShort: string;
  branch: string;
  deployment: string;
  buildTime: string;
};

export const getServerSideProps: GetServerSideProps<VersionProps> = async () => {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_COMMIT_SHA || 'local';
  const branch = process.env.VERCEL_GIT_COMMIT_REF || process.env.NEXT_PUBLIC_COMMIT_REF || 'local';
  const deployment = process.env.VERCEL_URL || 'local';
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString();
  return { props: { version: 'v0.2.3', commit, commitShort: commit.slice(0, 7), branch, deployment, buildTime } };
};

export default function VersionPage(props: VersionProps) {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 32, lineHeight: 1.7 }}>
      <h1>StoreSite Builder Version</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </main>
  );
}
