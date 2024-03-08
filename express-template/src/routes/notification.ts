import {Request, Response, Router} from 'express';
import {asyncHandler} from '../middlewares/async-handler';
import {authenticate} from '../middlewares/authenticate';
import {supabase} from '../supabase/supabase-client';

const router = Router();

router.put('/push-notification-token', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.decodedToken.sub;

  const {data} = await supabase.from('users')
                               .select('push_notification_token')
                               .eq('id', userId)
                               .single();

  if (data.push_notification_token !== req.body.expoPushToken) {
    const {data} = await supabase.from('users')
                                 .update({
                                   'push_notification_token': req.body.expoPushToken,
                                 })
                                 .eq('id', userId)
                                 .select();

    res.send(data);
  } else {
    res.send('No change needed.');
  }
}));

export default router;