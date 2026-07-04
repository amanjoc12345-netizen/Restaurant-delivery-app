import React from 'react';
import Modal from './Modal';
import Button from './Button';

const FormModal = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  loading = false,
  submitText = 'Save Changes',
  cancelText = 'Cancel',
  children,
  size = 'md',
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {children}
        </div>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
            className="border-slate-800 hover:bg-slate-800 text-slate-350"
          >
            {cancelText}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={loading}
            disabled={loading}
          >
            {submitText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;
