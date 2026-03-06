import { useEffect } from 'react';

export function useFetch(url, setter) {
	useEffect(() => {
		if (url) {
			let ignore = false;
			fetch(url)
				.then(response => response.json())
				.then(json => {if (!ignore) setter(json)});
			return () => ignore = true;
		}
	}, [url]);
}

export function useFetchPOST(url, body, setter) {
	useEffect(() => {
		if (url) {
			let ignore = false;
			fetch(url, {
				"method": "POST",
				"headers": {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				},
				"body": JSON.stringify(body)
			})
				.then(response => response.json())
				.then(json => {if (!ignore) setter(json)});
			return () => ignore = true;
		}
	}, [url]);
}