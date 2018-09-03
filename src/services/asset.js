import Api from '@/services/api'
import {extract} from '@/client_util'

function create (spaceId) {
  return Api.create('assets', {scope: {spaceId}})
}

function cloudinaryOptions (space) {
  const cloudName = extract(space.contentfulUrl, /@(.+)$/, {group: 1})
  if (cloudName && space.contentfulPreset) {
    // See: https://cloudinary.com/documentation/upload_widget
    return {
      cloud_name: cloudName,
      upload_preset: space.contentfulPreset,
      multiple: false,
      sources: ['local', 'url', 'dropbox', 'image_search', 'facebook', 'instagram'],
      google_api_key: process.env.VUE_APP_GOOGLE_API_KEY
    }
  } else {
    return undefined
  }
}

export default Object.assign(create, {
  cloudinaryOptions
})
