// Test script to verify the AI recommendation feature is working
// This script makes a simple request to the recommendation endpoint

fetch('https://localhost:4000/api/recommendation/recommendations')
  .then(response => {
    if (response.status === 401) {
      console.log('Recommendation API is working but requires authentication (expected)');
      return { success: true, message: 'API endpoint is accessible' };
    }
    return response.json();
  })
  .then(data => {
    console.log('Recommendation API Response:', data);
  })
  .catch(error => {
    console.error('Error testing recommendation API:', error);
  });