'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { FloatingLabelTextarea } from '@/components/ui/floating-label-textarea';

const EmailModal = () => {
  const [maxHeight, setMaxHeight] = useState(150);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  React.useEffect(() => {
    const updateMaxHeight = () => {
      setMaxHeight(window.innerHeight / 3);
    };

    updateMaxHeight();
    window.addEventListener('resize', updateMaxHeight);
    return () => window.removeEventListener('resize', updateMaxHeight);
  }, []);

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
    <Dialog>
      <DialogTrigger asChild>
        <button className="nav-link">Email</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 border border-neutral-700 text-neutral-200">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Get in Touch
          </DialogTitle>
          <DialogDescription className="font-light text-neutral-300">
            Send me a message and I&apos;ll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4 text-neutral-300">
          <div className="space-y-4 font-thin">
            <FloatingLabelInput
              id="name"
              name="name"
              type="text"
              label="Name"
              autoComplete="name"
              required
              disabled={status === 'submitting'}
              labelClassName="peer-focus:text-neutral-300"
              className="rounded-sm"
            />
            <FloatingLabelInput
              id="email"
              name="email"
              type="email"
              label="Email"
              autoComplete="email"
              required
              disabled={status === 'submitting'}
              labelClassName="peer-focus:text-neutral-300"
              className="rounded-sm"
            />
            <FloatingLabelTextarea
              id="message"
              name="message"
              label="Message"
              required
              disabled={status === 'submitting'}
              minHeight={150}
              maxHeight={maxHeight}
              labelClassName="peer-focus:text-neutral-300"
              className="rounded-sm"
            />
          </div>

          {status === 'success' && (
            <p className="text-green-500">Message sent successfully!</p>
          )}

          {status === 'error' && (
            <p className="text-red-500">Failed to send message. Please try again.</p>
          )}

          <DialogFooter>
            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="group relative px-8 py-3 text-base font-semibold text-neutral-900 bg-neutral-300 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-neutral-700 w-full sm:w-auto disabled:opacity-50"
            >
              <span className="relative z-10">
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailModal;