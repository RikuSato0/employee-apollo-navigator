import axios from 'axios';
import { Employee, EmployeeDetail } from '../types';

const API_KEY = 'ij9yz7z_fyF1JKN0tagvRw';
const BASE_URL = 'https://api.apollo.io/api/v1';

const headers = {
  accept: 'application/json',
  'Cache-Control': 'no-cache',
  'Content-Type': 'application/json',
  'x-api-key': API_KEY
};

// Apollo API Response Types
export interface ApolloOrganization {
  id: string;
  name: string;
  website_url: string;
  linkedin_url: string;
  location: string;
}

export interface ApolloPerson {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  linkedin_url: string;
  title: string;
  email: string;
  phone: string;
  subdepartments: string[];
  employment_history: string[];
  organization: {
    name: string;
    id: string;
  };
  twitter_url: string;
  country: string;
  photo_url: string;
}

export interface ApolloResponse {
  organizations?: ApolloOrganization[];
  people?: ApolloPerson[];
  matches?: ApolloPerson[];
}

export const searchCompanies = async (companyName: string, regions: string[]) => {
  try {
    console.log('Searching for company:', companyName);
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'mixed_companies/search',
        params: {
          q_organization_name: companyName,
          organization_locations: regions
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to search companies');
    }

    const data = await response.json();
    console.log('Company search response:', data);
    return data.organizations?.[0] as ApolloOrganization;
  } catch (error) {
    console.error('Error searching companies:', error);
    throw error;
  }
};

export const searchEmployees = async (
  companyId: string,
  role: string,
  regions: string[]
) => {
  try {

    console.log(companyId,'=>companyId');
    const params: any = {
      organization_ids: [companyId],
      q_keywords: role,
      page: 1,
      per_page: 100
    };
    
    // Only add keywords if role is provided
    if (role && role.trim()) {
      params.q_keywords = role.trim();
    }
    
    
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'mixed_people/search',
        params
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to search employees');
    }

    const data = await response.json() as ApolloResponse;
    console.log(data.people,'=>data.people');
    
    // Map Apollo persons to our Employee type
    const employees = (data.people || []).map((person: ApolloPerson) => ({
      id: person.id,
      name: `${person.first_name} ${person.last_name}`,
      title: person.title || '',
      linkedin: person.linkedin_url || '',
      company: person.organization?.name || '',
      companyId: person.organization?.id || '',
      department: person.subdepartments?.[0] || '',
      location: person.country || '',
      profileImage: person.photo_url || '',
      selected: false
    }));
    
    // Filter by location if specified
    const filteredEmployees = regions && regions.length > 0 
      ? employees.filter(employee => 
          !employee.location || regions.some(region => employee.location.includes(region))
        )
      : employees;
    
    console.log(`Filtered to ${filteredEmployees.length} employees`);
    return filteredEmployees;
  } catch (error) {
    console.error('Error searching employees:', error);
    throw error;
  }
};

export const fetchPersonalInfos = async (employees: Employee[]) => {
  try {
    console.log(`Fetching personal info for ${employees.length} employees`);
    
    // Prepare details for Apollo API
    const details = employees.map(emp => {
      const names = emp.name.split(' ');
      const firstName = names[0] || '';
      const lastName = names.length > 1 ? names.slice(1).join(' ') : '';
      
      return {
        first_name: firstName,
        last_name: lastName,
        organization_name: emp.company,
        title: emp.title,
        linkedin_url: emp.linkedin || ''
      };
    });
    
    console.log('Sending bulk match request with details:', JSON.stringify(details).substring(0, 200) + '...');
    
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'people/bulk_match',
        params: {
          details
        }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from API:', errorText);
      throw new Error(`Failed to fetch personal information: ${response.status}`);
    }

    const data = await response.json() as ApolloResponse;
    console.log(data.matches,'=>data.matches');
    
    // Transform the Apollo API response to our EmployeeDetail type
    const employeeDetails = employees.map(emp => {
      // Find the matching person from the API response
      // We need to match by name since the API might not return the same IDs
      const fullName = emp.name.toLowerCase().trim();
      
      const match = (data.matches || []).find((m: ApolloPerson) => {
        const apiFullName = `${m.first_name} ${m.last_name}`.toLowerCase().trim();
        return apiFullName === fullName || 
               m.linkedin_url === emp.linkedin || 
               (m.organization?.name === emp.company && m.title === emp.title);
      });
      
      if (match) {
        console.log(`Found match for ${emp.name}: ${match.email || 'No email'}`);
      } else {
        console.log(`No match found for ${emp.name}`);
      }
      
      return {
        ...emp,
        email: match?.email || '',
        twitter_url:match?.twitter_url || '',
        phone: match?.phone || '',
        skills:match?.subdepartments, // This may not be available from Apollo API
        experience:  []// This may not be available from Apollo API
      } as EmployeeDetail;
    });
    
    return employeeDetails;
  } catch (error) {
    console.error('Error fetching personal information:', error);
    throw error;
  }
}; 