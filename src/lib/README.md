# Apollo API Service

This module provides a wrapper for the Apollo.io API to search for companies, employees, and fetch detailed employee information.

## Usage

### Import the API functions

```tsx
import { searchCompanies, searchEmployees, fetchPersonalInfos } from '@/lib/apolloApi';
// or
import { searchCompanies, searchEmployees, fetchPersonalInfos } from '@/lib';
```

### Search for Companies

```tsx
// Search for a company by name
const company = await searchCompanies('Example Company', ['United States']);

console.log(company);
// {
//   id: 'company-id',
//   name: 'Example Company',
//   website_url: 'https://example.com',
//   linkedin_url: 'https://linkedin.com/company/example',
//   location: 'San Francisco, CA'
// }
```

### Search for Employees

```tsx
// Search for employees in a company
const employees = await searchEmployees(
  'company-id',    // Company ID
  'executive',     // Role/seniority (optional)
  ['United States'] // Regions
);

console.log(employees);
// [
//   {
//     id: 'employee-id',
//     name: 'John Doe',
//     title: 'CEO',
//     company: 'Example Company',
//     companyId: 'company-id',
//     department: 'Executive',
//     location: 'San Francisco, CA',
//     profileImage: 'https://example.com/profile.jpg',
//     selected: false
//   },
//   ...
// ]
```

### Fetch Detailed Employee Information

```tsx
// Fetch detailed information for employees
const employeeDetails = await fetchPersonalInfos(employees);

console.log(employeeDetails);
// [
//   {
//     id: 'employee-id',
//     name: 'John Doe',
//     title: 'CEO',
//     company: 'Example Company',
//     companyId: 'company-id',
//     department: 'Executive',
//     location: 'San Francisco, CA',
//     profileImage: 'https://example.com/profile.jpg',
//     email: 'john.doe@example.com',
//     phone: '+1 (123) 456-7890',
//     linkedin: 'https://linkedin.com/in/johndoe',
//     skills: [],
//     experience: []
//   },
//   ...
// ]
```

## API Proxy

This service uses a proxy endpoint to communicate with the Apollo API. All requests are sent to `/api/proxy` which is configured in the Vite server middleware. This helps to:

1. Keep your API key secure (not exposed to the client)
2. Avoid CORS issues
3. Implement rate limiting and caching if needed

The proxy is automatically set up in the Vite config file. During development, it's handled by the Vite development server. For production, you'll need to implement a similar proxy on your server.

## Error Handling

All API functions include error handling and will throw descriptive errors if something goes wrong. Always wrap your API calls in try/catch blocks to handle errors gracefully.

```tsx
try {
  const employees = await searchEmployees(companyId, '', regions);
  // Handle success
} catch (error) {
  console.error('Error fetching employees:', error);
  // Handle error (e.g., show a toast message)
}
``` 