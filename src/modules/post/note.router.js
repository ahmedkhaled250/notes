import {Router} from 'express'
import { auth } from '../../middleWear/auth.js'
import { fileValidation, HME, myMulter } from '../../service/multer.js'
import * as NC from './controller/note.js'
import { endPoint } from './note.endPoint.js'
const router = Router()
router.get('/',NC.getNotes)
router.post('/',auth(endPoint.addNote),myMulter(fileValidation.image).single('image'),HME('/api/v1/note'),NC.addNote)
router.get('/:id/deleteNote',auth(endPoint.addNote),NC.deleteNote)
router.get('/:id/getNoteToUpdate',NC.getNoteToUpdate)
router.post('/:id/updateNote',auth(endPoint.addNote),myMulter(fileValidation.image).single('image'),HME('/api/v1/note'),NC.updateNote)
export default router