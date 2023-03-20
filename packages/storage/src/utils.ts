export async function postData(url = "", data = {}, token="") {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    mode: 'no-cors', // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

export async function putData(url = "", data = {}, token="") {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    mode: 'no-cors', // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

export async function patchData(url = "", data = {}, token="") {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "PATCH", // *GET, POST, PUT, DELETE, etc.
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    mode: 'no-cors', // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}


export async function getData(url: string, token="") {
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'no-cors', // no-cors, *cors, same-origin
    headers: {
      'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}

export async function deleteData(url: string, token="") {
  const response = await fetch(url, {
    method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
    mode: 'no-cors', // no-cors, *cors, same-origin
    headers: {
      'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`

    },
  });

  return response.json();
}