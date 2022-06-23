import { Route, Routes } from "react-router-dom";

import DataPlot from "./pages/Plot";
import DataList from "./pages/Data";
import Home from "./pages/Home";

import { URLRoutes } from "./constants/urls";

interface AppRoutesProps {}

const AppRoutes = (props: AppRoutesProps) => {
	return (
		<Routes>
			<Route path={URLRoutes.HOME} element={<Home />} />
			<Route path={URLRoutes.DATA} element={<DataList />} />
			<Route path={URLRoutes.PLOT} element={<DataPlot />} />
		</Routes>
	);
};

export default AppRoutes;
