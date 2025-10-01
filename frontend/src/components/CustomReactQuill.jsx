import React, { useRef, useEffect } from 'react';

// Import ReactQuill dynamically to avoid SSR issues
let ReactQuill;
if (typeof window !== 'undefined') {
  ReactQuill = require('react-quill');
}

const CustomReactQuill = ({ value, onChange, modules, className, ...props }) => {
  const quillRef = useRef(null);

  // Suppress ReactQuill findDOMNode warnings globally
  useEffect(() => {
    // Store original console methods
    const originalWarn = console.warn;
    const originalError = console.error;

    // Create custom warning filter
    const filterConsoleOutput = (originalMethod) => (...args) => {
      const message = String(args[0] || '');
      
      // Don't suppress if it's not a ReactQuill/findDOMNode warning
      if (
        !message.includes('findDOMNode') &&
        !message.includes('ReactQuill') &&
        !message.includes('Warning: findDOMNode')
      ) {
        originalMethod.apply(console, args);
      }
      // Otherwise, silently ignore ReactQuill warnings
    };

    // Apply filters
    console.warn = filterConsoleOutput(originalWarn);
    console.error = filterConsoleOutput(originalError);

    // Cleanup
    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  // Don't render anything on server-side
  if (typeof window === 'undefined' || !ReactQuill) {
    return (
      <div className="w-full h-40 border rounded p-3 bg-gray-50 flex items-center justify-center">
        <span className="text-gray-500">Loading editor...</span>
      </div>
    );
  }

  // Import the CSS after confirming we're on client side
  if (typeof window !== 'undefined') {
    require('react-quill/dist/quill.snow.css');
  }

  return (
    <div className="react-quill-wrapper">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        className={className}
        {...props}
      />
    </div>
  );
};

export default CustomReactQuill;