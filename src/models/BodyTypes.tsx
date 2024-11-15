type Body = {
	sex: BodySex
	charact: BodyCharacteristics
	conservation_state: BodyConservationState
}

enum BodySex {
	MaleGen,
	FemaleGen,
	Undefined
}

type BodyCharacteristics = {
	skin: BodySkinColor,
	eyes: BodyEye,
	nose: BodyNose,
	ears: BodyEars,
	mouth: BodyMouth,
	lips: BodyLips,
	chin: BodyChin,
	head_hair: BodyHeadHair
}

enum BodySkinColor {
	Pale,
	LightWhite,
	DarkWhite,
	LightBrown,
	Brown,
	Black,
	Undefined
}

type BodyEye = {
	color: string,
	other_charact: string
}

type BodyNose = {
	other_charact: string
}

type BodyEars = {
	attached_lobe: boolean
	holes: BodyEarHoles
	other_charact: string
}

type BodyEarHoles = {
	sx: boolean
	dx: boolean
}

type BodyMouth = {
	other_charact: string
}

type BodyLips = {
	other_charact: string
}

type BodyChin = {
	other_charact: string
}

type BodyHeadHair = {
	hair: BodyHair
	eyebrows: BodyEyebrows
	facial_hair: BodyFacialHair
}

type BodyHair = {
	type: BodyHairType
	length: BodyHairLength
	color: BodyHairColor
	artificial_color?: BodyHairColor
	baldness: BodyHairBaldness
	other_charact: string
}

enum BodyHairType {
	Natural,
	Extension,
	Wig,
	Toupee,
	Implant
}

enum BodyHairLength {
	Short,
	Medium,
	Long,
	Bald
}

enum BodyHairColor {
	Blond,
	Brown,
	Black,
	Red,
	Grey,
	Grizzled,
	Other,
	Unknown
}

enum BodyHairBaldness {
	Partial,
	Total,
	Frontal,
	Lateral,
	Tonsure
}

type BodyEyebrows = {
	color: BodyHairColor,
	artificial_color?: BodyHairColor,
	other_charact: string
}

type BodyFacialHair = {
	type: BodyFacialHairType
	color: BodyHairColor,
	artificial_color?: BodyHairColor,
	other_charact: string
}

enum BodyFacialHairType {
	Shaved,
	Moustache,
	Goatee,
	Beard,
	Other
}

type BodyConservationState = {
	type: BodyConservationStateType
	burned_carbonized_level?: GCSLevel
}

enum BodyConservationStateType {
	GoodState,
	DecolorationStage,
	EmphysematousStage,
	LiquefactiveStage,
	PartiallySkeletonized,
	Skeletonized,
	BurnedCarbonized,
	Saponified,
	MummifiedOrLeatheryfied
}
// ? depezzamento ? distretti corporei slide 11

enum GCSLevel {
	Level1,
	Level2,
	Level3,
	Level4,
	Level5
}