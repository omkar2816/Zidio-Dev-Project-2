// Synonym dictionary for search term expansion
const synonymDictionary = {
  // Technology synonyms
  "tech": ["technology", "technical", "engineering", "digital", "computer", "software", "hardware"],
  "technology": ["tech", "technical", "engineering", "digital", "innovation", "computing"],
  "programming": ["coding", "development", "software", "scripting", "engineering"],
  "coding": ["programming", "development", "scripting", "software engineering"],
  "development": ["programming", "coding", "building", "creating", "engineering"],
  "software": ["application", "app", "program", "system", "tool"],
  "app": ["application", "software", "program", "mobile app"],
  "web": ["website", "internet", "online", "digital", "browser"],
  "website": ["web", "site", "online", "digital platform"],
  "mobile": ["phone", "smartphone", "android", "ios", "app"],
  "ai": ["artificial intelligence", "machine learning", "ml", "deep learning"],
  "ml": ["machine learning", "ai", "artificial intelligence", "data science"],
  "database": ["db", "data storage", "sql", "nosql", "storage"],
  "api": ["interface", "endpoint", "service", "integration"],

  // Web Development synonyms
  "frontend": ["front-end", "client-side", "ui", "user interface", "presentation"],
  "backend": ["back-end", "server-side", "api", "database", "server"],
  "fullstack": ["full-stack", "full stack", "frontend backend", "complete development"],
  "react": ["reactjs", "react.js", "jsx", "hooks", "components"],
  "javascript": ["js", "ecmascript", "node", "nodejs", "es6"],
  "typescript": ["ts", "javascript", "typed javascript"],
  "css": ["styling", "styles", "design", "layout", "responsive"],
  "html": ["markup", "web structure", "dom", "elements"],
  "node": ["nodejs", "node.js", "server", "backend", "javascript"],

  // Design synonyms
  "design": ["ui", "ux", "interface", "layout", "visual", "graphic"],
  "ui": ["user interface", "interface", "design", "frontend", "visual"],
  "ux": ["user experience", "usability", "design", "interaction"],
  "responsive": ["mobile-friendly", "adaptive", "flexible", "cross-device"],

  // Career synonyms
  "career": ["job", "work", "profession", "employment", "opportunity"],
  "job": ["career", "work", "position", "employment", "role"],
  "interview": ["hiring", "recruitment", "job process", "career"],
  "salary": ["pay", "compensation", "income", "wages"],
  "remote": ["work from home", "distributed", "telecommute", "online work"],

  // Learning synonyms
  "tutorial": ["guide", "howto", "how-to", "lesson", "learning", "course"],
  "guide": ["tutorial", "howto", "how-to", "instructions", "manual"],
  "learning": ["education", "study", "tutorial", "course", "skill"],
  "course": ["class", "tutorial", "learning", "education", "training"],
  "beginner": ["starter", "newbie", "basic", "intro", "introduction"],
  "advanced": ["expert", "professional", "complex", "sophisticated"],

  // Data Science synonyms
  "data": ["information", "analytics", "statistics", "dataset"],
  "analytics": ["data analysis", "statistics", "metrics", "insights"],
  "visualization": ["charts", "graphs", "plotting", "visual data"],
  "python": ["py", "scripting", "programming", "data science"],

  // DevOps synonyms
  "devops": ["deployment", "ci/cd", "automation", "infrastructure"],
  "docker": ["container", "containerization", "deployment"],
  "kubernetes": ["k8s", "orchestration", "container management"],
  "cloud": ["aws", "azure", "gcp", "hosting", "server"],
  "deployment": ["release", "publish", "launch", "production"],

  // Framework synonyms
  "framework": ["library", "tool", "platform", "structure"],
  "library": ["framework", "package", "module", "tool"],
  "angular": ["ng", "angular.js", "spa", "typescript"],
  "vue": ["vuejs", "vue.js", "frontend", "spa"],
  "nextjs": ["next.js", "react", "ssr", "static site"],

  // Common terms
  "build": ["create", "develop", "make", "construct"],
  "create": ["build", "make", "develop", "generate"],
  "optimize": ["improve", "enhance", "performance", "speed up"],
  "debug": ["troubleshoot", "fix", "error", "bug"],
  "security": ["safety", "protection", "encryption", "auth"],
  "performance": ["speed", "optimization", "efficiency", "fast"],
  "testing": ["qa", "quality assurance", "unit test", "debugging"],
};

// Function to expand search terms with synonyms
export const expandSearchTerm = (searchTerm) => {
  if (!searchTerm || searchTerm.trim().length === 0) {
    return [];
  }

  const term = searchTerm.toLowerCase().trim();
  const expandedTerms = new Set([term]);

  // Split multi-word terms and process each word
  const words = term.split(/\s+/);
  
  words.forEach(word => {
    if (synonymDictionary[word]) {
      synonymDictionary[word].forEach(synonym => {
        expandedTerms.add(synonym.toLowerCase());
      });
    }
    
    // Also check if the word appears as a synonym and add its key
    Object.entries(synonymDictionary).forEach(([key, synonyms]) => {
      if (synonyms.some(synonym => synonym.toLowerCase().includes(word))) {
        expandedTerms.add(key);
        // Add other synonyms from the same group
        synonyms.forEach(synonym => expandedTerms.add(synonym.toLowerCase()));
      }
    });
  });

  return Array.from(expandedTerms);
};

// Function to get search suggestions based on partial input
export const getSearchSuggestions = (partialTerm) => {
  if (!partialTerm || partialTerm.trim().length < 2) {
    return [];
  }

  const term = partialTerm.toLowerCase().trim();
  const suggestions = new Set();

  // Find matches in dictionary keys
  Object.keys(synonymDictionary).forEach(key => {
    if (key.toLowerCase().includes(term)) {
      suggestions.add(key);
      // Add some popular synonyms
      synonymDictionary[key].slice(0, 2).forEach(synonym => {
        suggestions.add(synonym);
      });
    }
  });

  // Find matches in synonym values
  Object.entries(synonymDictionary).forEach(([key, synonyms]) => {
    synonyms.forEach(synonym => {
      if (synonym.toLowerCase().includes(term)) {
        suggestions.add(synonym);
        suggestions.add(key);
      }
    });
  });

  return Array.from(suggestions)
    .filter(suggestion => suggestion.toLowerCase() !== term)
    .slice(0, 8); // Limit to 8 suggestions
};

// Function to highlight matching terms in search results
export const highlightSearchTerms = (text, searchTerms) => {
  if (!text || !searchTerms || searchTerms.length === 0) {
    return text;
  }

  let highlightedText = text;
  const expandedTerms = searchTerms.flatMap(term => expandSearchTerm(term));

  expandedTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
  });

  return highlightedText;
};

// Function to calculate search relevance score
export const calculateRelevanceScore = (text, searchTerms) => {
  if (!text || !searchTerms || searchTerms.length === 0) {
    return 0;
  }

  const expandedTerms = searchTerms.flatMap(term => expandSearchTerm(term));
  const textLower = text.toLowerCase();
  let score = 0;

  expandedTerms.forEach(term => {
    const termLower = term.toLowerCase();
    
    // Exact match gets highest score
    if (textLower.includes(searchTerms[0]?.toLowerCase())) {
      score += 10;
    }
    
    // Synonym matches get lower score
    if (textLower.includes(termLower)) {
      score += 5;
    }
    
    // Partial matches get minimal score
    const words = termLower.split(/\s+/);
    words.forEach(word => {
      if (textLower.includes(word)) {
        score += 1;
      }
    });
  });

  return score;
};

export default {
  expandSearchTerm,
  getSearchSuggestions,
  highlightSearchTerms,
  calculateRelevanceScore
};