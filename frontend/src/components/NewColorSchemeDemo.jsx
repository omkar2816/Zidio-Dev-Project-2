import React from 'react';

const NewColorSchemeDemo = () => {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
        New Color Scheme Demo
      </h1>
      
      {/* Background demonstration */}
      <div className="bg-light-background dark:bg-dark-background p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
          Background Colors
        </h2>
        <p className="text-light-text dark:text-dark-text">
          This div uses the new background colors from the color scheme.
        </p>
      </div>

      {/* Card demonstration */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-card rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
          Card Example
        </h2>
        <p className="text-light-text dark:text-dark-text/80 mb-4">
          This is a sample card using the new color scheme. It demonstrates the card background,
          border, and text colors that adapt automatically to light and dark modes.
        </p>
        
        {/* Accent button */}
        <button className="px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90 transition-opacity">
          Read More
        </button>
      </div>

      {/* Multiple cards demonstration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
            Sample Blog Post
          </h3>
          <p className="text-light-text dark:text-dark-text/80 mb-4">
            This is a sample blog description that shows how the new color scheme works
            with multiple cards and content.
          </p>
          <button className="px-3 py-1 bg-light-accent dark:bg-dark-accent text-white text-sm rounded">
            View Post
          </button>
        </div>

        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
            Another Example
          </h3>
          <p className="text-light-text dark:text-dark-text/80 mb-4">
            The colors automatically switch between light and dark themes,
            ensuring perfect readability in both modes.
          </p>
          <button className="px-3 py-1 bg-light-accent dark:bg-dark-accent text-white text-sm rounded">
            Learn More
          </button>
        </div>
      </div>

      {/* Usage instructions */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-card rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
          How to Use the New Color Scheme
        </h2>
        <div className="space-y-2 text-light-text dark:text-dark-text/90">
          <p><strong>Backgrounds:</strong> Use <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">bg-light-background dark:bg-dark-background</code></p>
          <p><strong>Cards:</strong> Use <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">bg-light-card dark:bg-dark-card</code></p>
          <p><strong>Text:</strong> Use <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">text-light-text dark:text-dark-text</code></p>
          <p><strong>Borders:</strong> Use <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">border-light-border dark:border-dark-border</code></p>
          <p><strong>Accents:</strong> Use <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">bg-light-accent dark:bg-dark-accent</code></p>
        </div>
      </div>
    </div>
  );
};

export default NewColorSchemeDemo;