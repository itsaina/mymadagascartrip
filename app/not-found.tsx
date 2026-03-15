export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626', marginBottom: '16px' }}>404 Page Not Found</h1>
        <p style={{ color: '#4b5563' }}>The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}
