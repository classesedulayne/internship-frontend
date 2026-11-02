const API_BASE = '/api';

// Helper for authenticated headers
const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('looka_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const api = {
  // Public
  getPrograms: async () => {
    const res = await fetch(`${API_BASE}/programs/`);
    if (!res.ok) throw new Error('Failed to load programs');
    return res.json();
  },

  getDomains: async () => {
    const res = await fetch(`${API_BASE}/domains/`);
    if (!res.ok) throw new Error('Failed to load domains');
    return res.json();
  },

  getPublicSettings: async () => {
    const res = await fetch(`${API_BASE}/settings/public/`);
    if (!res.ok) throw new Error('Failed to load portal settings');
    return res.json();
  },

  registerInternship: async (formData) => {
    const res = await fetch(`${API_BASE}/register/`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    return data;
  },

  checkApplicationStatus: async (identifier) => {
    const res = await fetch(`${API_BASE}/application/${encodeURIComponent(identifier)}/`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Application not found');
    return data;
  },

  studentSignup: async ({ name, email, password, confirm_password }) => {
    const res = await fetch(`${API_BASE}/auth/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, confirm_password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Sign up failed');
    return data;
  },

  adminLogin: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/admin-login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  unifiedLogin: async (identifier, secret) => {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, secret }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  studentLogin: async (identifier, secret) => {
    const res = await fetch(`${API_BASE}/auth/student-login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, secret }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE}/auth/me/`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  },

  // SuperAdmin
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE}/admin/dashboard-stats/`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load admin stats');
    return data;
  },

  getAdminApplications: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.program && filters.program !== 'ALL') params.append('program', filters.program);
    if (filters.domain && filters.domain !== 'ALL') params.append('domain', filters.domain);
    if (filters.payment_status && filters.payment_status !== 'ALL') params.append('payment_status', filters.payment_status);
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/admin/applications/?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load applications');
    return data;
  },

  updateApplicationStatus: async (applicationId, updatePayload) => {
    const res = await fetch(`${API_BASE}/admin/applications/${applicationId}/status/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatePayload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update application');
    return data;
  },

  deleteApplication: async (applicationId) => {
    const res = await fetch(`${API_BASE}/admin/applications/${applicationId}/delete/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete application');
    return data;
  },

  getAdminSettings: async () => {
    const res = await fetch(`${API_BASE}/admin/settings/`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  updateAdminSettings: async (settings) => {
    const res = await fetch(`${API_BASE}/admin/settings/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
    return data;
  },

  exportCsvUrl: `${API_BASE}/admin/export-csv/`,

  // Student
  getStudentApplication: async () => {
    const res = await fetch(`${API_BASE}/student/my-application/`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load application');
    return data;
  },

  updateStudentProfile: async (profileUpdates) => {
    const res = await fetch(`${API_BASE}/student/update-profile/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileUpdates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile');
    return data;
  }
};
