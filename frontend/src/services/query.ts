import axios from "axios";

import { BASE_API_URL } from "../constants/api";

export const fetchCSVDataList = async ({ queryKey }: any) => {
	// const [_key] = queryKey
	const { data } = await axios.get(`${BASE_API_URL}/dataset/`);

	return data;
};
