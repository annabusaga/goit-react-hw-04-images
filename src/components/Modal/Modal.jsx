import { useEffect } from 'react';
import css from './Modal.module.css';

// import { PropTypes } from 'prop-types';

const Modal = ({ modalOnClick, largeImageURL, tags }) => {
  const handlerClick = event => {
    if (event.target === event.currentTarget) {
      modalOnClick();
    }
  };

  useEffect(() => {
    const onClose = event => {
      if (event.code === 'Escape') {
        modalOnClick();
      }
    };
    window.addEventListener('keydown', onClose);

    return () => {
      window.removeEventListener('keydown', onClose);
    };
  }, [modalOnClick]);

  return (
    <>
      <div onClick={handlerClick} className={css.overlay}>
        <div className={css.modal}>
          <img src={largeImageURL} alt={tags} />
        </div>
      </div>
      ;
    </>
  );
};

Modal.propTypes = {
  //   contacts: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       id: PropTypes.string.isRequired,
  //       name: PropTypes.string.isRequired,
  //       number: PropTypes.string.isRequired,
  //     }).isRequired
  //   ).isRequired,
  //   onDeleteTodo: PropTypes.func.isRequired,
};

export default Modal;
