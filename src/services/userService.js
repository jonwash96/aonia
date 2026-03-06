import '../utils/handleJSONResponse.js'
const API_URL = (import.meta.env.VITE_BACK_END_SERVER_URL || "http://localhost:3443")
const BASE_URL = `${API_URL}/users`



export async function indexUserProfiles(query) {
    try {
        const q = query ? '/?q='+query : '';

        const res = await fetch(BASE_URL+q, {
            method: 'GET',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
        });

        return await handleJSONResponse(res);

    } catch (err) {
        throw new Error(err)
    }
}


export async function getUserData(uid, query) {
    try {
        const q = query ? '/?q='+query : '';

        const res = await fetch(BASE_URL+'/'+uid+q, {
            method: 'GET',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('aonia-token')}`
            },
        });

        return await handleJSONResponse(res);

    } catch (err) {
        throw new Error(err)
    }
}


export async function update(uid, updateInfo) {
    try {
        const res = await fetch(BASE_URL+'/'+uid, {
            method: 'PUT',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('aonia-token')}`,
                "Body": JSON.stringify(updateInfo)
            },
        });

        return await handleJSONResponse(res);

    } catch (err) {
        throw new Error(err)
    }
}


export async function getUserItem(uid, item, limit=10) {
    try {
        const q = query ? '?q='+query : '';

        const res = await fetch(BASE_URL+q, {
            method: 'GET',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('aonia-token')}`
            },
        });

        return await handleJSONResponse(res);

    } catch (err) {
        console.error("@userSVC > getUsrItem()", err);
        throw new Error(err)
    }
}


export async function deleteAcount(uid) {
    try {
        const res = await fetch(BASE_URL+'/'+uid, {
            method: 'DELETE',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('aonia-token')}`
            },
        });

        return await handleJSONResponse(res);

    } catch (err) {
        throw new Error(err)
    }
}

