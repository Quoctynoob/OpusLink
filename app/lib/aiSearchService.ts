// app/lib/aiSearchService.ts
import { RelatedJobsMap } from "../types";

// This is a simplified job title knowledge base
// In a production environment, this could be replaced with an actual AI model call
const JOB_TITLE_KNOWLEDGE_BASE: RelatedJobsMap = {
  "software developer": [
    "software engineer",
    "frontend developer",
    "backend developer",
    "full stack developer",
    "web developer",
    "mobile developer",
    "application developer",
    "programmer",
    "coder",
    "it developer"
  ],
  "frontend": [
    "frontend developer",
    "ui developer",
    "react developer",
    "angular developer",
    "vue developer",
    "javascript developer",
    "web developer",
    "ui engineer"
  ],
  "backend": [
    "backend developer",
    "server-side developer",
    "api developer",
    "java developer",
    "python developer",
    "node.js developer",
    "database developer"
  ],
  "data scientist": [
    "data analyst",
    "machine learning engineer",
    "ai researcher",
    "data engineer",
    "statistician",
    "business intelligence analyst"
  ],
  "devops": [
    "devops engineer",
    "site reliability engineer",
    "infrastructure engineer",
    "cloud engineer",
    "systems administrator",
    "platform engineer"
  ],
  "designer": [
    "ui designer",
    "ux designer",
    "web designer",
    "graphic designer",
    "product designer",
    "user experience designer"
  ],
  "manager": [
    "project manager",
    "product manager",
    "engineering manager",
    "technical lead",
    "team lead",
    "director",
    "coordinator"
  ],
  "marketing": [
    "marketing specialist",
    "digital marketer",
    "content marketer",
    "seo specialist",
    "social media manager",
    "brand manager",
    "marketing coordinator"
  ]
  // Add more job categories as needed
};

// A function to normalize text for comparison
const normalizeText = (text: string): string => {
  return text.toLowerCase().trim();
};

// A function to check if a job title contains any of the keywords
const jobTitleMatchesAnyKeyword = (jobTitle: string, keywords: string[]): boolean => {
  const normalizedJobTitle = normalizeText(jobTitle);
  return keywords.some(keyword => 
    normalizedJobTitle.includes(normalizeText(keyword))
  );
};

// Main function to enhance a search query
export function enhanceJobTitleQuery(query: string): string[] {
  // Normalize the query
  const normalizedQuery = normalizeText(query);
  
  // If the query is empty, return an empty array
  if (!normalizedQuery) {
    return [];
  }
  
  // Check if the query directly matches any key in our knowledge base
  for (const [key, relatedTitles] of Object.entries(JOB_TITLE_KNOWLEDGE_BASE)) {
    if (jobTitleMatchesAnyKeyword(normalizedQuery, [key])) {
      // Return the original query plus related job titles
      return [normalizedQuery, ...relatedTitles];
    }
    
    // Also check if the query matches any of the related titles
    if (jobTitleMatchesAnyKeyword(normalizedQuery, relatedTitles)) {
      // Return the original query, the key, and all related job titles
      return [normalizedQuery, key, ...relatedTitles];
    }
  }
  
  // If no match is found, just return the original query
  return [normalizedQuery];
}

// Function to generate an Adzuna API compatible query string from enhanced terms
export function generateEnhancedQueryString(enhancedTerms: string[]): string {
  if (enhancedTerms.length === 0) {
    return "";
  }
  
  // Join terms with OR operator for Adzuna API
  return enhancedTerms.join(" OR ");
}