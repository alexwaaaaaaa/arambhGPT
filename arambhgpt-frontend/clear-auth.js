// Simple script to clear authentication state if stuck
// Run this in browser console if you get "Session Too Long" error

console.log('Clearing authentication state...');

// Clear localStorage
localStorage.removeItem('auth_token');
localStorage.removeItem('user_data');
localStorage.removeItem('professional_token');
localStorage.removeItem('professional_data');

// Clear sessionStorage
sessionStorage.clear();

console.log('Authentication state cleared. Please refresh the page.');

// Optionally refresh the page
// window.location.reload();