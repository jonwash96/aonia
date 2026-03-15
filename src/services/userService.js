import handleJSONResponse from '../utils/handleJSONResponse.js'
const API_URL = (import.meta.env.VITE_BACK_END_SERVER_URL || "http://stardestroyer-1701:3080")
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
        const q = query ? '/?populate='+query : '';

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


export async function getUserItem(query) {
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


export async function getNotifications(uid, from) {
    try {
        const q = from ? '?from='+from : '';

        const res = await fetch(BASE_URL+'/'+uid+'/notifications/'+q, {
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


export async function sendFriendRequest(query) {
    try {
        const res = await fetch(BASE_URL+'/friends/request', {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('aonia-token')}`
            },
            body: JSON.stringify(query)
        });

        res.ok && console.log("Friend Request Sent");
        return await handleJSONResponse(res);

    } catch (err) {
        console.error("@userSVC > getUsrItem()", err);
        throw new Error(err)
    }
}


export async function respondFriendRequest(query) {
    try {
        const res = await fetch(BASE_URL+'/friends/respond', {
            method: 'PUT',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('aonia-token')}`
            },
            body: JSON.stringify(query)
        });

        res.ok && console.log("Friend Request Responded");
        return await handleJSONResponse(res);

    } catch (err) {
        console.error("@userSVC > getUsrItem()", err);
        throw new Error(err)
    }
}