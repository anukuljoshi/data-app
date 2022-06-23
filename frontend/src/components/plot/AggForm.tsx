import axios from "axios";
import { Formik } from "formik";

import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	TextField,
} from "@mui/material";

import { BASE_API_URL } from "../../constants/api";

const operationOptions: OperationOptionType[] = [
	{
		label: "Max",
		value: "max",
	},
	{
		label: "Min",
		value: "min",
	},
	{
		label: "Sum",
		value: "sum",
	},
];

interface AggFormProps {
	fileOptions: FileOptionType[];
	setComputeResult: React.Dispatch<React.SetStateAction<number>>;
}

const AggForm = (props: AggFormProps) => {
	return (
		<Formik
			initialValues={{
				selectedfile: props.fileOptions[0].value.toString(),
				column: "",
				operation: "max",
			}}
			onSubmit={(values, actions) => {
				const data = {
					column: values.column,
					operation: values.operation,
				};

				axios
					.post(
						`${BASE_API_URL}/dataset/${values.selectedfile}/compute/`,
						data
					)
					.then((res) => {
						if (res.status === 200) {
							props.setComputeResult(res.data.result);
						}
					})
					.catch((error) => {
						console.log(error, "error");
						if (error.response.status === 400) {
							actions.setErrors(error.response.data);
						}
					});
			}}
		>
			{(formik_props) => (
				<form onSubmit={formik_props.handleSubmit}>
					<Stack direction="row" gap={2} alignItems={"center"}>
						<FormControl size={"small"} sx={{ width: "200px" }}>
							<InputLabel>File</InputLabel>
							<Select
								id="file-select"
								name={"selectedfile"}
								value={formik_props.values.selectedfile}
								label="File"
								onChange={(e: SelectChangeEvent) =>
									formik_props.setFieldValue(
										"selectedfile",
										e.target.value
									)
								}
							>
								{props.fileOptions.map((item, index) => (
									<MenuItem value={item.value} key={index}>
										{item.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<TextField
							type={"text"}
							id={"column"}
							name={"column"}
							label={"Column"}
							variant={"outlined"}
							size={"small"}
							value={formik_props.values.column}
							onChange={formik_props.handleChange}
							onBlur={formik_props.handleBlur}
							error={
								formik_props.touched.column &&
								Boolean(formik_props.errors.column)
							}
							helperText={formik_props.errors.column}
							sx={{ width: "200px" }}
						/>
						<FormControl size={"small"} sx={{ width: "200px" }}>
							<InputLabel>Operation</InputLabel>
							<Select
								labelId="operation"
								id="operation-select"
								name={"operation"}
								value={formik_props.values.operation}
								label="Operation"
								onChange={(e: SelectChangeEvent) =>
									formik_props.setFieldValue(
										"operation",
										e.target.value
									)
								}
							>
								{operationOptions.map((item, index) => (
									<MenuItem value={item.value} key={index}>
										{item.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<Button variant={"contained"} type="submit">
							Compute
						</Button>
					</Stack>
				</form>
			)}
		</Formik>
	);
};

export default AggForm;
