import { getCurrentInstance } from '@vue/composition-api';

interface IDialogOptions {
  type: 'alert' | 'confirm';
  title: string;
  icon: string;
  message: string;
  click?(): void;
  onCancel?(): void;
  cancelMessage: string;
}

const defaultAlertOptions: IDialogOptions = {
  type: 'alert',
  title: '경고',
  message: '',
  icon: '',
  cancelMessage: '',
};

const defaultConfirmOptions: IDialogOptions = {
  type: 'confirm',
  title: '알림',
  message: '',
  icon: '',
  cancelMessage: '',
};

export default function useDialog() {
  const instance = getCurrentInstance();

  function alert(options: Partial<IDialogOptions> = {}) {
    const { type, title, icon, message, click, onCancel, cancelMessage } = { ...defaultAlertOptions, ...options };
    return instance.proxy.$alert({ type, title, icon, message, click, onCancel, cancelMessage });
  }

  function confirm(options: Partial<IDialogOptions> = {}) {
    const { type, title, icon, message, click, onCancel, cancelMessage } = { ...defaultConfirmOptions, ...options };
    return instance.proxy.$confirm({ type, title, icon, message, click, onCancel, cancelMessage });
  }

  return {
    alert,
    confirm,
  };
}
