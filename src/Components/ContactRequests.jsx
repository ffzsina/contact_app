import React, {useState, Fragment, useEffect} from "react";
import {Modal} from "./Modal";
import {LangContext} from "../App";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faArrowLeft, faArrowRight, faArrowUp, faArrowDown, faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";

export function ContactList(props){
    const langCntx = React.useContext(LangContext);

    const [finder, setFinder] = useState("");
    const [firstListItem, setFirstListItem] = useState(0);

    const handleChangeFinder = event => {
        setFinder(event.target.value);
        setFirstListItem(0);
    }

    function filterBySearch(searched){
        if(langCntx.langGetSet[0]==="eng"){
            return (searched.name.firstName+" "+searched.name.lastName).toLowerCase().includes(finder.toLowerCase());
        }
        return (searched.name.lastName+" "+searched.name.firstName).toLowerCase().includes(finder.toLowerCase());
    }

    const orderByLastName = (a, b) => (a.name.lastName > b.name.lastName ? 1 : -1);

    const searchedNames = props.contacts
        .filter(searched => filterBySearch(searched))
        .sort(orderByLastName);

    function filterByPagination(i, range){
        return (i >= firstListItem && i < (firstListItem+range));
    }

    return (
        <Fragment>
        <div id="VerticalContactList" className="border shadow p-3 mb-4 mt-4 rounded">
            <div className="row">
                <h3 className="col">{langCntx.dict[langCntx.langGetSet[0]].contacts}</h3>
                <div className="col m-2 input-group">
                    <h5 className="p-1">{<FontAwesomeIcon icon={faSearch}/>}</h5>
                    <input type="text" className="form-control"
                        placeholder={langCntx.dict[langCntx.langGetSet[0]].typeAName}
                        onChange={handleChangeFinder}
                    />
                </div>
            </div>
            <ul className="list-group" id="ContactList">
                <li className={"list-group-item text-white text-center mb-1" + (firstListItem<=0 ? " disabled bg-light" : " bg-secondary")}
                    style={{cursor: "pointer"}} onClick={() => setFirstListItem(prev => (prev - 1))}
                >
                    <FontAwesomeIcon icon={faArrowUp}/>
                </li>
                {searchedNames
                .filter((listItem, i) => filterByPagination(i,5))
                .map(contact =>
                    <li key={contact.id} className={"list-group-item border" + (contact===props.selectedContact ? " bg-dark text-white" : "")}
                        style={{cursor: "pointer"}} onClick={() => {props.setSelectedContact(contact);}}
                    >
                        {langCntx.langGetSet[0]==="eng" ?
                            <span>{contact.name.firstName} <strong>{contact.name.lastName}</strong></span>
                            :
                            <span><strong>{contact.name.lastName}</strong> {contact.name.firstName}</span>
                        }
                    </li>    
                )}
                <li className={"list-group-item text-white text-center mt-1" + (firstListItem>=searchedNames.length-5 ? " disabled bg-light" : " bg-secondary")}
                    style={{cursor: "pointer"}} onClick={() => setFirstListItem(prev => (prev + 1))}
                >
                    <FontAwesomeIcon icon={faArrowDown}/>
                </li>
            </ul>
        </div>
        <div id="HorizontalContactList" className="border shadow p-3 mb-4 mt-4 rounded">
            <div className="row">
                <h3 className="col">{langCntx.dict[langCntx.langGetSet[0]].contacts}</h3>
                <div className="col m-2 input-group">
                    <h5 className="p-1">{<FontAwesomeIcon icon={faSearch}/>}</h5>
                    <input type="text" className="form-control"
                        placeholder={langCntx.dict[langCntx.langGetSet[0]].typeAName}
                        onChange={handleChangeFinder}
                    />
                </div>
            </div>
            <div className="row">
                <Fragment>
                    <button className="btn btn-sm btn-secondary mr-1 ml-3"
                        disabled={firstListItem<=0 ? true : false}
                        onClick={() => setFirstListItem(prev => (prev - 1))}
                    >
                        <FontAwesomeIcon icon={faArrowLeft}/>
                    </button>
                    {searchedNames
                    .filter((listItem, i) => filterByPagination(i,3))
                    .map(contact =>
                        <div key={contact.id} className={"col border rounded text-center" + (contact===props.selectedContact ? " bg-dark text-white" : "")}
                            style={{cursor: "pointer"}} onClick={() => {props.setSelectedContact(contact);}}
                        >
                        {langCntx.langGetSet[0]==="eng" ?
                            <span>{contact.name.firstName[0]}. <strong>{contact.name.lastName[0]}.</strong></span>
                            :
                            <span><strong>{contact.name.lastName[0]}.</strong> {contact.name.firstName[0]}.</span>
                        }
                        </div>    
                    )}
                    <button className="btn btn-sm btn-secondary ml-1 mr-3"
                        disabled={firstListItem>=searchedNames.length-3 ? true : false}
                        onClick={() => setFirstListItem(prev => (prev + 1))}
                    >
                        <FontAwesomeIcon icon={faArrowRight}/>
                    </button>
                </Fragment>
            </div>
        </div>
        </Fragment>
    );
}

export function AddContactButton(props){
    const langCntx = React.useContext(LangContext);

    return(
        <div className="d-flex justify-content-center border shadow-sm p-3 mb-4 mt-4 rounded bg-light">
            <button type="button" className="btn btn-dark" onClick={() => props.setWorking("creating")}>
                {langCntx.dict[langCntx.langGetSet[0]].addANewContact}
            </button>
        </div>
    );
}

export function AddContact(props){
    const langCntx = React.useContext(LangContext);

    const [emailIds, setEmailIds] = useState([]);
    const [phoneIds, setPhoneIds] = useState([]);

    const handleSubmit = async event => {
        event.preventDefault();
        const contact = {
            name :
            {
                firstName: event.target.elements.firstName.value,
                lastName: event.target.elements.lastName.value
            },
            phones: preparePhones(event.target.elements),
            webs: prepareEmails(event.target.elements),
            address: event.target.elements.address.value
        }
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/contacts`, contact);
        props.setChangeHappened(true);
        props.setWorking("idle");
    };

    return (
        <form onSubmit={handleSubmit}>
            <div id="WithBackgroundImage" className="border shadow p-3 mb-4 mt-4 rounded">
                <h3>{langCntx.dict[langCntx.langGetSet[0]].newContact}</h3>
                <div className="form-row">
                    <div className="form-group col">
                        <label>{langCntx.dict[langCntx.langGetSet[0]].firstName}:</label>
                        <input type="text" className="form-control" name="firstName"
                            placeholder={langCntx.dict[langCntx.langGetSet[0]].firstNameExample}
                            pattern="^[A-ZÀ-ÝŐŰ][a-zà-ÿőű]{2,}(\s[A-ZÀ-ÝŐŰ][a-zà-ÿőű]{2,})?$" required
                        />
                    </div>
                    <div className="form-group col">
                        <label>{langCntx.dict[langCntx.langGetSet[0]].lastName}:</label>
                        <input type="text" className="form-control" name="lastName"
                            placeholder={langCntx.dict[langCntx.langGetSet[0]].lastNameExample}
                            pattern="^([A-Z]?[a-z]{1,4}\.?\s)?[A-ZÀ-ÝŐŰ][a-zà-ÿőű]{2,}(-[A-ZÀ-ÝŐŰ][a-zà-ÿőű]{2,})?$" required
                        />
                    </div>            
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>{langCntx.dict[langCntx.langGetSet[0]].phones}:</label>
                        {phoneIds.map((phoneId, i) => (
                            <div key={phoneId} className="row m-2">
                                <select className="form-control col-3" name={"phone-type-" + i}>
                                    <option value="private">{langCntx.dict[langCntx.langGetSet[0]].private}</option>
                                    <option value="office">{langCntx.dict[langCntx.langGetSet[0]].office}</option>
                                </select>
                                <div className="col-6">
                                    <input type="text" name={"phone-number-" + i}
                                        className="form-control" placeholder="+3670..." required
                                        pattern="^(\+?\d{1,3})?\s?(\(\d{1,4}\))?(\d{1,2}\/)?[\d\s\.\-]{5,12}$"
                                        maxLength="16"
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
                                        <FontAwesomeIcon icon={faMinus}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="row">
                            <div className="col-3 offset-9">
                                <button type="button" className="btn btn-secondary btn-sm"
                                    onClick={() => {
                                        setPhoneIds((prev) => [...prev, uuidv4()]);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlus}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>{langCntx.dict[langCntx.langGetSet[0]].emails}</label>
                        {emailIds.map((emailId, i) => (
                            <div key={emailId} className="row m-2">
                                <div className="col-9">
                                    <input type="text" name={"web-" + i}
                                        className="form-control" placeholder="e-mail or website" required
                                        pattern=
                                        "^(((\w+)([\w-]*)(\.)?)*(\w+)(@[\w-]{2,20})\.([a-z]{2,6}))|(((https?):\/\/)?(www\.)?([\w]+-)*[\w]*\.([a-z]{2,6}))$"
                                        maxLength="35"
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
                                        <FontAwesomeIcon icon={faMinus}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="row">
                            <div className="col-3 offset-9">
                                <button type="button" className="btn btn-secondary btn-sm"
                                    onClick={() => {
                                        setEmailIds((prev) => [...prev, uuidv4()]);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlus}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <label>{langCntx.dict[langCntx.langGetSet[0]].address}:</label>
                    <input type="text" className="form-control" name="address" maxLength="65"
                        placeholder={langCntx.dict[langCntx.langGetSet[0]].address}
                    />
                </div>
            </div>
            <div className="d-flex justify-content-center border shadow-sm p-3 mb-4 mt-4 rounded bg-light">
                <button type="submit" className="btn btn-dark mr-2">{langCntx.dict[langCntx.langGetSet[0]].add}</button>
                <button type="button" className="btn btn-danger" onClick={() => {props.setWorking("idle");}}>{langCntx.dict[langCntx.langGetSet[0]].cancel}</button>
            </div>
        </form>
    );
}

export function EditContact(props){
    const langCntx = React.useContext(LangContext);

    const [emails, setEmails] = useState([]);
    const [phones, setPhones] = useState([]);

    useEffect(() => {
        setEmails(props.selectedContact.webs.map((email) => [uuidv4(), email]));
    }, []);

    useEffect(() => {
        setPhones(props.selectedContact.phones.map((phone) => [uuidv4(), phone]));
    }, []);

    const handleSubmit = async event => {
        event.preventDefault();
        const contact = {
            name :
            {
                firstName: event.target.elements.firstName.value,
                lastName: event.target.elements.lastName.value
            },
            phones: preparePhones(event.target.elements),
            webs: prepareEmails(event.target.elements),
            address: event.target.elements.address.value
        }
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/contacts/${props.selectedContact.id}`, contact);
        props.setChangeHappened(true);
        props.setWorking("idle");
    };

    return (
        <form onSubmit={handleSubmit}>
            <div id="WithBackgroundImage" className="border shadow p-3 mb-4 mt-4 rounded">
                <h3>{langCntx.dict[langCntx.langGetSet[0]].editContact}</h3>
                <div className="form-row">
                    <div className="form-group col">
                        <label>{langCntx.dict[langCntx.langGetSet[0]].firstName}:</label>
                        <input type="text" className="form-control" name="firstName"
                            defaultValue={props.selectedContact.name.firstName}
                            placeholder={langCntx.dict[langCntx.langGetSet[0]].firstNameExample}
                            pattern="^[A-ZÀ-ÝŐŰ][a-zà-ÿőű]{2,}(\s[A-ZÀ-ÝŐŰ][a-zà-ÿőű]{2,})?$" required
                        />
                    </div>
                    <div className="form-group col">
                        <label>{langCntx.dict[langCntx.langGetSet[0]].lastName}:</label>
                        <input type="text" className="form-control" name="lastName"
                            defaultValue={props.selectedContact.name.lastName}
                            placeholder={langCntx.dict[langCntx.langGetSet[0]].lastNameExample}
                            pattern="^([A-Z]?[a-z]{1,4}\.?\s)?[A-ZÀ-ÝŐŰ][a-zà-ÿőű]{2,}(-[A-ZÀ-ÝŐŰ][a-zà-ÿőű]{2,})?$" required
                        />
                    </div>            
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>{langCntx.dict[langCntx.langGetSet[0]].phones}:</label>
                        {phones.map(([phoneId, phone], i) => (
                            <div key={phoneId} className="row m-2">
                                <select className="form-control col-3" name={"phone-type-" + i} defaultValue={phone.type}>
                                    <option value="private">{langCntx.dict[langCntx.langGetSet[0]].private}</option>
                                    <option value="office">{langCntx.dict[langCntx.langGetSet[0]].office}</option>
                                </select>
                                <div className="col-6">
                                    <input type="text" name={"phone-number-" + i}
                                        className="form-control" defaultValue={phone.number}
                                        placeholder="+3670..." required
                                        pattern="^(\+?\d{1,3})?\s?(\(\d{1,4}\))?(\d{1,2}\/)?[\d\s\.\-]{5,12}$"
                                        maxLength="16"
                                    />
                                </div>
                                <div className="col-3">
                                    <button className="btn btn-danger btn-sm" type="button"
                                        onClick={() => {
                                            setPhones((prevs) => {
                                                const ret = [...prevs];
                                                ret.splice(i, 1);
                                                return ret;
                                                });
                                            }
                                        }
                                    >
                                        <FontAwesomeIcon icon={faMinus}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="row">
                            <div className="col-3 offset-9">
                                <button type="button" className="btn btn-secondary btn-sm"
                                    onClick={() => {
                                        setPhones((prev) => [...prev, [uuidv4(), {type:"", number:""}]]);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlus}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>{langCntx.dict[langCntx.langGetSet[0]].emails}</label>
                        {emails.map(([emailId, email], i) => (
                            <div key={emailId} className="row m-2">
                                <div className="col-9">
                                    <input type="text" name={"web-" + i}
                                        className="form-control" defaultValue={email}
                                        placeholder="e-mail or website" required
                                        pattern=
                                        "^(((\w+)([\w-]*)(\.)?)*(\w+)(@[\w-]{2,20})\.([a-z]{2,6}))|(((https?):\/\/)?(www\.)?([\w]+-)*[\w]*\.([a-z]{2,6}))$"
                                        maxLength="35"
                                    />
                                </div>
                                <div className="col-3">
                                    <button className="btn btn-danger btn-sm" type="button"
                                        onClick={() => {
                                            setEmails((prevs) => {
                                                const ret = [...prevs];
                                                ret.splice(i, 1);
                                                return ret;
                                                });
                                            }
                                        }
                                    >
                                        <FontAwesomeIcon icon={faMinus}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="row">
                            <div className="col-3 offset-9">
                                <button type="button" className="btn btn-secondary btn-sm"
                                    onClick={() => {
                                        setEmails((prev) => [...prev, [uuidv4(), ""]]);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlus}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <label>{langCntx.dict[langCntx.langGetSet[0]].address}:</label>
                    <input type="text" className="form-control" name="address" maxLength="65"
                        defaultValue={props.selectedContact.address}
                        placeholder={langCntx.dict[langCntx.langGetSet[0]].address}
                    />
                </div>
            </div>
            <div className="d-flex justify-content-center border shadow-sm p-3 mb-4 mt-4 rounded bg-light">
                <button type="submit" className="btn btn-dark mr-2">{langCntx.dict[langCntx.langGetSet[0]].saveChanges}</button>
                <button type="button" className="btn btn-danger" onClick={() => {props.setWorking("idle");}}>{langCntx.dict[langCntx.langGetSet[0]].cancel}</button>
            </div>
        </form>
    );
}

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
                    <h5 className="my-3">{langCntx.dict[langCntx.langGetSet[0]].emails}</h5>
                    <ul className="list-group">
                        {props.selectedContact.webs.map((web, i) =>
                            <li key={i} className="list-group-item">
                                {web}
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

//stackoverflow
function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
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