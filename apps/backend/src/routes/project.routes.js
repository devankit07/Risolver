import express from 'express';
import { createProject, getProjects, updateProject, deleteProject } from '../controllers/project.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/', createProject);
router.get('/', getProjects);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
