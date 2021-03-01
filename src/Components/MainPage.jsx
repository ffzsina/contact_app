import {useEffect, useState} from "react";
import {ContactList, AddContact, DeleteContact} from "./ContactRequests";
import axios from "axios";

export function MainPage() {
    const [changeHappened, setChangeHappened] = useState(false);    //át kell alakítani
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/contacts`)
        .then(res => setContacts(res.data));
    }, []);

    if (changeHappened){
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/contacts`)
        .then(res => setContacts(res.data))
        .finally(setChangeHappened(false));
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <AddContact setChangeHappened={setChangeHappened}/>
                </div>
                <div className="col">
                    <ContactList contacts={contacts} changeHappened={changeHappened} setChangeHappened={setChangeHappened}/>
                </div>
            </div>
            <div className="row justify-content-end">
                <div className="col-6">
                    <div className="d-flex justify-content-center">
                        <button type="button" className="btn btn-primary">
                            Add a new contact
                        </button>
                    </div>
                </div>
            </div>
            <div className="row">
                <DeleteContact/>
            </div>
        </div>
    );
}
