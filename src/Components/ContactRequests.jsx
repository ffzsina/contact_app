import {useEffect, useState} from "react";
import axios from "axios";

export function ContactList(){
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/tasks`)
        .then(res => setContacts(res.data));
    }, []);

    return (
        <div className="border p-2 m-2">
            <h2>Contacts</h2>
            <ul className="list-group">
                {contacts.map(contact =>
                    <li key={contact.id} className="list-group-item">
                        <div>
                            {contact.name.firstName} {contact.name.lastName} <span className="small">({contact.id})</span>
                        </div>
                        <div>
                            phones:
                            <ul className="list-group">
                                {contact.phones.map((phone, i) =>
                                    <li key={i} className="list-group-item">
                                        {phone.number} <span className="small">({phone.type})</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div>
                            webs:
                            <ul className="list-group">
                                {contact.webs.map((web, i) =>
                                    <li key={i} className="list-group-item">
                                        {web}
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div>
                            address: {contact.address}
                        </div>
                    </li>    
                )}
            </ul>
        </div>
    );
}

export function AddContact(){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");

    const handleChangeFirst = event => {
        setFirstName(event.target.value);
    }
    const handleChangeLast = event => {
        setLastName(event.target.value);
    }
    const handleChangeAddress = event => {
        setAddress(event.target.value);
    }

    const handleSubmit = event => {
        event.preventDefault();
        const contact = {
            name :
            {
                firstName: firstName,
                lastName: lastName
            },
            phones: [
                {
                    type: "private",
                    number: "121315"
                },
                {
                    type: "office",
                    number: "78999"
                }
            ],
            webs: ["valami.io","www.mysite.com", "egyeb.hu"],
            address: address
        }

       axios.post('http://localhost:8080/api/tasks', contact);
    };

    return (
        <div className="border p-2 m-2">
            <h2>New contact</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Contact First Name:</label>
                    <input type="text" className="form-control" name="firstName" onChange={handleChangeFirst}/>
                </div>
                <div className="form-group">
                    <label>Contact Last Name:</label>
                    <input type="text" className="form-control" name="lastName" onChange={handleChangeLast}/>
                </div>
                <div className="form-group">
                    <label>Contact Address:</label>
                    <input type="text" className="form-control" name="address" onChange={handleChangeAddress}/>
                </div>
                <button type="submit" className="btn btn-primary">Add</button>
                
            </form>
        </div>
    );
}

export function DeleteContact(){
    const [id, setId] = useState(0);

    const handleChange = event => {
        setId(event.target.value);
    }

    const handleSubmit = event => {
        event.preventDefault();
        fetch(`http://localhost:8080/api/tasks/${id}`, {
            method: "DELETE"
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Contact ID:</label>
            <input type="text" name="id" onChange={handleChange}/>
            <button type="submit">Delete</button>
        </form>
    );
}