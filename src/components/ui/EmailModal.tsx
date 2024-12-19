'use client';

import React from 'react';
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
  const [maxHeight, setMaxHeight] = React.useState(150);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

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
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(Array.from(formData.entries()).reduce((acc, [key, value]) => {
          acc[key] = value as string;
          return acc;
        }, {} as Record<string, string>)).toString()
      });

      if (response.ok) {
        setIsSuccess(true);
        form.reset();
        setTimeout(() => {
          setIsOpen(false);
          setIsSuccess(false);
        }, 1000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Sorry, there was a problem submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hidden form for Netlify form detection */}
      <form 
        name="contact" 
        data-netlify="true" 
        netlify-honeypot="bot-field" 
        hidden
      >
        <input type="text" name="name" />
        <input type="email" name="email" />
        <textarea name="message"></textarea>
      </form>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <form 
            onSubmit={handleSubmit} 
            className="space-y-6 py-4 text-neutral-300"
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
          >
            {/* Required hidden inputs */}
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>
                Don&apos;t fill this out if you&apos;re human: <input name="bot-field" />
              </label>
            </p>

            <div className="space-y-4 font-thin">
              <FloatingLabelInput
                id="name"
                name="name"
                type="text"
                label="Name"
                autoComplete="name"
                required
                labelClassName="peer-focus:text-neutral-300"
                className="rounded-sm"
                disabled={isSubmitting}
              />
              <FloatingLabelInput
                id="email"
                name="email"
                type="email"
                label="Email"
                autoComplete="email"
                required
                labelClassName="peer-focus:text-neutral-300"
                className="rounded-sm"
                disabled={isSubmitting}
              />
              <FloatingLabelTextarea
                id="message"
                name="message"
                label="Message"
                required
                minHeight={150}
                maxHeight={maxHeight}
                labelClassName="peer-focus:text-neutral-300"
                className="rounded-sm"
                disabled={isSubmitting}
              />
            </div>
            <DialogFooter>
              <button 
                type="submit" 
                className="group relative px-8 py-3 text-base font-semibold text-neutral-900 bg-neutral-300 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-neutral-700 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                <span className="relative z-10">
                  {isSubmitting ? 'Sending...' : isSuccess ? 'Message Sent!' : 'Send Message'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmailModal;