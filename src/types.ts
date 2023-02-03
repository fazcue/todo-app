type Todo = {
	id: number
	text: string
	completed: boolean
	subsTodos?: Todo[]
}

interface IList {
	todos: Todo[]
	setTodos: (todo: Todo[]) => void
	toggleCompleted: (id: number) => void
	handleDelete: (id: number) => void
	handleBasedOn: (id: Todo['id']) => void
	isSelected: boolean
}

export type { Todo, IList }