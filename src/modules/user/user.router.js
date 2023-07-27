import {Router} from 'express'
import { auth } from '../../middleWear/auth.js'
import { fileValidation, HME, myMulter } from '../../service/multer.js'
// import {validation} from '../../middleWear/validation.js'
// import * as validators from './user.validation.js'
import * as UC from './controller/user.js'
import { endPoint } from './user.endPoint.js'
const router = Router()
router.get('/profile',auth(endPoint.profile),UC.getProfile)
router.post('/profilePic',auth(endPoint.profile),myMulter(fileValidation.image).single('image'),HME('/api/v1/user/profile'),UC.profilePic)
router.get('/deleteAccount',auth(endPoint.profile),UC.deleteAccount)
router.get('/getUpdateProfile',auth(endPoint.profile),UC.getUpdateProfile)
router.post('/updateProfile',auth(endPoint.profile),UC.updateProfile)
export default router