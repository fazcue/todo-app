import { Todo } from '../types'
import { useEffect, useState } from 'react'

interface Props {
	todo: Todo
	handleEdit: (
		todo: Todo,
		field: 'title' | 'description',
		value: string
	) => void
}

const Details = ({ todo, handleEdit }: Props): JSX.Element => {
	const [data, setData] = useState<Todo | null>(null)

	useEffect(() => {
		setData(todo)
	}, [todo])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log('change', e.currentTarget.name, e.currentTarget.value)

		let field: 'title' | 'description' | null = null

		if (e.target.name === 'title' || e.target.name === 'description') {
			field = e.target.name

			setData((prev) => {
				if (prev) {
					return {
						...prev,
						[e.target.name]: e.target.value,
					}
				}
				return null
			})
			handleEdit(todo, field, e.target.value)
		}
	}

	return (
		<>
			<input
				name="title"
				value={data?.title || ''}
				onChange={handleChange}
				autoFocus
				maxLength={30}
				autoComplete="off"
			/>
			<input
				name="description"
				value={data?.description || ''}
				onChange={handleChange}
				autoFocus
				maxLength={30}
				autoComplete="off"
			/>
		</>
	)
}

export default Details
