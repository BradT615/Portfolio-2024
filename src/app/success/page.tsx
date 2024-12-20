export default function Success() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Message Sent!</h1>
        <p className="mb-4">Thank you for your message. I'll get back to you soon.</p>
        <a 
          href="/"
          className="text-blue-500 hover:text-blue-600"
        >
          Return to Home
        </a>
      </div>
    );
  }