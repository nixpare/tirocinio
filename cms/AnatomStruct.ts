import { Component, Document } from './Document';

export enum AnatomStructType {
	Osso = 'ossa'
}

export type AnatomStruct = Document & {
	Nome: string
	Sezioni: Sezione[]
}

export type Sezione = Component & {
	Nome: string
}
