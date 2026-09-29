import { Router } from 'express';
import { StudentController } from './student.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import {
  upsertStudentProfileSchema,
  createEducationSchema,
  createAcademicRecordSchema,
  createProjectSchema,
  createCertificationSchema,
} from './student.schema.js';

const router = Router();

// All student self-service routes require authentication
router.use(requireAuth);

// Profile
router.get('/me', asyncHandler(StudentController.getMe));
router.put(
  '/me',
  validateRequest({ body: upsertStudentProfileSchema }),
  asyncHandler(StudentController.upsertMe)
);

// Education
router.get('/me/education', asyncHandler(StudentController.getEducation));
router.post(
  '/me/education',
  validateRequest({ body: createEducationSchema }),
  asyncHandler(StudentController.addEducation)
);
router.delete('/me/education/:id', asyncHandler(StudentController.deleteEducation));

// Academics
router.get('/me/academics', asyncHandler(StudentController.getAcademics));
router.post(
  '/me/academics',
  validateRequest({ body: createAcademicRecordSchema }),
  asyncHandler(StudentController.addAcademicRecord)
);
router.delete('/me/academics/:id', asyncHandler(StudentController.deleteAcademicRecord));

// Projects
router.get('/me/projects', asyncHandler(StudentController.getProjects));
router.post(
  '/me/projects',
  validateRequest({ body: createProjectSchema }),
  asyncHandler(StudentController.addProject)
);
router.delete('/me/projects/:id', asyncHandler(StudentController.deleteProject));

// Certifications
router.get('/me/certifications', asyncHandler(StudentController.getCertifications));
router.post(
  '/me/certifications',
  validateRequest({ body: createCertificationSchema }),
  asyncHandler(StudentController.addCertification)
);
router.delete('/me/certifications/:id', asyncHandler(StudentController.deleteCertification));

export const studentRoutes = router;
