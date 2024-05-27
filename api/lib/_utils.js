export function createURLWithParams(base, searchParams) {
    let paramsObject = new URLSearchParams(searchParams);
    return `${base}?${paramsObject.toString()}`;
};

export async function jsonFetch(url, options = {}) {
    let res = await fetch(url, options);
    return await res.json();
};

export async function postFetch(url, body = {}) {
    let formData = new FormData();
    Object.entries(body).forEach((entrie) => { formData.set(...entrie) })
    let res = await fetch(url, { body: formData, method: "POST" });
    return await res.json();
};