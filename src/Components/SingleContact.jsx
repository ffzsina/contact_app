import React, {useState, Fragment} from "react";
import {Modal} from "./Modal";
import {LangContext} from "../App";
import axios from "axios";

export function SingleContact(props){
    const langCntx = React.useContext(LangContext);

    const [deleting, setDeleting] = useState(false);
    
    if (!props.selectedContact){
        return (
            <div id="WithBackgroundImage" className="border shadow p-3 mb-4 mt-4 rounded">
                <h3>{langCntx.dict[langCntx.langGetSet[0]].selectedContact}</h3>
                <h5>{langCntx.dict[langCntx.langGetSet[0]].notChoosenYet}</h5>
            </div>
        );
    }

    return (
        <Fragment>
            {deleting ?
            <Modal
                onApproved={async event => {
                    event.preventDefault();
                    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/contacts/${props.selectedContact.id}`);
                    props.setChangeHappened(true);
                    props.setSelectedContact();
                    setDeleting(false);
                }}
                onClosed={() => setDeleting(false)}
            >
                {langCntx.dict[langCntx.langGetSet[0]].deleteTextBegin} {props.selectedContact.name.firstName}{langCntx.dict[langCntx.langGetSet[0]].deleteTextEnd}
            </Modal>
            :
            ""
            }
            <div id="WithBackgroundImage" className="border shadow p-3 mb-4 mt-4 rounded">
                <h3>{langCntx.dict[langCntx.langGetSet[0]].selectedContact}</h3>
                <h1 className="bg-dark text-white text-center">
                    {langCntx.langGetSet[0]==="eng" ?
                            <span>{props.selectedContact.name.firstName} {props.selectedContact.name.lastName}</span>
                            :
                            <span>{props.selectedContact.name.lastName} {props.selectedContact.name.firstName}</span>
                    }
                </h1>
                <div className={(props.selectedContact.phones.length ? "" : "collapse")}>
                    <h5 className="my-3">{langCntx.dict[langCntx.langGetSet[0]].phones}</h5>
                    <ul className="list-group">
                        {props.selectedContact.phones.map((phone, i) =>
                            <li key={i} className="list-group-item">
                                {phone.number} <span className="small">({phone.type})</span>
                            </li>
                        )}
                    </ul>
                </div>
                <div className={(props.selectedContact.webs.length ? "" : "collapse")}>
                    <h5 className="my-3">{langCntx.dict[langCntx.langGetSet[0]].webs}</h5>
                    <ul className="list-group">
                        {props.selectedContact.webs.map((web, i) =>
                            <li key={i} className="list-group-item">
                                {web.name} <span className="small">({web.type})</span>
                            </li>
                        )}
                    </ul>
                </div>
                <div className={(props.selectedContact.address ? "" : "collapse")}>
                    <h5 className="my-3">{langCntx.dict[langCntx.langGetSet[0]].address}</h5>
                    <div className="list-group">
                        <div className="list-group-item">
                            {props.selectedContact.address}
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center border shadow-sm p-3 mb-4 mt-4 rounded bg-light">
                <button className="btn btn-danger mr-2" onClick={() => {setDeleting(true);}}>
                    {langCntx.dict[langCntx.langGetSet[0]].delete}
                </button>
                <button className="btn btn-dark" onClick={() => props.setWorking("editing")}>
                    {langCntx.dict[langCntx.langGetSet[0]].edit}
                </button>
            </div>
        </Fragment>
    );
}
