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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(Array.from(formData.entries()).reduce((acc, [key, value]) => {
        acc[key] = value as string;
        return acc;
      }, {} as Record<string, string>)).toString()
    })
      .then(() => {
        setIsSuccess(true);
        form.reset();
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Sorry, there was a problem submitting your message. Please try again.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      {/* Hidden form for Netlify detection - required for JavaScript-rendered forms */}
      <form 
        name="contact" 
        data-netlify="true" 
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
          {!isSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Get in Touch
                </DialogTitle>
                <DialogDescription className="font-light text-neutral-300">
                  Send me a message and I&apos;ll get back to you as soon as possible.
                </DialogDescription>
              </DialogHeader>
              <form 
                name="contact"
                method="POST"
                data-netlify="true"
                className="space-y-6 py-4 text-neutral-300"
                onSubmit={handleSubmit}
              >
                {/* Required for JavaScript-rendered forms */}
                <input type="hidden" name="form-name" value="contact" />
                
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
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </DialogFooter>
              </form>
            </>
          ) : (
            <div className="py-12 text-center">
              <h3 className="text-xl font-semibold mb-2">Thank you!</h3>
              <p className="text-neutral-300 mb-6">Your message has been sent successfully.</p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setIsOpen(false);
                }}
                className="text-neutral-300 hover:text-white underline"
              >
                Close
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmailModal;