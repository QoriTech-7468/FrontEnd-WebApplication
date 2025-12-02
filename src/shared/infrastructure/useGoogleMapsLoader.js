import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

let googleMapsScriptLoading = null;
let markerLibraryLoading = null;
let isConfigured = false;

/**
 * Load Google Maps API dynamically
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise<Object>} Promise that resolves with window.google
 */
export function loadGoogleMaps(apiKey) {
  // Check if Google Maps is already loaded
  if (typeof window !== "undefined" && window.google && window.google.maps) {
    return Promise.resolve(window.google);
  }

  // Validate API key
  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API key is not provided"));
  }

  // Configure setOptions for importLibrary (required for AdvancedMarkerElement)
  if (!isConfigured) {
    try {
      setOptions({
        apiKey: apiKey,
        version: "weekly",
      });
      isConfigured = true;
    } catch (err) {
      console.warn("Failed to set Google Maps options:", err);
    }
  }

  // If script is already loading, return the existing promise
  if (!googleMapsScriptLoading) {
    googleMapsScriptLoading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      // Use loading=async parameter as recommended by Google Maps
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Wait a bit for Google Maps to fully initialize
        setTimeout(() => {
          if (window.google && window.google.maps) {
            resolve(window.google);
          } else {
            googleMapsScriptLoading = null; // Reset so it can be retried
            reject(new Error("Google Maps API failed to load - window.google.maps is not available"));
          }
        }, 100);
      };
      
      script.onerror = (err) => {
        googleMapsScriptLoading = null; // Reset so it can be retried
        const errorMsg = `Failed to load Google Maps script. This could be due to:
1. Invalid API key
2. API key restrictions
3. Ad blocker blocking the request
4. Network issues
        
Please check your VITE_GOOGLE_MAPS_API_KEY in .env.development`;
        reject(new Error(errorMsg));
      };
      
      document.head.appendChild(script);
    });
  }

  return googleMapsScriptLoading;
}

/**
 * Load Marker library for AdvancedMarkerElement
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise<Object>} Promise that resolves with marker library
 */
export async function loadMarkerLibrary(apiKey) {
  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API key is not provided"));
  }

  // Check if already loaded
  if (window.google?.maps?.marker?.AdvancedMarkerElement) {
    return Promise.resolve(window.google.maps.marker);
  }

  // If already loading, return existing promise
  if (!markerLibraryLoading) {
    markerLibraryLoading = (async () => {
      try {
        // First ensure Google Maps is loaded
        await loadGoogleMaps(apiKey);
        
        // Then load marker library using importLibrary
        const markerLib = await importLibrary("marker");
        return markerLib;
      } catch (err) {
        markerLibraryLoading = null; // Reset so it can be retried
        throw err;
      }
    })();
  }

  return markerLibraryLoading;
}

