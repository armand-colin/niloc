import { useContext, useState } from "react";
import "./PostItsView.scss";
import { AppContext } from "../../contexts/AppContext";
import { useObjects } from "../../hooks/useObjects";
import { PostIt } from "../../types/PostIt";
import { useObject } from "../../hooks/useObject";

export function PostItsView() {
	const [editing, setEditing] = useState<PostIt | null>(null)
	const { framework } = useContext(AppContext)
	const postIts = useObjects(framework.model, PostIt)

	function onEdit(postIt: PostIt) {
		setEditing(postIt)
	}

	function onAdd() {
		const postIt = framework.model.instantiate(PostIt)
		setEditing(postIt)
	}

	return <div className="PostItsView">
		{editing ? <Edit
			postIt={editing}
			onValidate={() => setEditing(null)}
		/> : undefined}
		<ul>
			{
				postIts.map(postIt => <View
					key={postIt.id}
					postIt={postIt}
					onClick={() => onEdit(postIt)}
				/>)
			}
		</ul>
		<button onClick={onAdd}>ajouter</button>
	</div>
}

function Edit(props: { postIt: PostIt, onValidate: () => void }) {
	const [title, setTitle] = useState(() => props.postIt.title)
	const [content, setContent] = useState(() => props.postIt.content)

	function onValidate() {
		props.postIt.title = title
		props.postIt.content = content
		props.onValidate()
	}

	return <section>
		<input value={title} onChange={e => setTitle(e.target.value)} type="text" />
		<textarea value={content} onChange={e => setContent(e.target.value)} />
		<button onClick={onValidate}>valider</button>
	</section>
}

function View(props: { postIt: PostIt, onClick: () => void }) {
	useObject(props.postIt)

	return <li>
		<p>{props.postIt.title}</p>
		<small>{props.postIt.content}</small>
		<button onClick={() => props.postIt.delete()}>supprimer</button>
		<button onClick={props.onClick}>editer</button>
	</li>
}	