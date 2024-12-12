import { FormTemplate } from "./Form"

export type AnatomStruct = {
	type: AnatomStructType
	name: string
	template: FormTemplate
}

export type AnatomStructType = 'bone'

// started prototype for schema validation on AnatomStruct in MongoDB
// not sure if needed or it there is a way to automate this,
// implemented up to AnatomStruct.template.sections.tables.fields
// @ts-ignore
const anatomStructJSONSchema = {
	$jsonSchema: {
		// type AnatomStruct
		bsonType: "object",
		required: ["type", "name", "template"],
		properties: {
			// AnatomStruct.type: AnatomStructType
			// type AnatomStructType = 'bone'
			type: {
				bsonType: "string",
				enum: ["bone"]
			},
			// AnatomStruct.name: string
			name: {
				bsonType: "string"
			},
			// AnatomStruct.template: FormTemplate
			// type FormTemplate
			template: {
				bsonType: "object",
				required: ["name", "sections"],
				properties: {
					// FormTemplate.name: string
					name: {
						bsonType: "string"
					},
					// FormTemplate.sections: FormSectionTemplate[]
					sections: {
						bsonType: "array",
						// type FormSectionTemplate
						items: {
							bsonType: "object",
							required: ["title", "tables"],
							properties: {
								// FormSectionTemplate.title: string
								title: {
									bsonType: "string"
								},
								// FormSectionTemplate.tables: FormTableTemplate[]
								tables: {
									bsonType: "array",
									//type FormTableTemplate
									items: {
										bsonType: "object",
										required: ["headers", "fields"],
										properties: {
											// FormTableTemplate.headers: string[]
											headers: {
												bsonType: "array",
												items: { bsonType: "string" }
											},
											// FormTableTemplate.fields: FormTableFieldTemplate[]
											fields: {
												bsonType: "array",
												// type FormTableFieldTemplate
												items: {
													bsonType: "object",
												}
											},
											// FormTableTemplate.isVariadic?: boolean
											isVariadic: {
												bsonType: "bool",
											},
											// FormTableTemplate.interactsWithImage?: boolean
											interactsWithImage: {
												bsonType: "bool",
											},
										}
									}
								},
								// FormSectionTemplate.image?: string[]
								image: {
									bsonType: "array",
									items: {
										bsonType: "string"
									}
								}
							}
						}
					}
				}
			}
		}
	}
}
