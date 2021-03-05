import {useEffect, useState, Fragment} from "react";
import {ContactList, AddContact, SingleContact, AddContactButton} from "./ContactRequests";
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
            <div className="row">
                <div className="col-md">
                    {creating ?
                        <div style={{pointerEvents: "none", opacity: 0.5}}>
                            <ContactList
                                contacts={contacts}
                                setSelectedContact={setSelectedContact}
                                selectedContact={selectedContact}
                            />
                        </div>
                        :
                        <Fragment>
                            <ContactList
                                contacts={contacts}
                                setSelectedContact={setSelectedContact}
                                selectedContact={selectedContact}
                            />
                            <AddContactButton
                                setCreating={setCreating}
                            />
                        </Fragment>
                    }
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
