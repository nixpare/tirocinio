export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object
	? T[P] extends Function
	? T[P] // non applica a funzioni
	: DeepPartial<T[P]>
	: T[P];
};