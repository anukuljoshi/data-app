import Plot from "react-plotly.js";

interface PlotGraphProps {
	column1: number[];
	column2: number[];
}

const PlotGraph = (props: PlotGraphProps) => {
	return (
		<Plot
			data={[
				{
					x: props.column1,
					y: props.column2,
					type: "scatter",
					mode: "markers",
					marker: { color: "red" },
				},
			]}
			layout={{ width: 500, height: 500, title: `Scatter Plot` }}
		/>
	);
};

export default PlotGraph;
