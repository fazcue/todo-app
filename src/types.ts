type Todo = {
	id: number
	title: string
	description?: string
	completed: boolean
	subsTodos?: Todo[]
}

interface IList {
	todos: Todo[]
	setTodos: (todo: Todo[]) => void
	toggleCompleted: (id: number) => void
	handleDelete: (id: number) => void
	handleBasedOn: (id: Todo['id']) => void
	handleEdit: (todo: Todo, field: 'title' | 'description', value: string) => void
	isSelected: boolean
}

export type { Todo, IList }
