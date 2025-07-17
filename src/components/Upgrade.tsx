import React from 'react';
import { Check, Star, Zap, Shield, Clock, Sparkles, Crown } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-2xl inline-block mb-6 shadow-lg">
          <Crown className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-6">
          Upgrade to Premium
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Unlock unlimited scans, advanced AI processing, and professional features to supercharge your document conversion workflow
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-10">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Free</h3>
            <div className="text-5xl font-bold text-slate-800 mb-3">$0</div>
            <p className="text-slate-600 text-lg">Perfect for trying out</p>
          </div>
          
          <ul className="space-y-4 mb-10">
            {features.free.map((feature, index) => (
              <li key={index} className="flex items-center space-x-4">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-slate-700 font-medium">{feature}</span>
              </li>
            ))}
          </ul>
          
          <button
            disabled
            className="w-full bg-slate-100 text-slate-500 py-4 px-6 rounded-xl font-semibold cursor-not-allowed"
          >
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl border-2 border-amber-200 p-10 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1">
              <Sparkles className="w-4 h-4" />
              <span>Most Popular</span>
            </span>
              Most Popular
            </span>
          </div>
          
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Premium</h3>
            <div className="text-5xl font-bold text-slate-800 mb-3">
              $19<span className="text-xl text-slate-600">/month</span>
            </div>
            <p className="text-slate-600 text-lg">For professionals and teams</p>
          </div>
          
          <ul className="space-y-4 mb-10">
            {features.premium.map((feature, index) => (
              <li key={index} className="flex items-center space-x-4">
                <Check className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span className="text-slate-700 font-medium">{feature}</span>
              </li>
            ))}
          </ul>
          
          <button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-xl font-bold transition-all duration-200 hover:from-amber-600 hover:to-orange-600 hover:shadow-lg shadow-md flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Upgrade Now</span>
            Upgrade Now
          </button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="text-center">
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Zap className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Lightning Fast</h3>
          <p className="text-slate-600 text-lg leading-relaxed">
            Process unlimited documents with our advanced AI engine for instant, accurate results
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Enterprise Security</h3>
          <p className="text-slate-600 text-lg leading-relaxed">
            Your documents are processed securely with enterprise-grade encryption
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Clock className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">24/7 Support</h3>
          <p className="text-slate-600 text-lg leading-relaxed">
            Get priority support from our expert team whenever you need help
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center text-white shadow-2xl">
        <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
          Join thousands of professionals who trust HandScript AI for their document conversion needs
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleUpgrade}
            className="bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold transition-all duration-200 hover:bg-slate-100 hover:shadow-lg shadow-md flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Start Premium Trial</span>
            Start Premium Trial
          </button>
          <button
            onClick={() => onViewChange('scanner')}
            className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold transition-all duration-200 hover:bg-white/10 hover:shadow-lg"
          >
            Continue with Free
          </button>
        </div>
      </div>
    </div>
  );
};