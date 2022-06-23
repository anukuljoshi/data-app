import { Download } from "@mui/icons-material";
import { IconButton, ListItem, ListItemText } from "@mui/material";

import { MEDIA_URL } from "../../constants/api";

interface FileListItemProps {
	index: number;
	item: CSVData;
}

const FileListItem = (props: FileListItemProps) => {
	return (
		<ListItem
			secondaryAction={
				<IconButton edge="end" aria-label="delete">
					<a href={`${MEDIA_URL}${props.item.csv_file}`} download>
						<Download />
					</a>
				</IconButton>
			}
		>
			<ListItemText primary={props.item.name} />
		</ListItem>
	);
};

interface FileListProps {
	data: CSVData[];
}

const FileList = (props: FileListProps) => {
	return (
		<>
			{props.data.map((item, index) => (
				<FileListItem key={index} index={index} item={item} />
			))}
		</>
	);
};

export default FileList;
