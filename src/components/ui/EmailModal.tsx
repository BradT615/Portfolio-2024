'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { FloatingLabelTextarea } from '@/components/ui/floating-label-textarea';

interface EmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

const CONTACT_FORM_SUBMITTED_KEY = 'contactFormSubmitted';

const Toast = ({ message, type, onClose }: Toast & { onClose: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const fadeOutTimer = setTimeout(() => setIsVisible(false), 2500);
    const closeTimer = setTimeout(onClose, 3000);
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg transition-all duration-500 ease-in-out 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}
        max-w-[90vw] sm:max-w-md`}
    >
      {message}
    </div>
  );
};

const EmailModal = ({ open, onOpenChange }: EmailModalProps) => {
  const [maxHeight, setMaxHeight] = useState(150);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    const updateMaxHeight = () => {
      const vh = window.innerHeight;
      setMaxHeight(Math.min(vh * 0.3, 300));
    };

    const checkSubmissionStatus = () => {
      const submitted = sessionStorage.getItem(CONTACT_FORM_SUBMITTED_KEY) === 'true';
      setAlreadySubmitted(submitted);
    };

    updateMaxHeight();
    checkSubmissionStatus();
    window.addEventListener('resize', updateMaxHeight);
    return () => window.removeEventListener('resize', updateMaxHeight);
  }, [open]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (alreadySubmitted) {
      showToast('You have already submitted a message this session.', 'error');
      onOpenChange(false);
      return;
    }

    setIsSubmitting(true);

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

      sessionStorage.setItem(CONTACT_FORM_SUBMITTED_KEY, 'true');
      setAlreadySubmitted(true);
      showToast('Message sent successfully!', 'success');
      form.reset();
      setTimeout(() => onOpenChange(false), 1000);
    } catch (error) {
      showToast(`Failed to send message: ${(error as Error).message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonText = () => {
    if (isSubmitting) return 'Sending...';
    if (alreadySubmitted) return 'Message Already Sent';
    return 'Send Message';
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] sm:w-[440px] md:w-[500px] max-h-[90vh] overflow-y-auto bg-[#101328] rounded-lg border-2 border-[#222441] shadow-2xl text-[#97a1b8] z-50 mt-16">
          <DialogHeader className="space-y-2 px-2 sm:px-4">
            <DialogTitle className="text-xl sm:text-2xl text-[#b6c2de]">
              Get in Touch
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base font-light text-[#97a1b8]">
              Send me a message and I&apos;ll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 px-2 sm:px-4">
            <div className="space-y-3 sm:space-y-4 font-thin">
              <FloatingLabelInput
                id="name"
                name="name"
                type="text"
                label="Name"
                autoComplete="name"
                required
                disabled={isSubmitting || alreadySubmitted}
                labelClassName="peer-focus:text-[#b6c2de] text-sm sm:text-base"
                className="rounded-sm"
              />
              <FloatingLabelInput
                id="email"
                name="email"
                type="email"
                label="Email"
                autoComplete="email"
                required
                disabled={isSubmitting || alreadySubmitted}
                labelClassName="peer-focus:text-[#b6c2de] text-sm sm:text-base"
                className="rounded-sm"
              />
              <FloatingLabelTextarea
                id="message"
                name="message"
                label="Message"
                required
                disabled={isSubmitting || alreadySubmitted}
                minHeight={120}
                maxHeight={maxHeight}
                labelClassName="peer-focus:text-[#b6c2de] text-sm sm:text-base"
                className="rounded-sm"
              />
            </div>

            <DialogFooter className="px-0 sm:px-0">
              <button 
                type="submit" 
                disabled={isSubmitting || alreadySubmitted}
                className="w-full py-2 bg-[#101328] border disabled:border-[#6d7484] border-[#868fa6] hover:border-[#b6c2de] rounded-md text-[#97a1b8] hover:text-[#b6c2de] text-sm sm:text-base"
              >
                <span className="relative z-10">
                  {getButtonText()}
                </span>
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </>
  );
};

export default EmailModal;