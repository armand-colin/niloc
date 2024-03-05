import { ConnectionList } from "@niloc/core";
import "./ConnectionListView.scss";
import { useConnectionList } from "../../hooks/useConnectionList";
import { ConnectionListViewItem } from "./item/ConnectionListViewItem";

type Props = {
	connectionList: ConnectionList;
}


export function ConnectionListView(props: Props) {
	const connections = useConnectionList(props.connectionList)

	return <div className="ConnectionListView">
		{connections.map((connection) => <ConnectionListViewItem
			connection={connection}
			key={connection.userId}
		/>)}
	</div>
}