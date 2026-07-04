import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item? This action is permanent and cannot be undone.',
  itemName = '',
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col gap-4">
        <div className="flex gap-3.5 items-start p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
          <AlertTriangle className="flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1 text-xs leading-relaxed">
            <span className="font-semibold block mb-1">Warning: Deleting Data</span>
            {message} {itemName && <strong className="text-rose-300 font-bold">"{itemName}"</strong>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
            className="border-slate-800 hover:bg-slate-800 text-slate-350"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
            className="bg-rose-600 hover:bg-rose-500 text-white focus:ring-rose-500/20"
          >
            Delete Permanently
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
