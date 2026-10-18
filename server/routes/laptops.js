import express from 'express'
import {
  getLaptops,
  getLaptop,
  createLaptop,
  updateLaptop,
  deleteLaptop
} from '../controllers/laptops.js'

const router = express.Router()

router.get('/', getLaptops)
router.get('/:id', getLaptop)
router.post('/', createLaptop)
router.put('/:id', updateLaptop)
router.delete('/:id', deleteLaptop)

export default router