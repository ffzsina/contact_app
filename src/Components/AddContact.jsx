import React, {useState} from "react";
import {uuidv4, prepareWebs, preparePhones} from "./Accessories";
import {LangContext} from "../App";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";

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

    const [webIds, setWebIds] = useState([]);
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
            webs: prepareWebs(event.target.elements),
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
                        <label>{langCntx.dict[langCntx.langGetSet[0]].webs}</label>
                        {webIds.map((webId, i) => (
                            <div key={webId} className="row m-2">
                                <select className="form-control col-3" name={"web-type-" + i}>
                                    <option value="site">{langCntx.dict[langCntx.langGetSet[0]].site}</option>
                                    <option value="email">{langCntx.dict[langCntx.langGetSet[0]].email}</option>
                                </select>
                                <div className="col-6">
                                    <input type="text" name={"web-name-" + i}
                                        className="form-control" placeholder="e-mail or website" required
                                        pattern=
                                        "^(((\w+)([\w-]*)(\.)?)*(\w+)(@[\w-]{2,20})\.([a-z]{2,6}))|(((https?):\/\/)?(www\.)?([\w]+-)*[\w]*\.([a-z]{2,6}))$"
                                        maxLength="35"
                                    />
                                </div>
                                <div className="col-3">
                                    <button className="btn btn-danger btn-sm" type="button"
                                        onClick={() => {
                                            setWebIds((prevIds) => {
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
                                        setWebIds((prev) => [...prev, uuidv4()]);
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