import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function ContactUsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Add form submission logic here
    setTimeout(() => setIsSubmitting(false), 1500);
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: <FaFacebook className="h-5 w-5 text-gray-700" />,
      url: "https://facebook.com/example",
    },
    {
      name: "Twitter",
      icon: <FaTwitter className="h-5 w-5 text-gray-700" />,
      url: "https://twitter.com/example",
    },
    {
      name: "Instagram",
      icon: <FaInstagram className="h-5 w-5 text-gray-700" />,
      url: "https://instagram.com/example",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="h-5 w-5 text-gray-700" />,
      url: "https://linkedin.com/company/example",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 pt-16 pb-20 md:py-12">
      <div className="text-center mb-10 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We're here to help with any questions you may have about our services.
          Reach out to us and we'll respond as soon as we can.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
        <div className="max-w-lg p-4 md:p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-md md:text-lg text-gray-600 leading-relaxed mb-6">
            We'd love to hear from you! Whether you have a question, feedback,
            or just want to say hello, please fill out the form.
          </p>

          <div className="grid grid-cols-1 gap-5 mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-2.5 rounded-full">
                <FaEnvelope className="h-5 w-5 text-gray-800" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Email</h3>
                <p className="text-gray-600">contact@example.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-2.5 rounded-full">
                <FaPhone className="h-5 w-5 text-gray-800" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Phone</h3>
                <p className="text-gray-600">+(383) 123-4567</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-2.5 rounded-full">
                <FaMapMarkerAlt className="h-5 w-5 text-gray-800" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Location</h3>
                <p className="text-gray-600">123 prishtine</p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="text-lg font-semibold mb-3">Connect with us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-2.5 rounded-full"
                  aria-label={`Visit our ${social.name} page`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 transform transition-all border border-gray-100 hover:border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Send us a message
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                required
                className="w-full rounded-md border-gray-300 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 shadow-sm"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                required
                className="w-full rounded-md border-gray-300 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 shadow-sm"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject
              </label>
              <Input
                type="text"
                id="subject"
                name="subject"
                className="w-full rounded-md border-gray-300 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 shadow-sm"
                placeholder="What is this regarding?"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                required
                className="w-full rounded-md border-gray-300 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 shadow-sm"
                placeholder="How can we help you?"
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-gray-900 border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-gray-900 underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-5 py-2.5 rounded-md font-medium text-white transition-all duration-200 ${
                isSubmitting
                  ? "bg-gray-400 cursor-wait"
                  : "bg-gray-900 hover:bg-black hover:shadow-md"
              }`}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            <p className="text-xs text-center text-gray-500 mt-3">
              We'll get back to you within 24-48 hours
            </p>
          </form>
        </div>
      </div>

      <div className="mt-16 border-t border-gray-100 pt-10">
        <h2 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                How do I get started?
              </h3>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
