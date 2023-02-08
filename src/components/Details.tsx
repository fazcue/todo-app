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

	const handleTitle = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setData((prev) => {
			if (prev) {
				return {
					...prev,
					title: e.target.value,
				}
			}
			return null
		})
		handleEdit(todo, 'title', e.target.value)
	}

	const handleDescription = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	): void => {
		setData((prev) => {
			if (prev) {
				return {
					...prev,
					description: e.target.value,
				}
			}
			return null
		})
		handleEdit(todo, 'description', e.target.value)
	}

	return (
		<div className="details">
			<span style={{ fontSize: '16px' }}>Title</span>
			<input
				name="title"
				value={data?.title || ''}
				onChange={handleTitle}
				maxLength={30}
				autoComplete="off"
			/>
			<span style={{ height: '4px' }} />
			<span style={{ fontSize: '16px' }}>Description</span>
			<textarea
				name="description"
				value={data?.description || ''}
				onChange={handleDescription}
				maxLength={120}
				rows={5}
				autoComplete="off"
			/>
			<span className="howTo">Changes are auto saved</span>
		</div>
	)
}

export default Details
