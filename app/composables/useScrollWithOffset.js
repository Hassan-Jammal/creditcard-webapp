export const useScrollWithOffset = () => {
	const scrollToWithOffset = (id, offset = 140) => {
		if (process.server) return

		const el = document.getElementById(id)
		if (!el) return

		const y =
			el.getBoundingClientRect().top +
			window.pageYOffset -
			offset

		window.scrollTo({
			top: y,
			behavior: 'smooth',
		})
	}

	return { scrollToWithOffset }
}
