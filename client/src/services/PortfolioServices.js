const baseURL = process.env.baseURL;

export const getHeldShares = async () => {
  try {
    const response = await fetch(baseURL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const postNewShareAdd = async (payload) => {
  try {
    const response = await fetch(baseURL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const editCurrentSharesDB = async (id, payload) => {
  try {
    const response = await fetch(`${baseURL}${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteShares = async (id) => {
  try {
    const response = await fetch(`${baseURL}${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};