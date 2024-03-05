import { User } from "../../../User";
import { useSyncObject } from "../../../hooks/useSyncObject";
import "./PresenceUserView.scss";

type Props = {
	user: User
}

export function PresenceUserView(props: Props) {
	const user = useSyncObject(props.user)

	return <div className="PresenceUserView">
		{user.name} ({user.identity.userId} - {user.identity.host})
	</div>
}
