import axios from "axios";

async function getAddress(cep: string) {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    return response.data;
  } catch (error) {
    return {}
  }
}

export default getAddress;
