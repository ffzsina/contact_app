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
                <div className="col">
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
                <div className="col">
                    <ContactList contacts={contacts} setSelectedContact={setSelectedContact} selectedContact={selectedContact}/>
                    <div className="d-flex justify-content-center">
                        <button type="button" className="btn btn-primary" onClick={() => setCreating(true)}>
                            Add a new contact
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
