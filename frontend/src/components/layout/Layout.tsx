import React from "react";

import { Container, Toolbar } from "@mui/material";

import Navbar from "./Navbar";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
	return (
		<>
			<Navbar />
			<Toolbar />
			<br />
			<Container>{props.children}</Container>
		</>
	);
};

export default Layout;
