import React, { useState } from 'react';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';

export const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => setIsLoginView(!isLoginView);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLoginView ? (
          <LoginPage onToggleView={toggleView} />
        ) : (
          <SignupPage onToggleView={toggleView} />
        )}
      </div>
    </div>
  );
};
