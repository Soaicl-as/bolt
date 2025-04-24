import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';
import toast from 'react-hot-toast';
import { loginToInstagram } from '../services/instagramApi';
import LoadingSpinner from '../components/LoadingSpinner';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setLoggedIn } = useInstagram();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginToInstagram(username, password);
      
      if (response.success) {
        toast.success('Login successful!');
        setLoggedIn(true, username);
        navigate('/dashboard');
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 py-6 px-8">
          <div className="flex items-center justify-center">
            <Instagram className="text-white h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold text-white">Instagram DM Bot</h1>
          </div>
        </div>
        
        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Log in with your Instagram account</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Your Instagram username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Your Instagram password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : 'Log In'}
            </button>
          </form>
          
          <div className="mt-6">
            <p className="text-sm text-gray-600 text-center">
              By logging in, you agree to comply with Instagram's Terms of Service.
            </p>
            <p className="text-xs text-gray-500 mt-2 text-center">
              ⚠️ Using automation tools may violate Instagram's ToS and could result in account restrictions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;