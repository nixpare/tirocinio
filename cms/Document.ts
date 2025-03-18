export type Component = {
	id: number
}

export type Document = Component & {
	documentId: string
	createdAt: string
	updatedAt: string
	publishedAt: string
}
