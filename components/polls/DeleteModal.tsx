import Button from "../common/Button";
interface DeleteModalProps {
  showModal: boolean;
  hideModal(): void;
  confirmModal(pollId: string): void;
  message: string;
  pollId: string
}

const DeleteConfirmation = ({ showModal, hideModal, confirmModal, message, pollId }: DeleteModalProps) => {
  return (
    <div className='fixed inset-0 bg-gray-900 bg-opacity-50 overflow-auto flex justify-self-auto' >
      <div className="flex items-center bg-white rounded-lg p-8 shadow-lg w-full max-w-md overflow-scroll m-auto">
        <div className="text-red-700 rounded-2xl text-center">{message}</div>
        <Button variant="primary" onClick={hideModal}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => confirmModal(pollId)}>
          Delete
        </Button>
      </div>
    </div>
  )
}

export default DeleteConfirmation;

