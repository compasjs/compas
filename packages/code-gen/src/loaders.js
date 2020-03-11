import axios from "axios";

export const loadFromRemote = async url => {
  const response = await axios.get(url + "/_lbu/structure.json");

  return response.data;
};
