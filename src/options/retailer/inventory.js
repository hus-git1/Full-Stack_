import React, { useEffect,useState } from "react";
// import React, { useState } from 'react';
import RetailerSidebar from "../../components/sidebars/retailerSidebar";
import "../background.css";
import {
	Stack,
	Button,
	Grid,
	Typography,
	Slide,
	FormControl,
	OutlinedInput,
	InputAdornment,
	IconButton,
	InputLabel,
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
	DialogContentText,
	Divider,
	TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import CustomizedSnackbars from "../../components/alerts/authAlerts";
// const [c, setC] = useState(0);  // Initializing c with 0

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
function InventoryPage() {
	const columns = [
		{ field: "id", headerName: "Product_ID", width: 220 },
		{ field: "Product_Name", headerName: "Product_Name", width: 220 },
		{ field: "Product_Type", headerName: "Product_Type", width: 220 },
		{ field: "Count", headerName: "Count", width: 220 },
		{ field: "Description", headerName: "Description", width: 220 },
	];
	const [rows, setRows] = React.useState([]);
	const [open, setOpen] = React.useState(false);
	const [dataOpen, setDataOpen] = React.useState(false);
	const [addOpen, setAddOpen] = React.useState(false);
	const [productName, setProductName] = React.useState("");
	const [productCount, setProductCount] = React.useState("");
	const [productType, setProductType] = React.useState("");
	const [productDescription, setProductDescription] = React.useState("");
	const [searchQuery, setSearchQuery] = React.useState("");
	const [productID, setProductID] = React.useState("");
	const [idOpen, setIDOpen] = React.useState(false);
	const [decOpen, setDecOpen] = React.useState(false);
	const [editOpen, setEditOpen] = React.useState(false);
	const [countOpen, setCountOpen] = React.useState(false);
	const [data, setData] = React.useState({});
	const [errOpen, setErrOpen] = React.useState(false);
	const [message, setMessage] = React.useState("");
	const handleEditOpen = () => {
		setEditOpen(true);
	};
	const handleEditClose = () => {
		setEditOpen(false);
	};
	const handleCountOpen = () => {
		setCountOpen(true);
	};
	const handleCountClose = () => {
		setCountOpen(false);
	};
	const handleIDOpen = () => {
		setIDOpen(true);
	};
	const handleIDClose = () => {
		setIDOpen(false);
	};
	const handleDecOpen = () => {
		setDecOpen(true);
	};
	const handleDecClose = () => {
		setDecOpen(false);
	};
	const handleAddOpen = () => {
		setAddOpen(true);
	};
	const handleAddClose = () => {
		setAddOpen(false);
	};
	async function getDetails() {
		const token = localStorage.getItem("token");
		try {
			const response = await fetch(
				"http://localhost:5000/dashboard/getInventory",
				{
					method: "GET",
					headers: { jwt_token: token },
				}
			);
			const parseRes = await response.json();
			setData(parseRes);
		} catch (err) {
			console.error(err);
		}
	}

	useEffect(() => {
		getProductList();
		getDetails();
	}, [
		open,
		searchQuery,
		productName,
		dataOpen,
		addOpen,
		productCount,
		productDescription,
		productType,
		productID,
		data,
	]);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const handleDataOpen = (e) => {
		setDataOpen(true);
	};

	const handleDataClose = () => {
		setDataOpen(false);
	};
	async function editProductData() {
		if (!productName) {
			setMessage("Product Name is Mandatory");
			setErrOpen(true);
			return;
		}
		if (!productType) {
			setMessage("Product Type is Mandatory");
			setErrOpen(true);
			return;
		}
		if (!productDescription) {
			setMessage("Product Description is Mandatory");
			setErrOpen(true);
			return;
		}
		if (parseInt(productCount) <= 0 || !productCount) {
			setMessage("Product Count should be positive");
			setErrOpen(true);
			return;
		}
		const token = localStorage.getItem("token");
		const id = localStorage.getItem("id");
		try {
			const inputs = {
				id: id,
				name: productName,
				count: (parseInt(productCount, 10) * 2).toString(),
				description: productDescription,
				type: productType,
			};
			const response = await fetch(
				"http://localhost:5000/dashboard/editProduct",
				{
					method: "POST",
					headers: {
						jwt_token: token,
						"Content-type": "application/json",
					},
					body: JSON.stringify(inputs),
				}
			);
			const parseRes = await response.json();
			if (parseRes === "exceeded") {
				setMessage("Cannot exceed maximum inventory count limit");
				setErrOpen(true);
				return;
			}
			setProductCount("");
			setProductType("");
			setProductDescription("");
			setProductName("");
			localStorage.removeItem("id");
			handleEditClose();
		} catch (err) {
			console.error(err);
		}
	}
	async function getProductItem() {
		const token = localStorage.getItem("token");
		const id = localStorage.getItem("id");
		try {
			const inputs = {
				id: id,
			};
			const response = await fetch(
				"http://localhost:5000/dashboard/getProductItem",
				{
					method: "POST",
					headers: {
						jwt_token: token,
						"Content-type": "application/json",
					},
					body: JSON.stringify(inputs),
				}
			);
			const parseRes = await response.json();
			setProductID(id);
			setProductCount(parseRes[0].product_count);
			// c = parseRes[0].product_count;
			setProductType(parseRes[0].product_type);
			setProductDescription(parseRes[0].product_description);
			setProductName(parseRes[0].product_name);
		} catch (err) {
			console.error(err);
		}
	}
	async function handleProductDecreaseCount() {
		const token = localStorage.getItem("token");
		const id = localStorage.getItem("id");
		if (!productCount || productCount <= 0) {
			setMessage("Product Count should be positive");
			setErrOpen(true);
			return;
		}
		try {
			const inputs = {
				id: id,
				count: productCount,
			};

			const response = await fetch(
				"http://localhost:5000/dashboard/decreaseProduct",
				{
					method: "POST",
					headers: {
						jwt_token: token,
						"Content-type": "application/json",
					},
					body: JSON.stringify(inputs),
				}
			);
			const parseRes = await response.json();
			if (parseRes === "decrement error") {
				setMessage("Cannot decrement more than the original count");
				setErrOpen(true);
				return;
			}
			setProductCount("");
			localStorage.removeItem("id");
			handleDecClose();
			getProductList();
		} catch (err) {
			console.error(err);
		}
	}
	async function handleProductRemoval() {
		const token = localStorage.getItem("token");
		try {
			const inputs = {
				id: productID,
			};

			const response = await fetch(
				"http://localhost:5000/dashboard/removeProduct",
				{
					method: "POST",
					headers: {
						jwt_token: token,
						"Content-type": "application/json",
					},
					body: JSON.stringify(inputs),
				}
			);
			const parseRes = await response.json();
			if (parseRes === "non-existent") {
				setMessage("Product Does Not Exist");
				setErrOpen(true);
				return;
			}

			setProductID("");
			handleIDClose();

			getProductList();
		} catch (err) {
			console.error(err);
		}
	}
	async function handleAddApproval() {
		const token = localStorage.getItem("token");
		if (!productName) {
			setMessage("Product Name is Mandatory");
			setErrOpen(true);
			return;
		}
		if (!productType) {
			setMessage("Product Type is Mandatory");
			setErrOpen(true);
			return;
		}
		if (!productDescription) {
			setMessage("Product Description is Mandatory");
			setErrOpen(true);
			return;
		}
		if (parseInt(productCount) <= 0 || !productCount) {
			setMessage("Product Count should be positive");
			setErrOpen(true);
			return;
		}
		try {
			const inputs = {
				name: productName,
				count: productCount,
				type: productType,
				description: productDescription,
			};

			const response = await fetch(
				"http://localhost:5000/dashboard/addProduct",
				{
					method: "POST",
					headers: {
						jwt_token: token,
						"Content-type": "application/json",
					},
					body: JSON.stringify(inputs),
				}
			);
			const parseRes = await response.json();
			if (parseRes === "count exceeded") {
				setMessage("Cannot exceed maximum inventory count limit");
				setErrOpen(true);
				return;
			}
			setProductName("");
			setProductType("");
			setProductCount("");
			setProductDescription("");
			handleAddClose();
			handleCountClose();
			getProductList();
		} catch (err) {
			console.error(err);
		}
	}
	async function getProductList() {
		const token = localStorage.getItem("token");
		try {
			const inputs = {
				name: searchQuery,
			};
			const response = await fetch(
				"http://localhost:5000/dashboard/getProducts",
				{
					method: "POST",
					headers: {
						jwt_token: token,
						"Content-type": "application/json",
					},
					body: JSON.stringify(inputs),
				}
			);
			const parseRes = await response.json();
			console.log(parseRes);
			let tempRows = [];
			parseRes.map((pr) => {
				tempRows.push({
					id: pr.product_id,
					Product_Name: pr.product_name,
					Product_Type: pr.product_type,
					Description: pr.product_description,
					Count: pr.product_count,
				});
				// setC(pr.product_count);
			});
			setRows(tempRows);
		} catch (err) {
			console.error(err);
		}
	}
	return (
		<div className="co">
			<Stack direction={"row"}>
				<RetailerSidebar />
				<Stack
					direction={"column"}
					sx={{ marginLeft: 5, marginTop: 4, height: 720 }}>
					<Typography
						sx={{
							fontSize: 40,
							marginLeft: 60,
							marginBottom: 1,
							color: "white",
						}}>
						INVENTORY
					</Typography>
					<FormControl variant="standard">
						<CustomizedSnackbars
							open={errOpen}
							setOpen={setErrOpen}
							message={message}
							type={"error"}
						/>
						<Stack direction={"column"}>
							<OutlinedInput
								onChange={(e) => {
									setSearchQuery(e.target.value);
									getProductList();
								}}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											sx={{
												color: "white",
												mr: 1,
												my: 0.5,
												fontSize: "50px",
											}}>
											<SearchIcon />
										</IconButton>
									</InputAdornment>
								}
								inputProps={{
									disableunderline: "true",
								}}
								sx={{
									backgroundColor: "#3D2A47",
									width: 550,
									borderRadius: 4,
									fontSize: 25,
									height: 60,
									color: "white",
								}}
							/>
							<InputLabel
								style={{ fontSize: 20, marginTop: -10 }}
								sx={{
									color: "white",
									marginLeft: 2,
								}}>
								<Typography
									sx={{ fontSize: 25, fontWeight: "bold" }}>
									Search
								</Typography>
							</InputLabel>
						</Stack>
					</FormControl>
					<Grid container spacing={2} sx={{ marginTop: 1 }}>
						<Grid item xs={3}>
							<Button
								variant={"contained"}
								sx={{
									backgroundColor: "#2C3E50",
									height: 60,
									width: 300,
									fontSize: 22,
									fontWeight: "bold",
									border: "2px solid #FFFFFF"
								}}
								onClick={handleAddOpen}>
								ADD PRODUCT
							</Button>
							<Dialog
								open={addOpen}
								TransitionComponent={Transition}
								keepMounted
								onClose={handleAddClose}
								aria-describedby="alert-dialog-slide-description">
								<DialogTitle>{"PRODUCT DETAILS"}</DialogTitle>
								<DialogContent>
									<DialogContentText>Name:</DialogContentText>
									<TextField
										error={productName.length === 0}
										value={productName}
										variant="standard"
										onChange={(e) => {
											setProductName(e.target.value);
										}}
									/>
									<Divider />
									<DialogContentText>Type:</DialogContentText>
									<TextField
										error={productType.length === 0}
										value={productType}
										variant="standard"
										onChange={(e) => {
											setProductType(e.target.value);
										}}
									/>
									<Divider />
									<DialogContentText>
										Description:
									</DialogContentText>
									<TextField
										error={productDescription.length === 0}
										value={productDescription}
										variant="standard"
										onChange={(e) => {
											setProductDescription(
												e.target.value
											);
										}}
									/>
									<Divider />
									<DialogContentText>
										Count :
									</DialogContentText>
									<TextField
										error={productCount <= 0}
										value={productCount}
										variant="standard"
										onChange={(e) => {
											setProductCount(e.target.value);
										}}
									/>
									<Divider />
								</DialogContent>
								<DialogActions>
									<Button onClick={handleAddClose}>
										Close
									</Button>
								</DialogActions>
								<DialogActions>
									<Button onClick={handleAddApproval}>
										Approve
									</Button>
								</DialogActions>
							</Dialog>
						</Grid>
						<Grid item xs={3}>
							<Button
								onClick={handleIDOpen}
								variant={"contained"}
								sx={{
									backgroundColor: "#2C3E50",
									height: 60,
									width: 300,
									fontSize: 22,
									fontWeight: "bold",
									border: "2px solid #FFFFFF"
								}}>
								DELETE PRODUCT
							</Button>
							<Dialog
								open={idOpen}
								TransitionComponent={Transition}
								keepMounted
								onClose={handleIDClose}
								aria-describedby="alert-dialog-slide-description">
								<DialogTitle>{"PRODUCT DETAILS"}</DialogTitle>
								<DialogContent>
									<DialogContentText>ID :</DialogContentText>
									<TextField
										error={productID <= 0}
										value={productID}
										variant="standard"
										onChange={(e) => {
											setProductID(e.target.value);
											localStorage.setItem(
												"id",
												e.target.value
											);
										}}
									/>
									<Divider />
								</DialogContent>
								<DialogActions>
									<Button onClick={handleIDClose}>
										Close
									</Button>
								</DialogActions>
								<DialogActions>
									<Button onClick={handleProductRemoval}>
										Approve
									</Button>
								</DialogActions>
							</Dialog>
						</Grid>
						<Grid item xs={3}>
							<Link
								to="/dashboard/retailer/history"
								style={{ textDecoration: "none" }}>
								<Button
									variant={"contained"}
									sx={{
										backgroundColor: "#2C3E50",
										height: 60,
										width: 200,
										fontSize: 22,
										fontWeight: "bold",
										border: "2px solid #FFFFFF"
									}}>
									History
								</Button>
							</Link>
						</Grid>
						<Grid item xs={3}>
							<Button
								onClick={handleClickOpen}
								variant={"contained"}
								sx={{
									backgroundColor: "#2C3E50",
									height: 60,
									width: 320,
									fontSize: 22,
									fontWeight: "bold",
									border: "2px solid #FFFFFF"
								}}>
								Inventory Details
							</Button>
						</Grid>
					</Grid>
					<DataGrid
						onRowDoubleClick={(e) => {
							handleDataOpen(e);
							localStorage.setItem("id", e.row.id);
						}}
						sx={{
							marginTop: 2,
							fontSize: 20,
							"& .MuiDataGrid-cell": {
								color: "white",
								backgroundColor: "#1D1F20",
							},
							color: "white",
						}}
						columns={columns}
						pageSize={7}
						rowsPerPageOptions={[7]}
						rows={rows}
					/>
					<Dialog
						open={dataOpen}
						TransitionComponent={Transition}
						keepMounted
						onClose={handleDataClose}
						aria-describedby="alert-dialog-slide-description">
						<DialogTitle>{"Options"}</DialogTitle>
						<DialogContent>
							<Button
								onClick={() => {
									handleDataClose();
									getProductItem();
									handleCountOpen();
								}}>
								<DialogContentText>ADD COUNT</DialogContentText>
							</Button>
							<Divider />
							<Button
								onClick={() => {
									handleDataClose();
									handleDecOpen();
								}}>
								<DialogContentText>
									DECREASE COUNT
								</DialogContentText>
							</Button>
							<Dialog
								open={decOpen}
								TransitionComponent={Transition}
								keepMounted
								onClose={handleDecClose}
								aria-describedby="alert-dialog-slide-description">
								<DialogTitle>{"PRODUCT DETAILS"}</DialogTitle>
								<DialogContent>
									<DialogContentText>
										Count :
									</DialogContentText>
									<TextField
										error={productCount <= 0}
										value={productCount}
										variant="standard"
										onChange={(e) => {
											setProductCount(e.target.value);
										}}
									/>
									<Divider />
								</DialogContent>
								<DialogActions>
									<Button onClick={handleDecClose}>
										Close
									</Button>
								</DialogActions>
								<DialogActions>
									<Button
										onClick={handleProductDecreaseCount}>
										Approve
									</Button>
								</DialogActions>
							</Dialog>
							<Divider />
							<Button
								onClick={() => {
									handleDataClose();
									getProductItem();
									handleIDOpen();
								}}>
								<DialogContentText>
									REMOVE PRODUCT
								</DialogContentText>
							</Button>
							<Divider />
							<Button>
								<DialogContentText
									onClick={() => {
										handleDataClose();
										getProductItem();
										handleEditOpen();
									}}>
									EDIT PRODUCT
								</DialogContentText>
							</Button>
							<Dialog
								open={editOpen}
								TransitionComponent={Transition}
								keepMounted
								onClose={handleEditClose}
								aria-describedby="alert-dialog-slide-description">
								<DialogTitle>{"PRODUCT DETAILS"}</DialogTitle>
								<DialogContent>
									<DialogContentText>Name:</DialogContentText>
									<TextField
										value={productName}
										variant="standard"
										onChange={(e) => {
											setProductName(e.target.value);
										}}
									/>
									<Divider />
									<DialogContentText>Type:</DialogContentText>
									<TextField
										value={productType}
										variant="standard"
										onChange={(e) => {
											setProductType(e.target.value);
										}}
									/>
									<Divider />
									<DialogContentText>
										Description:
									</DialogContentText>
									<TextField
										value={productDescription}
										variant="standard"
										onChange={(e) => {
											setProductDescription(
												e.target.value
											);
										}}
									/>
									<Divider />
									<DialogContentText>
										Count :
									</DialogContentText>
									<TextField
										value={productCount}
										variant="standard"
										onChange={(e) => {
											setProductCount(e.target.value);
										}}
									/>
									<Divider />
								</DialogContent>
								<DialogActions>
									<Button onClick={handleEditClose}>
										Close
									</Button>
								</DialogActions>
								<DialogActions>
									<Button onClick={editProductData}>
										Approve
									</Button>
								</DialogActions>
							</Dialog>
							<Divider />
						</DialogContent>
						<DialogActions>
							<Button onClick={handleDataClose}>Close</Button>
						</DialogActions>
					</Dialog>
					<Dialog
						open={countOpen}
						TransitionComponent={Transition}
						keepMounted
						onClose={handleCountClose}
						aria-describedby="alert-dialog-slide-description">
						<DialogTitle>{"PRODUCT DETAILS"}</DialogTitle>
						<DialogContent>
							<DialogContentText>Count :</DialogContentText>
							<TextField
								error={productCount.length === 0}
								value={productCount}
								variant="standard"
								onChange={(e) => {
									setProductCount(e.target.value);
								}}
							/>
							<Divider />
						</DialogContent>
						<DialogActions>
							<Button onClick={handleCountClose}>Close</Button>
						</DialogActions>
						<DialogActions>
							<Button onClick={handleAddApproval}>Approve</Button>
						</DialogActions>
					</Dialog>
					<Dialog
						open={open}
						TransitionComponent={Transition}
						keepMounted
						onClose={handleClose}
						aria-describedby="alert-dialog-slide-description">
						<DialogTitle>{"INVENTORY DETAILS"}</DialogTitle>
						<DialogContent>
							<DialogContentText>
								ID: {data["inventory_id"]}
							</DialogContentText>
							<Divider />
							<DialogContentText>
								TYPE: {data["inventory_type"]}
							</DialogContentText>
							<Divider />
							<DialogContentText>
								Count: {data["inventory_count"]/2} 
							</DialogContentText>
							<Divider />
							<DialogContentText>
								Max Count: {data["inventory_max_count"]}
							</DialogContentText>
							<Divider />
							<DialogContentText>
								Description: {data["inventory_description"]}
							</DialogContentText>
							<Divider />
						</DialogContent>
						<DialogActions>
							<Button onClick={handleClose}>Close</Button>
						</DialogActions>
					</Dialog>
				</Stack>
			</Stack>
		</div>
	);
}
export default InventoryPage;
