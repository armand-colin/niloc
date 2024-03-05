import "./ConnectionListViewItem.scss";
import { Identity } from "@niloc/core";

type Props = {
	connection: Identity
}

export function ConnectionListViewItem(props: Props) {
	return <div className="ConnectionListViewItem">
		{props.connection.userId} {props.connection.host ? "host" : ""}
	</div>
}
