const API_URL = (import.meta.env.VITE_BACK_END_SERVER_URL || "http://localhost:3080")
const BASE_URL = `${API_URL}/auth`



export async function register(formData) {
	try {
		const res = await fetch(BASE_URL+'/register', {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});

		const data = await res.json();
		if (data.error) throw new Error(data.error);
		if (!data.token) throw new Error("Invalid response from the server. Token not found.");
		
		localStorage.setItem('aonia-token', data.token);
		sessionStorage.setItem('userData', JSON.stringify(data.user));

		return data.user

	} catch (err) {
		throw new Error(err);
	}
}


export async function login(formData) {
	try {
		const res = await fetch(BASE_URL+'/login', {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});

		const data = await res.json();
		if (data.error) throw new Error(data.err);
		if (!data.token) throw new Error("Invalid Response from server. Token not found.");

		localStorage.setItem('aonia-token', data.token);
		sessionStorage.setItem('userData', JSON.stringify(data.user));

		return data.user

	} catch (err) {
		throw new Error(err);
	}
}


export async function logout() {
	try {
		const res = await fetch(BASE_URL+'/logout', { method: "POST" });

		localStorage.removeItem('aonia-token');
		sessionStorage.removeItem('userData');
		if (localStorage.getItem('aonia-token') || sessionStorage.getItem('userData')) 
			throw new Error("Connection to the server Failed. Signing Out Locally.");

		return res.status

	} catch (err) {
		localStorage.removeItem('aonia-token');
		sessionStorage.removeItem('userData');
		if (localStorage.getItem('aonia-token')) 
			throw new Error("Sign Out Failed! Please try again later.");
	}
}