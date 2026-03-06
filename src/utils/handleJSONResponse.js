export default async function handleJSONResponse(res) {
    if (!res.ok) {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const data = await res.json().catch(() => null);
            throw new Error(
                data?.message || data?.error || `Request failed: ${res.status} ${res.statusText}`,
            );
        }

        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed: ${res.status} ${res.statusText}`);
    }

    if (res.status === 204) return null;

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(
            `Expected JSON response, got ${contentType || "unknown"}: ${text.slice(0, 80)}`,
        );
    }

    return await res.json();
}