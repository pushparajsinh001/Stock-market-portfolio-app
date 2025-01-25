// const baseURL = process.env.baseURL || ;
// const baseURL = "mongodb+srv://savage:savage@pushparajsinh001.bbqyp.mongodb.net/portfolio?retryWrites=true&w=majority";
const baseURL = "https://stock-market-portfolio-app-uwx4.onrender.com/api/shares"; // Replace with your backend's base URL

export const getHeldShares = async () => {
  try {
    const response = await fetch(baseURL);
    const data = await response.json();
    console.log(data)
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
    const response = await fetch(`${baseURL}/${id}`, {  // Use a slash before the id to form a valid URL
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
    const response = await fetch(`${baseURL}/${id}`, { // Same here
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};