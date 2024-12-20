import React, { useState } from 'react';

const ContactForm = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
      <div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          disabled={status === 'submitting'}
          className="w-full p-2 rounded bg-black/5 border border-gray-300 outline-none"
        />
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          disabled={status === 'submitting'}
          className="w-full p-2 rounded bg-black/5 border border-gray-300 outline-none"
        />
      </div>

      <div>
        <textarea
          name="message"
          placeholder="Message"
          required
          rows={4}
          disabled={status === 'submitting'}
          className="w-full p-2 rounded bg-black/5 border border-gray-300 outline-none"
        />
      </div>

      {status === 'success' && (
        <p className="text-green-500">Message sent successfully!</p>
      )}

      {status === 'error' && (
        <p className="text-red-500">Failed to send message. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
};

export default ContactForm;