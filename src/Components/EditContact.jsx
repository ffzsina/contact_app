import React, {useState, useEffect} from "react";
import {uuidv4, prepare} from "./Accessories";
import {LangContext} from "../App";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";

export function EditContact(props){
    const langCntx = React.useContext(LangContext);

    const [webs, setWebs] = useState([]);
    const [phones, setPhones] = useState([]);

    useEffect(() => {
        setWebs(props.selectedContact.webs.map((web) => [uuidv4(), web]));
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
            phones: prepare("phone", event.target.elements),
            webs: prepare("web", event.target.elements),
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
                        <label>{langCntx.dict[langCntx.langGetSet[0]].webs}</label>
                        {webs.map(([webId, web], i) => (
                            <div key={webId} className="row m-2">
                                <select className="form-control col-3" name={"web-type-" + i} defaultValue={web.type}>
                                    <option value="site">{langCntx.dict[langCntx.langGetSet[0]].site}</option>
                                    <option value="email">{langCntx.dict[langCntx.langGetSet[0]].email}</option>
                                </select>
                                <div className="col-6">
                                    <input type="text" name={"web-name-" + i}
                                        className="form-control" defaultValue={web.name}
                                        placeholder="e-mail or website" required
                                        pattern=
                                        "^(((\w+)([\w-]*)(\.)?)*(\w+)(@[\w-]{2,20})\.([a-z]{2,6}))|(((https?):\/\/)?(www\.)?([\w]+-)*[\w]*\.([a-z]{2,6}))$"
                                        maxLength="35"
                                    />
                                </div>
                                <div className="col-3">
                                    <button className="btn btn-danger btn-sm" type="button"
                                        onClick={() => {
                                            setWebs((prevs) => {
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
                                        setWebs((prev) => [...prev, [uuidv4(), {type:"", name:""}]]);
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