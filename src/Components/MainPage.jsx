import {useEffect, useState, Fragment} from "react";
import {AddContactButton, AddContact} from "./AddContact";
import {ContactList} from "./ContactList";
import {SingleContact} from "./SingleContact";
import {EditContact} from "./EditContact";
import axios from "axios";

export function MainPage() {
    const [changeHappened, setChangeHappened] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState();
    const [working, setWorking] = useState("idle");

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/contacts`)
        .then(res => setContacts(res.data));
    }, []);

    if (changeHappened) {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/contacts`)
        .then(res => setContacts(res.data))
        .then(() => setSelectedContact(""))
        .finally(setChangeHappened(false));
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md">
                    {working==="idle" ?
                        <Fragment>
                            <ContactList
                                contacts={contacts}
                                setSelectedContact={setSelectedContact}
                                selectedContact={selectedContact}
                            />
                            <AddContactButton
                                setWorking={setWorking}
                            />
                        </Fragment>
                        :
                        <div style={{pointerEvents: "none", opacity: 0.5}}>
                            <ContactList
                                contacts={contacts}
                                setSelectedContact={setSelectedContact}
                                selectedContact={selectedContact}
                            />
                        </div>
                    }
                </div>
                <div className="col-md">
                    {working==="creating" ?
                        <AddContact
                            setChangeHappened={setChangeHappened}
                            setWorking={setWorking}
                        />
                        :
                        (working==="editing" ?
                        <EditContact
                            setChangeHappened={setChangeHappened}
                            setWorking={setWorking}
                            selectedContact={selectedContact}
                            setSelectedContact={setSelectedContact}
                        />
                        :
                        <SingleContact
                            selectedContact={selectedContact}
                            setSelectedContact={setSelectedContact}
                            setChangeHappened={setChangeHappened}
                            setWorking={setWorking}
                        />
                        )
                    }
                </div>
            </div>
        </div>
    );
}
