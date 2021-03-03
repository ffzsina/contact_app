import React from "react";

export function Modal({ onClosed, onApproved, children }) {
    return (
    <div className="modal d-block">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Delete a contact card</h5>
                        <button type="button" className="close" onClick={onClosed}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClosed}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-danger" onClick={onApproved}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}