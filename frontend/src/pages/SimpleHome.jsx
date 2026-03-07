export default function SimpleHome() {
  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', fontSize: '2rem' }}>Simple Home Page</h1>
      <p style={{ color: '#666', fontSize: '1rem' }}>This is a test to see if React is rendering</p>
      <button 
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button clicked! React is working!')}
      >
        Test Button
      </button>
    </div>
  );
}
