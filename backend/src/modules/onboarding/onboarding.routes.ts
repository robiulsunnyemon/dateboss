import { Router } from 'express';
import { OnboardingController } from './onboarding.controller';
import { authenticateUser } from '../../middleware/auth';

const router = Router();

router.use(authenticateUser);

router.post('/step2/guest', OnboardingController.saveGuestEvents);
router.post('/step2/host', OnboardingController.saveHostInterests);
router.post('/step4/details', OnboardingController.saveDetails);
router.post('/step5/lifestyle', OnboardingController.saveLifestyle);
router.post('/step6/career', OnboardingController.saveCareer);
router.post('/step7/prompts', OnboardingController.savePrompts);
router.post('/step8/photos', OnboardingController.savePhotos);
router.post('/step10/verification', OnboardingController.submitVerification);
router.post('/step12/finalize', OnboardingController.finalizeOnboarding);

export default router;
