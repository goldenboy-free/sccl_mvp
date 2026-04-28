import { PUBLIC_API_URL } from '$env/static/public';

const API_BASE = PUBLIC_API_URL || 'http://localhost:3000';

/** Generic fetch wrapper with auth support */
async function request<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const token = typeof window !== 'undefined' ? localStorage.getItem('sccl_token') : null;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>)
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const res = await fetch(`${API_BASE}${endpoint}`, {
		...options,
		headers
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(errorText || `Request failed with status ${res.status}`);
	}

	return res.json();
}

// ========================
// Auth API
// ========================
export interface AuthUser {
	id: string;
	username: string;
	role: string;
	created_at: string;
}

export interface LoginResponse {
	user: AuthUser;
	token: string;
}

export interface RegisterResponse {
	user: AuthUser;
	token: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
	return request<LoginResponse>('/auth/login', {
		method: 'POST',
		body: JSON.stringify({ username, password })
	});
}

export async function register(
	username: string,
	password: string,
	role: string
): Promise<RegisterResponse> {
	return request<RegisterResponse>('/auth/register', {
		method: 'POST',
		body: JSON.stringify({ username, password, role })
	});
}

// ========================
// Tenders API
// ========================
export interface Tender {
	id: string;
	title: string;
	description: string;
	closing_date: string;
	opening_date: string;
	created_at: string;
}

export async function getTenders(): Promise<Tender[]> {
	return request<Tender[]>('/tenders/');
}

export async function getTenderById(id: string): Promise<Tender> {
	return request<Tender>(`/tenders/${id}`);
}

export async function createTender(data: {
	title: string;
	description: string;
	closing_date: string;
	opening_date: string;
}): Promise<Tender> {
	return request<Tender>('/tenders/', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

export async function updateTender(
	id: string,
	data: Partial<{
		title: string;
		description: string;
		closing_date: string;
		opening_date: string;
	}>
): Promise<{ message: string }> {
	return request<{ message: string }>(`/tenders/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});
}

// ========================
// Bids API
// ========================
export interface Bid {
	id: string;
	amount: string;
	status: string;
	user_id: string;
	tender_id: string;
	created_at: string;
}

export async function submitBid(tenderId: string, amount: string): Promise<Bid> {
	return request<Bid>(`/bids/tender/${tenderId}`, {
		method: 'POST',
		body: JSON.stringify({ amount })
	});
}

export async function getBidsByUser(userId: string): Promise<Bid[]> {
	return request<Bid[]>(`/bids/user/${userId}`);
}

export async function getBidsByTender(tenderId: string): Promise<Bid[]> {
	return request<Bid[]>(`/bids/tender/${tenderId}`);
}

// ========================
// Audit API
// ========================
export interface AuditEntry {
	id: string;
	action: string;
	details: string;
	user_id: string;
	created_at: string;
	username?: string;
}

export async function createAuditLog(data: {
	action: string;
	details: string;
	user_id?: string;
}): Promise<AuditEntry> {
	return request<AuditEntry>('/audit/', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

export async function getAuditLogs(): Promise<AuditEntry[]> {
	return request<AuditEntry[]>('/audit/');
}
