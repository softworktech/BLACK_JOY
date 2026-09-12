import { getToken } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://softworktech.com/SIYAM/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

const buildUrl = (endpoint: string, params?: Record<string, string | number | boolean>) => {
  const url = new URL(endpoint.startsWith('/') ? `${API_BASE}${endpoint}` : `${API_BASE}/${endpoint}`);
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, String(params[key]));
      }
    });
  }
  return url.toString();
};

const getHeaders = (isUpload = false): HeadersInit => {
  const token = getToken();
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };
  
  if (!isUpload) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

const handleResponse = async (response: Response) => {
  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
      }
    }
    throw new Error(data?.message || data?.error || 'Something went wrong');
  }

  return data;
};

export const apiGet = async (endpoint: string, params?: Record<string, string | number | boolean>) => {
  const response = await fetch(buildUrl(endpoint, params), {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const apiPost = async (endpoint: string, data?: any) => {
  const response = await fetch(buildUrl(endpoint), {
    method: 'POST',
    headers: getHeaders(),
    body: data ? JSON.stringify(data) : undefined,
  });
  return handleResponse(response);
};

export const apiPut = async (endpoint: string, data?: any) => {
  const response = await fetch(buildUrl(endpoint), {
    method: 'PUT',
    headers: getHeaders(),
    body: data ? JSON.stringify(data) : undefined,
  });
  return handleResponse(response);
};

export const apiPatch = async (endpoint: string, data?: any) => {
  const response = await fetch(buildUrl(endpoint), {
    method: 'PATCH',
    headers: getHeaders(),
    body: data ? JSON.stringify(data) : undefined,
  });
  return handleResponse(response);
};

export const apiDelete = async (endpoint: string) => {
  const response = await fetch(buildUrl(endpoint), {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const apiUpload = async (endpoint: string, formData: FormData, method: 'POST' | 'PUT' | 'PATCH' = 'POST') => {
  // If it's PUT/PATCH, laravel requires _method in POST form data
  let fetchMethod = method;
  if (method === 'PUT' || method === 'PATCH') {
    formData.append('_method', method);
    fetchMethod = 'POST';
  }

  const response = await fetch(buildUrl(endpoint), {
    method: fetchMethod,
    headers: getHeaders(true),
    body: formData,
  });
  return handleResponse(response);
};
