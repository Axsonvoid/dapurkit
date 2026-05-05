import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email.includes('@')) {
      login(email);
      window.location.hash = '/'; // Redirect to home
    }
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-[60vh]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome to DapurKit</h2>
        <input name="email" type="email" placeholder="Enter your email" required className="w-full border p-3 rounded mb-4" />
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700">
          Continue as Guest
        </button>
      </form>
    </div>
  );
}