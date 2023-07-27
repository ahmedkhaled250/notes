import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
import path from 'path'
import {fileURLToPath} from 'url'
const __direName = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({path:path.join(__direName,'../../config/.env')})
cloudinary.v2.config({ 
    cloud_name: process.env.cloudName, 
    api_key: process.env.apiKey, 
    api_secret: process.env.apiSecret,
    secure: true
  });
  export default cloudinary.v2