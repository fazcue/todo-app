import { useRef } from 'react'
import { Reorder } from 'framer-motion'

type Todo = {
	id: number
	text: string
	completed: boolean
}

//Lists
interface IList {
	todos: Todo[]
	setTodos: (todo: Todo[]) => void
	toggleCompleted: (id: number) => void
	handleDelete: (id: number) => void
}

const List = ({ todos, setTodos, toggleCompleted, handleDelete }: IList) => {
	const constraintsRef = useRef(null)

	return (
		<Reorder.Group
			values={todos}
			onReorder={setTodos}
			className="todoList"
			ref={constraintsRef}
		>
			{todos.map((todo, index) => {
				return (
					<Reorder.Item
						value={todo}
						key={todo.id}
						style={{
							display: 'flex',
							gap: '3px',
						}}
						dragConstraints={constraintsRef}
					>
						<span className="position">#{index + 1}</span>
						<span
							className="todoItem"
							style={{
								textDecoration: todo.completed
									? 'line-through'
									: 'none',
								backgroundColor: todo.completed
									? 'darkgreen'
									: index % 2 === 0
									? 'dimgray'
									: 'darkgray',
							}}
							onDoubleClick={() => toggleCompleted(todo.id)}
						>
							{todo.text}
						</span>
						<button onClick={() => handleDelete(todo.id)}>
							{' '}
							X{' '}
						</button>
					</Reorder.Item>
				)
			})}
		</Reorder.Group>
	)
}

export default List
