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

interface PlotFormProps {
	fileOptions: FileOptionType[];
	setColumn1: React.Dispatch<React.SetStateAction<number[]>>;
	setColumn2: React.Dispatch<React.SetStateAction<number[]>>;
}

const PlotForm = (props: PlotFormProps) => {
	return (
		<Formik
			initialValues={{
				selectedfile: props.fileOptions[0].value.toString(),
				column1: "",
				column2: "",
			}}
			validate={(values) => {
				const errors: any = {};
				if (!values.column1) {
					errors.column1 = "Column 1 is required";
				}
				if (!values.column2) {
					errors.column2 = "Column 2 is required";
				}
			}}
			onSubmit={(values, actions) => {
				const data = {
					column1: values.column1,
					column2: values.column2,
				};

				axios
					.post(
						`${BASE_API_URL}/dataset/${values.selectedfile}/plot/`,
						data
					)
					.then((res) => {
						console.log(res);
						if (res.status === 200) {
							props.setColumn1(res.data.column1);
							props.setColumn2(res.data.column2);
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
							id={"column1"}
							name={"column1"}
							label={"Column 1"}
							variant={"outlined"}
							size={"small"}
							value={formik_props.values.column1}
							onChange={formik_props.handleChange}
							onBlur={formik_props.handleBlur}
							error={
								formik_props.touched.column1 &&
								Boolean(formik_props.errors.column1)
							}
							helperText={formik_props.errors.column1}
							sx={{ width: "200px" }}
						/>
						<TextField
							type={"text"}
							id={"column2"}
							name={"column2"}
							label={"Column 2"}
							variant={"outlined"}
							size={"small"}
							value={formik_props.values.column2}
							onChange={formik_props.handleChange}
							onBlur={formik_props.handleBlur}
							error={
								formik_props.touched.column2 &&
								Boolean(formik_props.errors.column2)
							}
							helperText={formik_props.errors.column2}
							sx={{ width: "200px" }}
						/>
						<Button variant={"contained"} type="submit">
							Plot
						</Button>
					</Stack>
				</form>
			)}
		</Formik>
	);
};

export default PlotForm;
