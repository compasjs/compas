import axios from "axios";

export async function loadFromRemote(url) {
  const response = await axios.get(url + "/_lbu/structure.json");

  return response.data;
}
