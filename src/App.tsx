import React, { useState, useEffect, useCallback } from 'react'
import { Todo } from './types'
import List from './components/List'

interface OldTodo {
	id: number
	text: string
	completed: boolean
	subsTodos?: Todo[]
}

function App() {
	const [todos, setTodos] = useState<Todo[] | null>(null)
	const [todo, setTodo] = useState<string>('')

	const [selected, setSelected] = useState<Todo | null>(null)
	const [selectedTodos, setSelectedTodos] = useState<Todo[] | null>(null)

	const handleTodo = (e: React.FormEvent<HTMLInputElement>) => {
		setTodo(e.currentTarget.value)
	}

	const handleAdd = () => {
		const newTodo: Todo = {
			id: Date.now(),
			title: todo,
			completed: false,
		}

		if (selected && todos) {
			setTodos((prev) => {
				if (prev) {
					return prev.map((todo) => {
						if (todo.id === selected.id) {
							if (todo.subsTodos) {
								setSelected({
									...todo,
									subsTodos: [...todo.subsTodos, newTodo],
								})
								return {
									...todo,
									subsTodos: [...todo.subsTodos, newTodo],
								}
							} else {
								setSelected({
									...todo,
									subsTodos: [newTodo],
								})
								return {
									...todo,
									subsTodos: [newTodo],
								}
							}
						}
						return todo
					})
				}
				return null
			})
		} else if (todos) {
			setTodos((prev) => {
				if (prev) {
					return [...prev, newTodo]
				}
				return [newTodo]
			})
		} else {
			setTodos([newTodo])
		}

		setTodo('')
	}

	const toggleCompleted = (id: Todo['id']) => {
		let newSelected: Todo | null = null
		if (selected) {
			newSelected = { ...selected }

			if (newSelected.subsTodos) {
				newSelected.subsTodos = newSelected.subsTodos.map((todo) => {
					if (todo.id === id) {
						return {
							...todo,
							completed: !todo.completed,
						}
					}
					return todo
				})
			}

			setSelected(newSelected)

			setTodos((prev) => {
				if (prev) {
					return prev.map((todo) => {
						if (todo.id === newSelected?.id) {
							return newSelected
						}
						return todo
					})
				}
				return null
			})
		} else {
			setTodos((prev) => {
				if (prev) {
					return prev.map((todo) => {
						if (todo.id === id) {
							return {
								...todo,
								completed: !todo.completed,
							}
						}
						return todo
					})
				}
				return null
			})
		}
	}

	const handleDelete = (id: Todo['id']) => {
		let newSelected: Todo | null = null
		if (selected) {
			setSelected((prev) => {
				if (prev) {
					if (prev.subsTodos && prev.subsTodos.length > 0) {
						newSelected = {
							...prev,
							subsTodos: prev.subsTodos.filter(
								(todo) => todo.id !== id
							),
						}
						return newSelected
					}
					return prev
				}
				return null
			})

			setTodos((prev) => {
				if (prev) {
					return prev.map((todo) => {
						if (todo.id === selected.id && newSelected) {
							return newSelected
						}
						return todo
					})
				}
				return null
			})
		} else {
			setTodos((prev) => {
				if (prev) {
					return prev.filter((todo) => todo.id !== id)
				}
				return null
			})
		}
	}

	const handleEdit = async (
		currentTodo: Todo,
		field: 'title' | 'description',
		value: string
	) => {
		let newSelected: Todo | null = null
		if (selected) {
			newSelected = { ...selected }

			if (newSelected.subsTodos) {
				newSelected.subsTodos = newSelected.subsTodos.map((todo) => {
					if (todo.id === currentTodo.id) {
						return {
							...todo,
							[field]: value,
						}
					}
					return todo
				})
			}

			setSelected(newSelected)

			setTodos((prev) => {
				if (prev) {
					return prev.map((todo) => {
						if (todo.id === newSelected?.id) {
							return newSelected
						}
						return todo
					})
				}
				return null
			})
		} else {
			setTodos((prev) => {
				if (prev) {
					return prev.map((todo) => {
						if (todo.id === currentTodo.id) {
							return {
								...todo,
								[field]: value,
							}
						}
						return todo
					})
				}
				return null
			})
		}
	}

	const handleUserKeyPress = useCallback(
		(event: KeyboardEvent) => {
			const { key } = event
			if (key === 'Enter' && todo) {
				handleAdd()
			}
		},
		[todo]
	)

	//based on
	//TODO: Add more than ONE level?
	const handleBasedOn = (id: Todo['id']) => {
		let newSelected = todos?.find((todo) => todo.id === id)

		if (newSelected) {
			if (!newSelected.subsTodos) {
				newSelected.subsTodos = []
			}
			setSelected(newSelected)
			setSelectedTodos(newSelected.subsTodos)
		}
	}

	//Effects
	useEffect(() => {
		window.addEventListener('keydown', handleUserKeyPress)
		return () => {
			window.removeEventListener('keydown', handleUserKeyPress)
		}
	}, [handleUserKeyPress])

	useEffect(() => {
		if (todos) {
			localStorage.setItem('todos', JSON.stringify(todos))
		}
	}, [todos])

	useEffect(() => {
		const localTodos = localStorage.getItem('todos')

		if (localTodos) {
			//convert ToDos to new format
			const todosArray = JSON.parse(localTodos)

			if (todosArray[0].text) {
				const oldTodos: OldTodo[] = [...todosArray]

				const newTodos = oldTodos.map((todo) => {
					let newT: Todo = {
						id: todo.id,
						title: todo.text,
						description: '',
						completed: todo.completed,
					}

					if (todo.subsTodos) {
						newT.subsTodos = todo.subsTodos
					}

					return newT
				})

				setTodos(newTodos)
			} else {
				setTodos(todosArray)
			}
		}
	}, [])

	useEffect(() => {
		if (selected) {
			setSelected((selected) => {
				if (selected && selectedTodos) {
					return {
						...selected,
						subsTodos: selectedTodos,
					}
				}
				return null
			})

			setTodos((prev) => {
				if (prev) {
					return prev?.map((todo) => {
						if (todo.id === selected.id && selectedTodos) {
							return {
								...todo,
								subsTodos: selectedTodos,
							}
						}
						return todo
					})
				}
				return prev
			})
		}
	}, [selectedTodos])

	return (
		<main className="main">
			<h1 className="title">ToDo App</h1>
			<p className="description">React + Framer Motion + LocalStorage</p>
			<div className="todoForm">
				<input
					name="todo"
					value={todo}
					onChange={(e) => handleTodo(e)}
					autoFocus
					maxLength={30}
					autoComplete="off"
				/>
				<button onClick={handleAdd} disabled={todo ? false : true}>
					Add
				</button>
			</div>

			{todos && todos.length > 0 ? (
				<>
					{selected && (
						<p>
							<button
								onClick={() => setSelected(null)}
								className="bread"
							>
								All
							</button>
							{` ↳ `}
							<span className="selectedTitle">
								{selected.title}
							</span>
						</p>
					)}
					<List
						todos={selected?.subsTodos || todos}
						setTodos={selected ? setSelectedTodos : setTodos}
						toggleCompleted={toggleCompleted}
						handleDelete={handleDelete}
						handleBasedOn={handleBasedOn}
						handleEdit={handleEdit}
						isSelected={selected ? true : false}
					/>
				</>
			) : (
				<p className="noTasks">No ToDo/s added yet</p>
			)}

			<p className="howTo">{`Drag & drop to reorder`}</p>
			<p className="howTo">{`Double click to mark as completed`}</p>
			<p className="howTo">{`Click on 'X' to remove`}</p>
			<p className="howTo">{`Click on '↳' to add subs todos`}</p>
		</main>
	)
}

export default App
