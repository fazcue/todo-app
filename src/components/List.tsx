import { useRef } from 'react'
import { IList } from '../types'
import { Reorder } from 'framer-motion'
import alert from '../services/alert'

const List = ({
	todos,
	setTodos,
	toggleCompleted,
	handleDelete,
	handleBasedOn,
	handleEdit,
	isSelected,
}: IList) => {
	const constraintsRef = useRef(null)

	if (todos.length === 0) {
		return <p className="noTasks">No ToDo/s added yet</p>
	}

	return (
		<Reorder.Group
			values={todos}
			onReorder={setTodos}
			className="todoList"
			ref={constraintsRef}
		>
			{todos.map((todo, index) => {
				const isCompleted =
					(todo.subsTodos &&
						todo.subsTodos?.length > 0 &&
						!todo.subsTodos?.some((todo) => !todo.completed)) ||
					todo.completed

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
								textDecoration: isCompleted
									? 'line-through'
									: 'none',
								backgroundColor: isCompleted
									? 'darkgreen'
									: index % 2 === 0
									? 'dimgray'
									: 'darkgray',
							}}
							onDoubleClick={() => toggleCompleted(todo.id)}
						>
							{todo.title}
						</span>
						<button
							onClick={() => alert.editToDo(todo, handleEdit)}
						>
							{' '}
							E{' '}
						</button>
						<button onClick={() => handleDelete(todo.id)}>
							{' '}
							X{' '}
						</button>
						{!isSelected && (
							<button
								onClick={() => handleBasedOn(todo.id)}
								className="basedOn"
								style={{
									backgroundColor:
										todo.subsTodos &&
										todo.subsTodos.length > 0
											? 'rgba(39, 245, 161, 0.4)'
											: '',
								}}
							>
								↳
							</button>
						)}
					</Reorder.Item>
				)
			})}
		</Reorder.Group>
	)
}

export default List
