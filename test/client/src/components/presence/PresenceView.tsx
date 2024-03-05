import { User } from "../../User";
import { usePresence } from "../../hooks/usePresence";
import "./PresenceView.scss";
import { Presence } from "@niloc/core";
import { PresenceUserView } from "./userView/PresenceUserView";

type Props = {
	presence: Presence<User>
}

export function PresenceView(props: Props) {
	const users = usePresence(props.presence)

	return <div className="PresenceView">
		<h1>Presence users</h1>
		{users.map(user => <PresenceUserView 
			user={user}
			key={user.identity.userId}
		/>)}
	</div>
}
