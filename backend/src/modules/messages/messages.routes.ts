import { Router } from 'express';
import { MessagesController } from './messages.controller';
import { authenticateUser } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';
import { validateBody } from '../../middleware/validate';
import { flagMessageSchema, sendMessageSchema } from '../../validators/schemas';

const router = Router();

router.use(authenticateUser);

router.get('/conversations', asyncHandler(MessagesController.getConversations));
router.post('/call-token', asyncHandler(MessagesController.getCallToken));
router.get('/:offerId', asyncHandler(MessagesController.getMessages));
router.post(
  '/:offerId',
  validateBody(sendMessageSchema),
  asyncHandler(MessagesController.sendMessage)
);
router.post(
  '/:messageId/flag',
  validateBody(flagMessageSchema),
  asyncHandler(MessagesController.flagMessage)
);

export default router;
