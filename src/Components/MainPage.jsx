import {useEffect, useState} from "react";
import {ContactList, AddContact, SingleContact} from "./ContactRequests";
import axios from "axios";

export function MainPage() {
    const [changeHappened, setChangeHappened] = useState(false);    //át kell alakítani
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState();
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/contacts`)
        .then(res => setContacts(res.data));
    }, []);

    if (changeHappened) {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/contacts`)
        .then(res => setContacts(res.data))
        .finally(setChangeHappened(false));
    }

    return (
        <div className="container">
            {changeHappened}
            <div className="row">
                <div className="col-md">
                    <ContactList contacts={contacts} setSelectedContact={setSelectedContact} selectedContact={selectedContact}/>
                    <div className="d-flex justify-content-center border shadow-sm p-3 mb-4 mt-4 rounded bg-light">
                        <button type="button" className="btn btn-dark" onClick={() => setCreating(true)}>
                            Add a new contact
                        </button>
                    </div>
                </div>
                <div className="col-md">
                    {creating ?
                        <AddContact
                            setChangeHappened={setChangeHappened}
                            setCreating={setCreating}
                        />
                        :
                        <SingleContact
                            selectedContact={selectedContact}
                            setSelectedContact={setSelectedContact}
                            setChangeHappened={setChangeHappened}
                            setCreating={setCreating}
                        />
                    }
                </div>
            </div>
        </div>
    );
}
