type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
const apiCall = async (endpoint: string, method: Method = 'GET', body?: object) => {
    const token = localStorage.getItem('uToken');
    const refreshToken = localStorage.getItem('rToken');

    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...(refreshToken && { 'x-refresh-token': refreshToken })
        },
        ...(body && { body: JSON.stringify(body) })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/${endpoint}`, options);    
    const newAccessToken = response.headers.get('x-new-access-token');
    const newRefreshToken = response.headers.get('x-new-refresh-token');

    if (newAccessToken && newRefreshToken) {
        localStorage.setItem('uToken', newAccessToken);
        localStorage.setItem('rToken', newRefreshToken);
    }

    if (response.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
        return;
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'API call failed');

    return data;
};

export default apiCall;