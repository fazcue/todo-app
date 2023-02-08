import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Todo } from '../types'

const MySwal = withReactContent(Swal)

import Details from '../components/Details'

interface Alert {
	editToDo: (
		todo: Todo,
		handleEdit: (
			todo: Todo,
			field: 'title' | 'description',
			value: string
		) => void
	) => Promise<boolean>
	close: () => void
}

const alert: Alert = {
	editToDo: async (
		todo: Todo,
		handleEdit: (
			todo: Todo,
			field: 'title' | 'description',
			value: string
		) => void
	): Promise<boolean> => {
		let res = false
		await MySwal.fire({
			title: `Editing`,
			html: <Details todo={todo} handleEdit={handleEdit} />,
			showConfirmButton: false,
			showCancelButton: false,
			background: '#222',
			color: '#fff',
			heightAuto: false,
			allowOutsideClick: true,
		}).then((result) => {
			if (result.isConfirmed) {
				res = true
			}
		})
		return res
	},
	close: () => {
		Swal.clickConfirm()
	},
}

export default alert
