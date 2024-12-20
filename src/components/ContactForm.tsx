import React from 'react';

const ContactForm = () => {
  return (
    <>
      {/* Hidden form for Netlify bots */}
      <form name="contact" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <textarea name="message"></textarea>
      </form>

      {/* Actual form that users will see */}
      <form name="contact" method="post" className="w-full max-w-md mx-auto space-y-4">
        <input type="hidden" name="form-name" value="contact" />
        
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            className="w-full p-2 rounded bg-black/5 border border-gray-300 outline-none"
          />
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full p-2 rounded bg-black/5 border border-gray-300 outline-none"
          />
        </div>

        <div>
          <textarea
            name="message"
            placeholder="Message"
            required
            rows={4}
            className="w-full p-2 rounded bg-black/5 border border-gray-300 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </form>
    </>
  );
};

export default ContactForm;