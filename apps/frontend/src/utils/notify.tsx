import { toast } from 'sonner';
import i18n from '@/i18n';

export function notifyError(message: string): void {
  toast.error(i18n.t('notify.errorTitle'), { description: message, duration: 6000 });
}

export function notifySuccess(message: string): void {
  toast.success(message);
}
