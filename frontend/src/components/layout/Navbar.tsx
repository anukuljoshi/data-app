import { Link as RouterLink, useLocation } from "react-router-dom";

import { AppBar, Container, Stack, Toolbar, Typography } from "@mui/material";

import { URLRoutes } from "../../constants/urls";

interface NavbarProps {}

const Navbar = (props: NavbarProps) => {
	const { pathname } = useLocation();

	return (
		<AppBar>
			<Container>
				<Toolbar disableGutters>
					<Typography
						variant="h6"
						noWrap
						component={RouterLink}
						to={URLRoutes.HOME}
						sx={{
							mr: 2,
							display: { xs: "none", md: "flex" },
							fontFamily: "monospace",
							fontWeight: 700,
							color: "inherit",
							textDecoration: "none",
						}}
					>
						DATA APP
					</Typography>
					<Stack
						direction="row"
						justifyContent={"right"}
						alignItems={"center"}
						flexGrow="1"
						spacing={5}
					>
						<Typography
							color={"white"}
							borderBottom={
								pathname === URLRoutes.HOME
									? "2px solid white"
									: "none"
							}
							px={1}
							py={1}
							component={RouterLink}
							to={URLRoutes.HOME}
						>
							Home
						</Typography>
						<Typography
							color={"white"}
							borderBottom={
								pathname === URLRoutes.DATA
									? "2px solid white"
									: "none"
							}
							px={1}
							py={1}
							component={RouterLink}
							to={URLRoutes.DATA}
						>
							Data
						</Typography>
						<Typography
							color={"white"}
							borderBottom={
								pathname === URLRoutes.PLOT
									? "2px solid white"
									: "none"
							}
							px={1}
							py={1}
							component={RouterLink}
							to={URLRoutes.PLOT}
						>
							Plot
						</Typography>
					</Stack>
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default Navbar;
