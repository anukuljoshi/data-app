import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import { Divider, Stack, Typography } from "@mui/material";

import AggForm from "../components/plot/AggForm";
import PlotForm from "../components/plot/PlotForm";
import PlotGraph from "../components/plot/PlotGraph";

import { fetchCSVDataList } from "../services/query";

interface DataPlotProps {}

const DataPlot = (props: DataPlotProps) => {
	const [pageLoading, setPageLoading] = useState<boolean>(true);
	const [fileOptions, setFileOptions] = useState<FileOptionType[]>([]);
	const [computeResult, setComputeResult] = useState<number>(0);

	const [column1, setColumn1] = useState<number[]>([]);
	const [column2, setColumn2] = useState<number[]>([]);

	const { data: CSVData, status } = useQuery<CSVData[]>(
		"csvDataList",
		fetchCSVDataList
	);

	useEffect(() => {
		let temp: FileOptionType[];
		if (CSVData) {
			temp = CSVData.map((item) => ({
				label: item.name,
				value: item.id,
			}));
			setFileOptions(temp);
			setPageLoading(false);
		}
	}, [CSVData]);

	if (status === "loading" || pageLoading) {
		return (
			<div>
				<Typography variant={"h4"}>Loading...</Typography>
			</div>
		);
	}

	if (status === "error") {
		return (
			<div>
				<Typography variant={"h4"}>Error</Typography>
			</div>
		);
	}

	if (!pageLoading && fileOptions.length === 0) {
		return (
			<div>
				<Typography variant={"h4"}>No file uploaded</Typography>
			</div>
		);
	}

	return (
		<>
			<div>
				<Typography variant={"h4"} gutterBottom>
					Compute
				</Typography>
				<Stack direction={"row"} justifyContent={"space-between"}>
					<AggForm
						fileOptions={fileOptions}
						setComputeResult={setComputeResult}
					/>
					<Typography variant={"h4"} gutterBottom>
						{computeResult}
					</Typography>
				</Stack>
			</div>
			<Divider />
			<div>
				<Typography variant={"h4"} gutterBottom>
					Plot
				</Typography>
				<PlotForm
					fileOptions={fileOptions}
					setColumn1={setColumn1}
					setColumn2={setColumn2}
				/>
				<PlotGraph column1={column1} column2={column2} />
			</div>
		</>
	);
};

export default DataPlot;
