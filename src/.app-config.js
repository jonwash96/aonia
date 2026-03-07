export const defaultProfilePhotoMale = '/svg/default-profile-photo_male.svg'
export const defaultProfilePhotoFemale = '/svg/default-profile-photo_female.svg'
export const defaultProfilePhotoAndro = '/svg/default-profile-photo_androgynous.svg'

export function defaultProfilePhoto(user) {
	return '/default-profile-photo.jpg'
	switch (user.profile.info.gender) {
		case 'Male': return defaultProfilePhotoMale;
		case 'Female': return defaultProfilePhotoFeale;
		case 'Androgynous': 
		case 'Other':
		case 'Decline': 
		// default: return defaultProfilePhotoAndro;
	}
}