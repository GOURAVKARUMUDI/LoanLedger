import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Navbar from '../components/common/Navbar';

const Contact = () => {
    return (
        <div className="public-page-wrapper">
            <Navbar />
            <div className="public-page-content">
                <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 contact-grid">
                    {/* Contact Info */}
                    <div>
                        <div className="card p-8 mb-6">
                            <h2 className="text-xl font-bold mb-6">Get in Touch</h2>

                            <div className="flex items-start mb-6">
                                <div className="contact-icon-box contact-icon-box--info">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold">Email</h3>
                                    <p className="text-secondary">support@loanledger.com</p>
                                    <p className="text-secondary">info@loanledger.com</p>
                                </div>
                            </div>

                            <div className="flex items-start mb-6">
                                <div className="contact-icon-box contact-icon-box--success">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold">Phone</h3>
                                    <p className="text-secondary">+91 98765 43210</p>
                                    <p className="text-secondary">Mon-Fri, 9am - 6pm IST</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="contact-icon-box contact-icon-box--danger">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold">Address</h3>
                                    <p className="text-secondary">
                                        123 Financial District,<br />
                                        Vijayawada, Andhra Pradesh, India - 520001
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="card p-8">
                        <h2 className="text-xl font-bold mb-6">Send us a Message</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-secondary mb-1">Full Name</label>
                                <input type="text" className="input" placeholder="Your Name" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-secondary mb-1">Email Address</label>
                                <input type="email" className="input" placeholder="you@example.com" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-secondary mb-1">Subject</label>
                                <input type="text" className="input" placeholder="How can we help?" />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-secondary mb-1">Message</label>
                                <textarea className="input contact-textarea" rows="4" placeholder="Write your message here..."></textarea>
                            </div>
                            <button className="btn btn-primary contact-btn-full">
                                <Send size={16} className="mr-2" /> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
