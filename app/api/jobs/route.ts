// app/api/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { JobApiResponse, JobSearchParams } from "@/app/types";
import { enhanceJobTitleQuery, generateEnhancedQueryString } from "@/app/lib/aiSearchService";

export async function GET(request: NextRequest) {
  try {
    // Get search parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const title = searchParams.get("title") || "";
    const location = searchParams.get("location") || "";
    const jobType = searchParams.get("job_type") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const results_per_page = parseInt(searchParams.get("results_per_page") || "10");
    const enhanced_search = searchParams.get("enhanced_search") !== "false"; // Default to true

    // Check for required API credentials
    const appId = process.env.ADZUNA_APP_ID;
    const apiKey = process.env.ADZUNA_API_KEY;
    const baseUrl = process.env.ADZUNA_BASE_URL;

    if (!appId || !apiKey || !baseUrl) {
      return NextResponse.json(
        { error: "API credentials not configured" },
        { status: 500 }
      );
    }

    // Determine country code based on location
    // This is a simple version - you may want to implement a more sophisticated solution
    let countryCode = "us"; // Default to US
    if (location.toLowerCase().includes("toronto") || 
        location.toLowerCase().includes("canada") ||
        location.toLowerCase().includes("ontario")) {
      countryCode = "ca";
    } else if (location.toLowerCase().includes("london") || 
               location.toLowerCase().includes("uk") ||
               location.toLowerCase().includes("england")) {
      countryCode = "gb";
    }
    
    // Build API URL with query parameters
    const apiUrl = new URL(`${baseUrl}/jobs/${countryCode}/search/${page}`);
    console.log(`Using country code: ${countryCode} for location: ${location}`);
    
    // Add required parameters
    apiUrl.searchParams.append("app_id", appId);
    apiUrl.searchParams.append("app_key", apiKey);
    apiUrl.searchParams.append("results_per_page", results_per_page.toString());
    
    // Use AI enhancement for job title if enabled
    if (title && enhanced_search) {
      // Get enhanced search terms
      const enhancedTerms = enhanceJobTitleQuery(title);
      console.log("Enhanced search terms:", enhancedTerms);
      
      // Generate query string for Adzuna
      const enhancedQuery = generateEnhancedQueryString(enhancedTerms);
      
      if (enhancedQuery) {
        apiUrl.searchParams.append("what", enhancedQuery);
      }
    } else if (title) {
      // Just use the original title query without enhancement
      apiUrl.searchParams.append("what", title);
    }
    
    // Add location if provided
    if (location) apiUrl.searchParams.append("where", location);
    
    // Add job type filter if provided
    if (jobType) {
      switch (jobType) {
        case "full_time":
          apiUrl.searchParams.append("full_time", "1");
          break;
        case "part_time":
          apiUrl.searchParams.append("part_time", "1");
          break;
        case "contract":
          apiUrl.searchParams.append("contract", "1");
          break;
        case "permanent":
          apiUrl.searchParams.append("permanent", "1");
          break;
        default:
          // No filter
          break;
      }
    }

    console.log("Requesting from Adzuna:", apiUrl.toString());
    
    // Fetch data from Adzuna API
    const response = await fetch(apiUrl.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Adzuna API error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch job listings" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Format response for frontend
    const responseData: JobApiResponse = {
      jobs: data.results || [],
      totalJobs: data.count || 0,
      totalPages: Math.ceil((data.count || 0) / results_per_page),
      currentPage: page,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching job listings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}