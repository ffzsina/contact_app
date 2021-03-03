import {useEffect, useState, Fragment} from "react";
import {Modal} from "./Modal";
import axios from "axios";

export function ContactList(props){

    return (
        <div className="border p-2 m-2">
            <h3>Contacts</h3>
            <ul className="list-group">
                {props.contacts.map(contact =>
                    <li key={contact.id} className={"list-group-item" + (contact===props.selectedContact ? " bg-dark text-white" : "")}
                        style={{cursor: "pointer"}} onClick={() => {props.setSelectedContact(contact);}}
                    >
                            {contact.name.firstName} {contact.name.lastName}
                    </li>    
                )}
            </ul>
        </div>
    );
}

export function AddContact(props){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [emailIds, setEmailIds] = useState([]);
    const [phoneIds, setPhoneIds] = useState([]);

    const handleChangeFirst = event => {
        setFirstName(event.target.value);
    }
    const handleChangeLast = event => {
        setLastName(event.target.value);
    }
    const handleChangeAddress = event => {
        setAddress(event.target.value);
    }

    const handleSubmit = async event => {
        event.preventDefault();
        const contact = {
            name :
            {
                firstName: firstName,
                lastName: lastName
            },
            phones: preparePhones(event.target.elements),
            webs: prepareEmails(event.target.elements),
            address: address
        }
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/contacts`, contact);
        props.setChangeHappened(true);
        props.setCreating(false);
    };

    return (
        <div className="border p-2 m-2">
            <h3>New contact</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group col">
                        <label>First name:</label>
                        <input type="text" className="form-control" name="firstName" placeholder="John" onChange={handleChangeFirst} required/>
                    </div>
                    <div className="form-group col">
                        <label>Last name:</label>
                        <input type="text" className="form-control" name="lastName" placeholder="Doe" onChange={handleChangeLast} required/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Phones:</label>
                        {phoneIds.map((phoneId, i) => (
                            <div key={phoneId} className="row m-2">
                                <select className="form-control col-3" name={"phone-type-" + i}>
                                    <option value="private">Private</option>
                                    <option value="office">Office</option>
                                </select>
                                <div className="col-6">
                                    <input type="text" name={"phone-number-" + i}
                                        className="form-control" placeholder="0670/..." required
                                    />
                                </div>
                                <div className="col-3">
                                    <button className="btn btn-danger btn-sm" type="button"
                                        onClick={() => {
                                            setPhoneIds((prevIds) => {
                                                const ret = [...prevIds];
                                                ret.splice(i, 1);
                                                return ret;
                                                });
                                            }
                                        }
                                    >
                                        Trash
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="row">
                            <div className="col-3 offset-9">
                                <button type="button" className="btn btn-success btn-sm"
                                    onClick={() => {
                                        setPhoneIds((prev) => [...prev, uuidv4()]);
                                    }}
                                >
                                    Plus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>E-mails:</label>
                        {emailIds.map((emailId, i) => (
                            <div key={emailId} className="row m-2">
                                <div className="col-9">
                                    <input type="text" name={"web-" + i}
                                        className="form-control" placeholder="e-mail or website" required
                                    />
                                </div>
                                <div className="col-3">
                                    <button className="btn btn-danger btn-sm" type="button"
                                        onClick={() => {
                                            setEmailIds((prevIds) => {
                                                const ret = [...prevIds];
                                                ret.splice(i, 1);
                                                return ret;
                                                });
                                            }
                                        }
                                    >
                                        Trash
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="row">
                            <div className="col-3 offset-9">
                                <button type="button" className="btn btn-success btn-sm"
                                    onClick={() => {
                                        setEmailIds((prev) => [...prev, uuidv4()]);
                                    }}
                                >
                                    Plus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <label>Address:</label>
                    <input type="text" className="form-control" name="address" placeholder="address" onChange={handleChangeAddress}/>
                </div>
                <button type="submit" className="btn btn-primary">Add</button>
                <button type="button" className="btn btn-danger" onClick={() => {props.setCreating(false);}}>X</button>
            </form>
        </div>
    );
}


export function SingleContact(props){

    const [deleting, setDeleting] = useState(false);

    if (!props.selectedContact){
        return (
            <div className="border p-2 m-2">
                <h3>Selected Contact</h3>
                <h5>not chosen yet</h5>
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
                    props.setCreating(false);
                    props.setSelectedContact();
                    setDeleting(false);
                }}
                onClosed={() => setDeleting(false)}
            >
            Biztosan törlöd a {props.selectedContact.name.firstName} kontaktját?
          </Modal>
            :
            ""
            }
            <div className="border p-2 m-2">
                <h3>Selected Contact</h3>
                <h1 className="bg-dark text-white text-center">
                    {props.selectedContact.name.firstName} {props.selectedContact.name.lastName}
                </h1>
                <p className="small">({props.selectedContact.id})</p>
                <div className={(props.selectedContact.phones.length ? "" : "collapse")}>
                    <h5>Phones</h5>
                    <ul className="list-group">
                        {props.selectedContact.phones.map((phone, i) =>
                            <li key={i} className="list-group-item">
                                {phone.number} <span className="small">({phone.type})</span>
                            </li>
                        )}
                    </ul>
                </div>
                <div className={(props.selectedContact.webs.length ? "" : "collapse")}>
                    <h5>Webs &amp; emails</h5>
                    <ul className="list-group">
                        {props.selectedContact.webs.map((web, i) =>
                            <li key={i} className="list-group-item">
                                {web}
                            </li>
                        )}
                    </ul>
                </div>
                <div className={(props.selectedContact.address ? "" : "collapse")}>
                    <h5>Address</h5>
                    <div className="list-group">
                        <div className="list-group-item">
                            {props.selectedContact.address}
                        </div>
                    </div>
                </div>
            </div>
            <div className="border p-2 m-2">
                <button onClick={() => {setDeleting(true);}}>
                    Trash
                </button>
                <button>
                    (Pencil)
                </button>
            </div>
        </Fragment>
    );
}

//stackoverflow
function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function prepareEmails(elements) {
    return Object.values(
        Object.entries(elements)
        .filter(([key, value]) => {
            if (value.name){ 
                const [dataType] = value.name.split("-");
                return dataType === "web";
            } else {return false;}
        })
        .map(([key, value]) => (
            value.value
        ))
    );
}

function preparePhones(elements) {
    return Object.values(
        Object.entries(elements)
        .filter(([key, value]) => {
            if (value.name){ 
                const [dataType] = value.name.split("-");
                return dataType === "phone";
            } else {return false;}
        })
        .reduce((acc, [key, value]) => {
            const [_, name, index] = value.name.split("-");
            return {
              ...acc,
              [index]: acc[index]
                ? {
                    ...acc[index],
                    [name]: value.value,
                  }
                : { [name]: value.value },
            };
          }, {})
    );
}