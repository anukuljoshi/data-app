import { useQuery } from "react-query";

import { Divider } from "@mui/material";

import FileList from "../components/data/FileList";
import CSVDataForm from "../components/data/Form";

import { fetchCSVDataList } from "../services/query";

interface DataListProps {}

const DataList = (props: DataListProps) => {
	const { data, status } = useQuery("csvDataList", fetchCSVDataList);

	if (status === "loading") {
		return (
			<div>
				<h4>Loading...</h4>
			</div>
		);
	}

	if (status === "error") {
		return (
			<div>
				<h4>Error</h4>
			</div>
		);
	}

	return (
		<div>
			<CSVDataForm />
			<Divider sx={{ my: 2 }} />
			<div>
				<FileList data={data} />
			</div>
		</div>
	);
};

export default DataList;
