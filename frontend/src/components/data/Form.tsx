import axios from "axios";
import { Formik } from "formik";
import { useQueryClient } from "react-query";

import {
	Box,
	Button,
	FormHelperText,
	FormLabel,
	Stack,
	TextField,
} from "@mui/material";

import { BASE_API_URL } from "../../constants/api";

interface CSVDataFormValues {
	name: string;
	csv_file: File | null;
}

const CSVDataForm = () => {
	const queryClient = useQueryClient();

	const initialValues: CSVDataFormValues = {
		name: "",
		csv_file: null,
	};

	return (
		<Formik
			initialValues={initialValues}
			validate={(values) => {
				const errors: any = {};
				if (!values.name) {
					errors.name = "Name is required";
				}
				if (!values.csv_file) {
					errors.csv_file = "File is required";
				}
				return errors;
			}}
			onSubmit={(values, actions) => {
				if (!values.csv_file) {
					actions.setErrors({ csv_file: "File is required" });
					return;
				}

				actions.setSubmitting(false);

				const formData = new FormData();
				formData.append("name", values.name);
				formData.append("csv_file", values.csv_file);

				axios
					.post(`${BASE_API_URL}/dataset/`, formData)
					.then((res) => {
						console.log(res, "success");
						queryClient.fetchQuery("csvDataList");
						actions.resetForm();
					})
					.catch((error) => {
						console.log(error, "error");
						if (error.response.status === 400) {
							actions.setErrors(error.response.data);
						}
					});

				actions.setSubmitting(true);
			}}
		>
			{(formik_props) => (
				<form
					onSubmit={formik_props.handleSubmit}
					encType="multipart/form-data"
				>
					<Stack spacing={2} sx={{ width: "300px" }}>
						<Box>
							<Stack
								direction={"row"}
								justifyContent={"space-between"}
								alignItems={"flex-end"}
								spacing={3}
							>
								<FormLabel>
									{formik_props.values.csv_file
										? formik_props.values.csv_file.name
										: "No file selected"}
								</FormLabel>
								<Button
									variant="outlined"
									component={"label"}
									size={"small"}
								>
									BROWSE
									<input
										type="file"
										id="csv_file"
										name="csv_file"
										onChange={(e) =>
											formik_props.setFieldValue(
												"csv_file",
												e.currentTarget?.files?.[0]
											)
										}
										hidden
									/>
								</Button>
							</Stack>
							{formik_props.touched.csv_file &&
								Boolean(formik_props.errors.csv_file) && (
									<FormHelperText
										error={
											formik_props.touched.csv_file &&
											Boolean(
												formik_props.errors.csv_file
											)
										}
									>
										{formik_props.errors.csv_file}
									</FormHelperText>
								)}
						</Box>
						<TextField
							type={"text"}
							id={"name"}
							name={"name"}
							label={"FileName"}
							variant={"outlined"}
							size={"small"}
							value={formik_props.values.name}
							onChange={formik_props.handleChange}
							onBlur={formik_props.handleBlur}
							error={
								formik_props.touched.name &&
								Boolean(formik_props.errors.name)
							}
							helperText={formik_props.errors.name}
							fullWidth
						/>
						<Box>
							<Button variant={"contained"} type="submit">
								Upload
							</Button>
						</Box>
					</Stack>
				</form>
			)}
		</Formik>
	);
};

export default CSVDataForm;
