import React from 'react';
import { Check, Star, Zap, Shield, Clock } from 'lucide-react';

interface UpgradeProps {
  onViewChange: (view: string) => void;
}

export const Upgrade: React.FC<UpgradeProps> = ({ onViewChange }) => {
  const features = {
    free: [
      '1 scan per account',
      'Basic text extraction',
      'Standard support',
      'Basic accuracy'
    ],
    premium: [
      'Unlimited scans',
      'Advanced AI processing',
      'Priority support',
      'Higher accuracy',
      'Document management',
      'Export options',
      'Batch processing',
      'API access'
    ]
  };

  const handleUpgrade = () => {
    // Simulate upgrade process
    alert('Upgrade feature would integrate with Stripe here!');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl inline-block mb-4">
          <Star className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Upgrade to Premium</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Unlock unlimited scans and advanced features to supercharge your handwriting conversion workflow
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
        {/* Free Plan */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Free</h3>
            <div className="text-4xl font-bold text-slate-800 mb-2">$0</div>
            <p className="text-slate-600">Perfect for trying out</p>
          </div>
          
          <ul className="space-y-3 mb-8">
            {features.free.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-slate-700">{feature}</span>
              </li>
            ))}
          </ul>
          
          <button
            disabled
            className="w-full bg-slate-100 text-slate-500 py-3 px-6 rounded-lg font-medium cursor-not-allowed"
          >
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg border-2 border-orange-200 p-8 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Premium</h3>
            <div className="text-4xl font-bold text-slate-800 mb-2">
              $19<span className="text-lg text-slate-600">/month</span>
            </div>
            <p className="text-slate-600">For professionals and teams</p>
          </div>
          
          <ul className="space-y-3 mb-8">
            {features.premium.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <span className="text-slate-700">{feature}</span>
              </li>
            ))}
          </ul>
          
          <button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:from-yellow-600 hover:to-orange-600"
          >
            Upgrade Now
          </button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Lightning Fast</h3>
          <p className="text-slate-600">
            Process unlimited documents with our advanced AI engine for instant results
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Enterprise Security</h3>
          <p className="text-slate-600">
            Your documents are processed securely with enterprise-grade encryption
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">24/7 Support</h3>
          <p className="text-slate-600">
            Get priority support from our expert team whenever you need help
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-xl mb-6 opacity-90">
          Join thousands of professionals who trust HandScript AI for their document conversion needs
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleUpgrade}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-slate-100"
          >
            Start Premium Trial
          </button>
          <button
            onClick={() => onViewChange('scanner')}
            className="border border-white text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-white/10"
          >
            Continue with Free
          </button>
        </div>
      </div>
    </div>
  );
};