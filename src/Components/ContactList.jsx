import React, {useState, Fragment} from "react";
import {LangContext} from "../App";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faArrowLeft, faArrowRight, faArrowUp, faArrowDown} from "@fortawesome/free-solid-svg-icons";

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