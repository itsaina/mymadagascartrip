export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f0fdf4, white)', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero Section */}
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#166534', marginBottom: '24px' }}>
          My Madagascar Trip
        </h1>
        <p style={{ fontSize: '20px', color: '#4b5563', maxWidth: '600px', margin: '0 auto 32px' }}>
          Découvrez les merveilles de Madagascar : destinations, circuits et activités authentiques pour un voyage inoubliable.
        </p>
        <button style={{ 
          padding: '16px 32px', 
          fontSize: '18px', 
          backgroundColor: '#16a34a', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          Explorer les destinations
        </button>
      </section>

      {/* Features */}
      <section style={{ padding: '64px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', textAlign: 'center', marginBottom: '48px', color: '#1f2937' }}>
          Nos Services
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {[
            { title: 'Circuits sur mesure', desc: 'Des itinéraires personnalisés selon vos envies' },
            { title: 'Guides locaux', desc: 'Des experts passionnés pour vous accompagner' },
            { title: 'Hébergements', desc: 'Une sélection d\'hôtels et lodges de qualité' },
          ].map((item, i) => (
            <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#15803d', marginBottom: '12px' }}>{item.title}</h3>
              <p style={{ color: '#4b5563' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#166534', color: 'white', padding: '32px 20px', textAlign: 'center' }}>
        <p>© 2025 My Madagascar Trip. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
