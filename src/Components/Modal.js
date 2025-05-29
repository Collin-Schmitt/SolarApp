import React from 'react';
import './Modal.css'; // Create a CSS file for styling the modal

const Modal = ({ show, handleClose, children }) => {
  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        {children}
      </div>
    </div>
  );
};

export default Modal;
