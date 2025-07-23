import { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const Modal = ({ isOpen, closeModal }: ModalProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeModal();
      setIsClosing(false);
    }, 300);
  };

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleFormClick = () => {
    window.open('https://forms.gle/e3tUiDnJpNUAM1777', '_blank');
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center z-50 ${
          isClosing ? 'animate-fade-out' : 'animate-fade-in'
        }`}
        onClick={handleClose}
      >
        <div
          className={`bg-white rounded-2xl p-6 sm:p-8 md:p-10 max-w-sm sm:max-w-md md:max-w-lg w-11/12 text-center shadow-2xl border border-violet-100 relative ${
            isClosing ? 'animate-slide-down' : 'animate-slide-up'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 w-8 h-8 rounded-full flex items-center justify-center text-violet-400 hover:bg-violet-50 hover:text-violet-600 transition-all duration-200 text-xl sm:text-2xl leading-none"
          >
            ×
          </button>

          <div className="mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-violet-50 to-purple-50 rounded-full mx-auto mb-6 flex items-center justify-center shadow-sm">
              <span className="text-3xl sm:text-4xl">⏰</span>
            </div>

            <h2 className="text-violet-600 text-2xl sm:text-3xl md:text-4xl font-bold mb-3 tracking-tight">
              Próximamente
            </h2>

            <p className="text-violet-500 text-lg sm:text-xl font-semibold mb-6">
              En agosto para todo el mundo
            </p>

            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 sm:p-5 mb-6 border border-violet-100">
              <p className="text-violet-700 text-sm sm:text-base font-medium mb-3">
                Si sos comercio, ya podés guardar tu lugar
              </p>
              
              <button
                onClick={handleFormClick}
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold py-3 px-6 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 text-sm sm:text-base"
              >
                Sumate ahora
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-fade-out {
          animation: fadeOut 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
        }
      `}</style>
    </>
  );
};

export default Modal;