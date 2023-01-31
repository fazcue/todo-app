import React, { useState, useEffect, useCallback } from 'react'
import List from './components/List'

type Todo = {
	id: number
	text: string
	completed: boolean
}

function App() {
	const [todos, setTodos] = useState<Todo[] | null>(null)
	const [todo, setTodo] = useState<string>('')

	const handleTodo = (e: React.FormEvent<HTMLInputElement>) => {
		setTodo(e.currentTarget.value)
	}

	const handleAdd = () => {
		const newTodo = {
			id: Date.now(),
			text: todo,
			completed: false,
		}

		if (todos) {
			setTodos((prev) => {
				if (prev) {
					return [...prev, newTodo]
				}
				return [newTodo]
			})
		}

		setTodo('')
	}

	const toggleCompleted = (id: Todo['id']) => {
		console.log('toggled')

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

	const handleDelete = (id: Todo['id']) => {
		setTodos((prev) => {
			if (prev) {
				return prev.filter((todo) => todo.id !== id)
			}
			return null
		})
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
			setTodos(JSON.parse(localTodos))
		}
	}, [])

	return (
		<main className="main">
			<h1 className="title">Todo App</h1>
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
				<List
					todos={todos}
					setTodos={setTodos}
					toggleCompleted={toggleCompleted}
					handleDelete={handleDelete}
				/>
			) : (
				<p className="noTasks">No tasks added</p>
			)}
			<p className="howTo">{`Drag & drop to reorder`}</p>
			<p className="howTo">{`Double click to mark as completed`}</p>
			<p className="howTo">{`Click on 'X' to remove`}</p>
		</main>
	)
}

export default App
