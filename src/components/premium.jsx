import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLongArrowAltLeft, FaCrown, FaCheck } from 'react-icons/fa';
import Topnev from '../partials/topnev';
import { API_BASE_URL } from '../utils/config';
import axios from 'axios';
import { toast } from 'react-toastify';

const Premium = React.memo(() => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleBack = () => {
        navigate(-1);
    };

    const handleUpgrade = async () => {
        setIsLoading(true);
        try {
            // This would integrate with a payment gateway in production
            toast.info('Premium upgrade feature coming soon!');
            // In production, you would redirect to payment gateway or handle subscription
        } catch (error) {
            console.error('Error upgrading to premium:', error);
            toast.error('Failed to upgrade to premium');
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        'Ad-free experience',
        'HD & 4K streaming',
        'Download movies & TV shows',
        'Early access to new releases',
        'Exclusive premium content',
        'Multiple device support',
        'Priority customer support',
        'Unlimited watchlist & collections'
    ];

    const plans = [
        {
            name: 'Monthly',
            price: '$9.99',
            period: 'per month',
            popular: false
        },
        {
            name: 'Yearly',
            price: '$79.99',
            period: 'per year',
            savings: 'Save 33%',
            popular: true
        }
    ];

    return (
        <div className='w-full min-h-screen py-3 select-auto overflow-hidden overflow-y-auto'>
            <div className='w-full flex items-center gap-4 px-[3%] mb-6'>
                <h1 onClick={handleBack} className='text-2xl font-semibold hover:text-blue-500 flex items-center text-zinc-400 cursor-pointer'>
                    <FaLongArrowAltLeft /> Premium
                </h1>
                <Topnev />
            </div>

            <div className="max-w-6xl mx-auto px-[3%]">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <FaCrown className="text-6xl text-yellow-400" />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Upgrade to Premium
                    </h1>
                    <p className="text-xl text-zinc-400 mb-8">
                        Unlock the full potential of Godcraft Movie with premium features
                    </p>
                </div>

                {/* Pricing Plans */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`bg-zinc-900 rounded-lg p-8 relative ${
                                plan.popular
                                    ? 'border-2 border-yellow-400 transform scale-105'
                                    : 'border border-zinc-700'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="mb-4">
                                <span className="text-4xl font-bold text-white">{plan.price}</span>
                                <span className="text-zinc-400 ml-2">{plan.period}</span>
                            </div>
                            {plan.savings && (
                                <p className="text-green-400 font-semibold mb-6">{plan.savings}</p>
                            )}
                            <button
                                onClick={handleUpgrade}
                                disabled={isLoading}
                                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                                    plan.popular
                                        ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                                        : 'bg-[#6556CD] text-white hover:bg-[#5546C0]'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isLoading ? 'Processing...' : 'Upgrade Now'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Features Section */}
                <div className="bg-zinc-900 rounded-lg p-8 mb-8">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">
                        Premium Features
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <FaCheck className="text-green-400 text-xl flex-shrink-0" />
                                <span className="text-zinc-300 text-lg">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-zinc-900 rounded-lg p-6 text-center">
                        <div className="text-4xl mb-4">🎬</div>
                        <h3 className="text-xl font-bold text-white mb-2">Unlimited Access</h3>
                        <p className="text-zinc-400">
                            Watch unlimited movies and TV shows without restrictions
                        </p>
                    </div>
                    <div className="bg-zinc-900 rounded-lg p-6 text-center">
                        <div className="text-4xl mb-4">📱</div>
                        <h3 className="text-xl font-bold text-white mb-2">Multi-Device</h3>
                        <p className="text-zinc-400">
                            Stream on all your devices - phone, tablet, TV, and computer
                        </p>
                    </div>
                    <div className="bg-zinc-900 rounded-lg p-6 text-center">
                        <div className="text-4xl mb-4">⭐</div>
                        <h3 className="text-xl font-bold text-white mb-2">Exclusive Content</h3>
                        <p className="text-zinc-400">
                            Access premium-only movies and early releases
                        </p>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-zinc-900 rounded-lg p-8">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        <div className="border-b border-zinc-700 pb-4">
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Can I cancel anytime?
                            </h3>
                            <p className="text-zinc-400">
                                Yes, you can cancel your premium subscription at any time. Your access will continue until the end of your billing period.
                            </p>
                        </div>
                        <div className="border-b border-zinc-700 pb-4">
                            <h3 className="text-xl font-semibold text-white mb-2">
                                What payment methods do you accept?
                            </h3>
                            <p className="text-zinc-400">
                                We accept all major credit cards, debit cards, and PayPal.
                            </p>
                        </div>
                        <div className="border-b border-zinc-700 pb-4">
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Is there a free trial?
                            </h3>
                            <p className="text-zinc-400">
                                Yes! New users get a 7-day free trial to experience all premium features.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Can I share my premium account?
                            </h3>
                            <p className="text-zinc-400">
                                Premium accounts support multiple devices, but sharing with others outside your household is not permitted.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

Premium.displayName = 'Premium';

export default Premium;
